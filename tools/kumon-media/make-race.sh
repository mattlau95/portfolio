#!/usr/bin/env bash
# Race clip: manual vs extension, burned-in timers, final-frame hold.
# Usage: make-race.sh manual.mp4 extension.mp4 out_basename [side|stacked] [manual_done_s] [extension_done_s]
# done times = the moment each side is actually finished (defaults to clip end).
# Each clip is trimmed shortly after its done time, then holds on that frame.
set -euo pipefail
MANUAL="$1"; AUTO="$2"; OUT="$3"; LAYOUT="${4:-side}"; DONE_M="${5:-}"; DONE_A="${6:-}"
HOLD=2   # seconds to hold the last frame before the loop restarts
BOLD=/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf
[ -f "$BOLD" ] || BOLD=$(fc-match -f '%{file}' 'sans:bold')
[ -f "$MONO" ] || MONO=$(fc-match -f '%{file}' 'monospace:bold')

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
py() { python3 -c "print($1)"; }
DM=${DONE_M:-$(dur "$MANUAL")}; DA=${DONE_A:-$(dur "$AUTO")}
TAIL=0.7  # keep a few frames after "done" so the finished state is fully drawn
EM=$(py "min($DM+$TAIL,$(dur "$MANUAL"))"); EA=$(py "min($DA+$TAIL,$(dur "$AUTO"))")
TOTAL=$(py "round(max($EM,$EA)+$HOLD,2)")
PADM=$(py "round($TOTAL-$EM,2)"); PADA=$(py "round($TOTAL-$EA,2)")
FM=$(py "round($DM,1)"); FA=$(py "round($DA,1)")

if [ "$LAYOUT" = "side" ]; then W=712; H=584; else W=720; H=592; fi
HEAD=64; BG=0xE9ECEF; INK=0x1B2433; OK=0x1F7A4A

pane() { # $1 input, $2 title, $3 finish time, $4 pad seconds, $5 out label, $6 trim end
local T="min(t\\,$3)"
cat <<F
[$1]trim=0:$6,fps=30,setpts=PTS-STARTPTS,scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos,
pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${BG},
pad=${W}:${H}+${HEAD}:0:${HEAD}:color=${BG},
drawtext=fontfile=${BOLD}:text='$2':fontsize=26:fontcolor=${INK}:x=16:y=(${HEAD}-th)/2,
drawtext=fontfile=${MONO}:text='%{eif\\:$T\\:d}.%{eif\\:mod($T*10\\,10)\\:d} s':fontsize=28:fontcolor=${INK}:x=w-tw-16:y=(${HEAD}-th)/2,
tpad=stop_mode=clone:stop_duration=$4,
drawbox=x=iw-196:y=10:w=184:h=${HEAD}-20:color=${OK}@1:t=fill:enable='gte(t,$3)',
drawtext=fontfile=${MONO}:text='Done $3 s':fontsize=24:fontcolor=white:x=w-tw-28:y=(${HEAD}-th)/2:enable='gte(t,$3)'
[$5];
F
}

if [ "$LAYOUT" = "side" ]; then STACK="[m][a]hstack=inputs=2"; else STACK="[m][a]vstack=inputs=2"; fi
{ pane 0:v "By hand" "$FM" "$PADM" m "$EM"; pane 1:v "With Kumon Cleaner" "$FA" "$PADA" a "$EA";
  echo "${STACK},format=yuv420p[v]"; } > /tmp/race_filter.txt

ffmpeg -v error -y -i "$MANUAL" -i "$AUTO" -filter_complex_script /tmp/race_filter.txt \
  -map "[v]" -an -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart -t "$TOTAL" "$OUT.mp4"
# Poster: shortly after the extension finishes, while the manual side is still working
ffmpeg -v error -y -ss "$(py "$DA+3")" -i "$OUT.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT-poster.webp"
ls -la "$OUT".mp4 "$OUT-poster.webp"
