# Kumon case study media

Everything for `matthewclau.com/projects/kumon-automation` except the bulk run.
Open `kumon-media-embed.html` locally to preview it all in place.

## What's here

| File | Goes in section | Notes |
|---|---|---|
| `video/race-side.mp4` + poster | Under the intro | 1424×648, 52.8 s loop, 0.9 MB, no audio. Live as `race-side-3.mp4` (extension side edited, see below); the page crops it into two synced panels (`site/scripts/race-comparison.js`) |
| `video/race-stacked.mp4` + poster | Unused since the race-comparison hero | 720×1312; the two-panel hero stacks the side clip on phones instead |
| `img/worksheet-annotated(.webp, @2x)` | The problem | Badges 1–3 match the caption's list |
| `img/popup-*.webp` | Approach → Design | All three states (other tab, worksheet, gradebook), 1× captures |
| `img/status-*.webp` | Approach → Design | Transparent corners, pulled from the extension clip |
| `kumon-media-embed.html` | — | Figures, CSS, and JS to copy into the page |
| `scripts/make-race.sh` | — | Rebuilds the race clip |
| `scripts/make_bulk_timelapse.py` | — | Builds the bulk clip this afternoon |

No WebM: VP9 came out larger than H.264 for this screen footage, so MP4 alone is the smaller download.

The embed JS plays each video only while it's on screen, starts paused under `prefers-reduced-motion`, and adds a Pause/Play button (WCAG 2.2.2 requires one for moving content longer than 5 s). Posters and `width`/`height` are set so nothing shifts on load.

## Numbers measured from the footage

- **By hand: 50.7 s.** That's the end of the clip. The "C II 181–185 has been marked" confirm bar appears at 43.3 s. If you were already finished at that point, rebuild with `43.3` as the manual time.
- **Extension: 9.6 s** from the start of the clip, including opening the popup. The status bar appears at 5.2 s, so the run itself is about 4.4 s.
- About 5× faster on one set. The bigger difference is that the extension needs one click and no attention.
- **Live clip (`race-side-3.mp4`): extension edited, page times it to 2.3 s.** The first 2.2 s (idle, before the icon click) are cut and 2.2–4.9 s (popup open, moving to the button) plays at 4×: 9.6 − 2.2 − 2.7 × ¾ = 5.375 s to the end of the reload. The page stops the timer at 2.3 s instead (original 6.5 s): the "has been marked" bar is up by 1.9 s and the page clears at ~2.1 s, and the rest is the home page loading, which is not part of the task. The video keeps playing under the Done overlay. The page stats (22×, 48.4 s, 22 sets) are clip numbers, and the caption says so.

The page copy now follows the clip: "hours" of clicking at about 50 s a set, not "multi-day" (2026-09-17). At about 51 s per set, 200 sets is under 3 hours.

## Before you record

- [ ] **Fix the toast wrap.** The Done toast breaks a word mid-way ("complet / ed"). Look for `word-break: break-all` or `overflow-wrap: anywhere` on the status bar text, and fix it first so the new footage is clean.

## This afternoon

- [x] Screenshot the popup on the gradebook (done). Optional: retake all three at 200% Windows display scale for sharper retina display.
- [ ] Screenshot the gradebook before the run, with eraser icons on old sets.
- [ ] Record the bulk run with the name column cropped off, like the single-set clip.
- [ ] Screenshot the gradebook after the run.
- [ ] Count how many sets cleared during the recorded span, for the caption.

## Building the bulk clip

```bash
# 1. export a frame to find crop/blur coordinates (source pixels)
python3 scripts/make_bulk_timelapse.py bulk.mp4 --frame-at 20

# 2. build it; aim for a 20–40 s result
python3 scripts/make_bulk_timelapse.py bulk.mp4 -o video/bulk-run --speed 8 \
    --crop X:Y:W:H --blur X:Y:W:H
```

The header shows the speed and the real elapsed time, so the clip never looks faster than the run was. For a 3-minute recording, `--speed 6` to `--speed 9` lands in that range. Then uncomment the bulk figure in the embed, set its `height` from the rendered file (`ffprobe -v error -show_entries stream=width,height video/bulk-run.mp4`), and fill in the caption brackets.

## Rebuilding the race clip

```bash
bash scripts/make-race.sh manual.mp4 extension.mp4 video/race-side-4 side 50.7 9.6
```

That rebuilds the **unedited** clip. To re-apply the extension-side edit to its output (left half untouched; the right header's timer and Done badge are blanked, since the page crops the header and they would show the wrong time):

```bash
cat > edit.txt <<'F'
[0:v]split=3[l][r1][r2];
[l]crop=712:648:0:0[left];
[r1]crop=712:648:712:0,trim=2.2:4.9,setpts=(PTS-STARTPTS)/4[fast];
[r2]crop=712:648:712:0,trim=start=4.9,setpts=PTS-STARTPTS[rest];
[fast][rest]concat=n=2:v=1:a=0,fps=30,tpad=stop_mode=clone:stop_duration=6,
drawbox=x=iw-270:y=0:w=270:h=64:color=0xE9ECEF@1:t=fill[right];
[left][right]hstack=inputs=2,format=yuv420p[v]
F
N=$(ffprobe -v error -count_frames -show_entries stream=nb_read_frames -of csv=p=0 video/race-side-4.mp4)
ffmpeg -i video/race-side-4.mp4 -filter_complex_script edit.txt -map "[v]" -an -frames:v "$N"   -c:v libx264 -preset slow -crf 25 -profile:v high -movflags +faststart video/race-side-5.mp4
```

Then set `data-right-finish` on the figure and update the Done badge, stats, and caption in the page.

**Bump the number on every rebuild** (`-3`, `-4`, …) and update the two `<source>` tags in `site/projects/kumon-automation.html`. `/assets/*` is served `immutable`, so a changed clip under an old name keeps serving the old cut for up to a year (MAT-715). The page crop assumes the side layout's 1424×648 frame with a 64px label bar; if that changes, update the percentages in `.race__video`.

The last two arguments are the moments each side is actually done. Each clip is trimmed shortly after that time, then holds on its final frame until the other side catches up.
