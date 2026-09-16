#!/usr/bin/env python3
"""Turn a screen recording of a bulk run into a looping, sped-up web clip.

Burns in a header with the speed ("12× speed") and a real-time clock, so the
clip never implies the run was faster than it was. Optional blur boxes cover
student names. Writes <out>.mp4 (H.264, no audio, faststart) and <out>-poster.webp.

Examples
  # preview a frame first so you can find blur coordinates (in source pixels)
  python3 make_bulk_timelapse.py bulk.mov --frame-at 30

  # 3-minute excerpt at 12x, names blurred, first 5 s trimmed
  python3 make_bulk_timelapse.py bulk.mov -o bulk-run --speed 12 --start 5 \
      --blur 0:180:220:900 --crop 220:0:1700:1080

Needs ffmpeg + ffprobe on PATH.
"""
import argparse, shutil, subprocess, sys, tempfile
from pathlib import Path


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)
    return r.stdout


def duration(path):
    return float(run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                      "-show_entries", "stream=duration", "-of", "csv=p=0", path]).strip())


def font(name, fallback):
    p = run(["fc-match", "-f", "%{file}", name]).strip() if shutil.which("fc-match") else ""
    return p or fallback


def box(s):
    x, y, w, h = (int(v) for v in s.split(":"))
    return x, y, w, h


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("-o", "--out", default="bulk-run")
    ap.add_argument("--speed", type=float, default=12, help="playback multiplier (default 12)")
    ap.add_argument("--start", type=float, default=0, help="seconds to skip at the start")
    ap.add_argument("--end", type=float, help="stop at this source time (seconds)")
    ap.add_argument("--crop", type=box, help="x:y:w:h in source pixels, applied before blur")
    ap.add_argument("--blur", type=box, action="append", default=[],
                    help="x:y:w:h (coordinates AFTER --crop). Repeatable.")
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--title", default="Bulk clear, unattended")
    ap.add_argument("--hold", type=float, default=2, help="seconds to hold the last frame")
    ap.add_argument("--frame-at", type=float, help="just export a PNG of this source time and exit")
    a = ap.parse_args()

    if a.frame_at is not None:
        out = f"{a.out}-frame.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.frame_at), "-i", a.src, "-frames:v", "1", out])
        print(f"wrote {out} - open it, note name-column pixel coordinates for --crop/--blur")
        return

    end = a.end or duration(a.src)
    real_len = end - a.start
    bold = font("Poppins:bold", "DejaVuSans-Bold.ttf")
    mono = font("DejaVu Sans Mono:bold", "DejaVuSansMono-Bold.ttf")
    S, HEAD = a.speed, 64
    ink, bg = "0x1B2433", "0xE9ECEF"
    speed_txt = f"{S:g}×"

    f = [f"[0:v]trim={a.start}:{end},setpts=PTS-STARTPTS"]
    if a.crop:
        x, y, w, h = a.crop
        f[-1] += f",crop={w}:{h}:{x}:{y}"
    f[-1] += "[base]"
    cur = "base"
    for i, (x, y, w, h) in enumerate(a.blur):
        f.append(f"[{cur}]split[m{i}][c{i}]")
        f.append(f"[c{i}]crop={w}:{h}:{x}:{y},boxblur=20:3[b{i}]")
        f.append(f"[m{i}][b{i}]overlay={x}:{y}[o{i}]")
        cur = f"o{i}"
    clock = (f"%{{eif\\:floor(t*{S}/60)\\:d}}\\:%{{eif\\:mod(floor(t*{S})\\,60)\\:d\\:2}}")
    f.append(
        f"[{cur}]setpts=PTS/{S},fps=30,scale={a.width}:-2:flags=lanczos,"
        f"pad=iw:ih+{HEAD}:0:{HEAD}:color={bg},"
        f"drawtext=fontfile={bold}:text='{a.title}':fontsize=26:fontcolor={ink}:x=16:y=({HEAD}-th)/2,"
        f"drawtext=fontfile={mono}:text='{speed_txt} speed   {clock} elapsed':fontsize=24:fontcolor={ink}:"
        f"x=w-tw-16:y=({HEAD}-th)/2,"
        f"tpad=stop_mode=clone:stop_duration={a.hold},format=yuv420p[v]"
    )
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as fh:
        fh.write(";\n".join(f))
        script = fh.name

    mp4 = f"{a.out}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-filter_complex_script", script,
         "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
         "-profile:v", "high", "-movflags", "+faststart", mp4])
    out_len = duration(mp4)
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(max(0, out_len - a.hold - 0.5)), "-i", mp4,
         "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", f"{a.out}-poster.webp"])
    size = Path(mp4).stat().st_size / 1e6
    print(f"{mp4}: {out_len:.1f}s clip covering {real_len/60:.1f} min of real time at {speed_txt}, {size:.1f} MB")
    if size > 4:
        print("  over ~4 MB: raise --speed, trim with --start/--end, or lower --width")


if __name__ == "__main__":
    main()
