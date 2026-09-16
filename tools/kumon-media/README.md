# Kumon case study media

Everything for `matthewclau.com/projects/kumon-automation` except the bulk run.
Open `kumon-media-embed.html` locally to preview it all in place.

## What's here

| File | Goes in section | Notes |
|---|---|---|
| `video/race-side.mp4` + poster | Under the intro | 1424×648, 52.8 s loop, 0.9 MB, no audio |
| `video/race-stacked.mp4` + poster | Same figure, phones | 720×1312, picked by JS under 700px |
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

The page copy still says "multi-day." At about 51 s per set, 200 sets is under 3 hours of clicking, and a reader can do that math after watching the race clip. Either time a few heavier sets by hand, or describe the cost as attention split across a workday.

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
bash scripts/make-race.sh manual.mp4 extension.mp4 video/race-side side 50.7 9.6
bash scripts/make-race.sh manual.mp4 extension.mp4 video/race-stacked stacked 50.7 9.6
```

The last two arguments are the moments each side is actually done. Each clip is trimmed shortly after that time, then holds on its final frame until the other side catches up.
