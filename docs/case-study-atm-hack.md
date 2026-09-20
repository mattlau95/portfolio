# Case study: ATM Hack

*Record of the copy live at `site/projects/atm-hack.html`. Updated 2026-09-19 to
match what shipped; edit this and the page together.*

---

## Header

- **Label:** Case study
- **Title:** ATM Hack
- **Kicker:** A GTA RP minigame, rebuilt from Twitch clips
- **Deck:** Without real numbers from NoPixel, you can't make a perfect copy. So I measured it from streamer clips, tested it on my own hands, and let the community fill in the rest.
- **Meta row:** Role: Design + Direction, with Claude doing the analysis and code · September 2026 · Shipped
- **Metrics:**
  - `626 runs` / `from 249 players overnight`
  - `4 hours` / `from start to launch`
- **Tags:** HTML · CSS · Vanilla JS · Canvas · Google Apps Script · Google Sheets · Python · itch.io
- **Links:** [Play it on itch.io](https://mattlau95.itch.io/gta-nopixel-v-inspired-atm-hack) · Play it here ↓ (in-page anchor to the embed)

## Playable embed

Sits directly after the header, before Overview, on the wide track.

- **Lead:** Mash <kbd>E</kbd> to fill the ring and clear three checkpoints before the timer runs out. The ring pushes back harder the fuller it gets. Your run is drawn over the streamers' when you finish.
- **Note:** Fan-made, unaffiliated with NoPixel, and free — I make nothing from it.
- **Link:** Open on itch.io

Click-to-load: the stage is a screenshot until tapped, so nothing is requested
from itch.io until someone asks to play. Under 700px the button is replaced by
a plain link to itch.io — the game is served at 1280×820 and does not scale
into a 326px column.

---

## Overview

I enjoy a very niche form of entertainment: GTA RP on NoPixel 5.0, a custom Grand Theft Auto V server where people role-play as characters and most of them livestream it. The server is full of little minigames and puzzles, called hacks. One of them is a plain button masher, and it's more interesting than it sounds — I watched a streamer named Blau fail it and wanted to try it myself. NoPixel 5.0 isn't open to most people, so I spent a few hours with Claude recreating the hack as closely as we could, put it on itch.io, and posted it to the NoPixel subreddit for the community to play.

## The problem

I have no numbers from the people who built the original. No press value, no push-back rate, no checkpoint thresholds. Everything I could learn about how the hack behaves had to come from watching other people play it on stream, which is a recording of the output, not the rules that produced it.

Building a button masher takes an afternoon. But how do we make it feel like the real game?

## Role

> **[C]** The page has no Constraints subsection. It was written, then cut —
> the heading is **Role**, not "Role & constraints".

A solo project built over about a day. I broke down the hack's mechanics from streamer clips, worked with Claude to measure and calibrate the difficulty, and set up a way to keep tuning it with data from the community. The split that made it work: Claude did the frame-by-frame analysis and wrote the code, and I brought the things it couldn't — knowing the game, knowing when a result looked wrong, and being the test subject.

## Approach

### Design

The UI stays close to the real one, which was less work than it sounds: NoPixel's font is Barlow, a Google Font, and the hack itself is a ring, a key cap, and three checkpoint dashes. Getting those proportions right matters more than any effect — it's the thing people recognise from stream.

*Figure: the side panel at launch. Caption — "Game instructions"*

After each run, the game compares it to the streamer runs we studied.

*Figure: the results screen. Caption — "The results screen after my 35.9-second clear, plotted against the streamers' runs."*

### Engineering

#### Watched the ring

I pulled clips of seven attempts — five clears and two fails — and had Claude track how full the ring was in every frame. The pattern came out clearly. Each press adds a small chunk, the ring slides back constantly, and the slide-back gets stronger both as the ring fills and with each checkpoint passed.

*Figure: progress-over-time chart. Caption — "Seven clips. The two dashed lines that flatten out near the top are the fails."*

That chart settles what failing actually is. Neither fail was slow: both reached the last ring quickly, then sat at 70–90% of it for more than a minute and a half while the timer ran out. I hypothesized that to beat the last checkpoint, the player must reach a specific speed.

*Figure: checkpoint times table. Caption — "The same seven runs as numbers. Each checkpoint costs more than the one before it, for almost everyone."*

#### Listened to the keyboards

Knowing how fast the ring moved wasn't enough on its own — I needed to know how fast the person was pressing to move it that much. So Claude detected keyboard clicks in the stream audio, starting from the loud stretches I'd flagged, and matched them against the ring's speed at the same moment. The first model it produced had streamers holding 12–15 presses a second for over a minute. I can get about 9 presses per second.

#### Tested it on myself

Rather than argue with the model, I became the control group. I tested out the game and recorded audio of my own keyboard while playing it. Lining the two up explained everything: my keyboard makes two clicks per press, one on the way down and one on the way back up, about 51 ms apart. My speed test had 87 presses in it, and the detector heard 177 clicks. The streamers' audio had the same double-click signature, which meant the first estimate of their speed was roughly twice the real number.

*Figure: the spectrogram. Caption — "Each press made two clicks, one on the way down and one on the way up, so counting clicks in stream audio doubled every speed I measured."*

> **[C]** A trim was proposed here, moving 51 ms / 87 / 177 out of the prose now
> that the figure states them — declined. The repetition is deliberate, and the
> numbers in the text and the figure agree.

## Key decisions & tradeoffs

**Model the push-back, not a timer.** A "press X times in Y seconds" rule would have been far easier to build and to tune, but it can't produce the stall the two fails show — under a timer you either make it or you're late, and nobody sits at 85% for ninety seconds. The catch is that video alone can't separate push-back that grows with fill from each press being worth less as the ring fills. Both fit the curves. I went with the one that matches the push-back you can see on screen.

**Share with the Reddit community.** I launched on itch.io and posted it to the NoPixel subreddit. The fanbase is dedicated enough that I was fairly confident of finding people who'd try it.

**Check for cheating.** The server replays each submitted run under the official settings, so faked times and 200-press-per-second autoclickers bounce off.

## Outcome

The game is launched, and the Reddit post was successful!

The post brought in **626 verified runs from 249 players** overnight, 339 of them in a single two-hour burst, and they are still coming in. 90% of those runs cleared, and 84% of players cleared on their first try — the same range as the streamers, where 5 of 7 passed. That is the shape I wanted: most people get through it, and the last ring is where it turns frustrating.

*Figure: the Everyone's attempts panel. Caption — "Everyone's attempts as of September 19, 2026: 566 verified runs, 90% cleared."*

*Reddit embed: the r/NoPixel post, "I measured streamer footage to recreate the
NoPixel ATM button masher hack - try it!!" by u/dolfinz95. Click-to-load —
the blockquote is real content and links to the thread on its own, and
embed.reddit.com/widgets.js is only fetched when the button is pressed, so a
reader who never asks for the live card pays nothing for it.*

The server caught 60 autoclicker runs on top of those, none of them in the count above. The one that slipped under the speed limit gets fixed in v1.1. The real gap is the feedback I most wanted: only 40 "how did it compare" ratings from people who've played the actual hack, most of them on mouse or phone rather than a keyboard. I want considerably more of those before I touch the difficulty for v2.

## Reflection

I'm happy with how this turned out, and mostly with how fast it went. It showed me how much is possible in a day when the work is split along the right seam: Claude does the heavy analysis and writes the code, and I bring what it can't — knowing the game, noticing when an output looks wrong, and being the test subject when the only way to settle a disagreement is to record my own hands.

The best part was watching the Google Sheet fill up as people from the community played it.

---

## Footer

- an MCL Studio project
- Designed and directed by me; analysis and code by Claude — plain HTML, CSS, and vanilla JS, no framework.
- Last updated September 2026

---

## Figures

Assets live in `site/assets/atm-hack/`. All are my own charts and screenshots —
no stream footage.

| # | File | Size (1× / 2×) | Where | Zoom |
|---|---|---|---|---|
| — | `atm-ring.webp` | 1280×720 / — | embed poster, above the fold (`fetchpriority="high"`) | no |
| 1 | `atm-description.{webp,png}` | 386×399 / — | Design | no |
| 2 | `atm-results{,@2x}.{webp,png}` | 692×817 / 1384×1635 | Design | yes |
| 3 | `atm-progress{,@2x}.{webp,png}` | 800×450 / 1600×900 | Watched the ring | yes |
| 4 | `atm-checkpoints{,@2x}.{webp,png}` | 800×450 / 1600×900 | Watched the ring | yes |
| 5 | `atm-double-click{,@2x}.{webp,png}` | 800×450 / 1600×900 | Tested it on myself | yes |
| 6 | `atm-attempts{,@2x}.{webp,png}` | 692×179 / 1384×358 | Outcome | yes |

Figures 1–6 ship as a `<picture>` with a WebP `<source>` and a PNG fallback.
Figures 2–6 add a 1×/2× `srcset`; figure 1 has no 2× to offer, so it carries a
single source. All sit on the **column** track, not `figure--wide` — a
height-capped image in a 969px box centres at 909px while its caption stays at
the box's left edge, which `figures.js` catches and `image-conventions.md` §3
forbids.

`atm-results` is the one figure whose `sizes` differs. At 692×817 the §1 height
cap binds before the column does, so it paints 434×512 at desktop rather than
692 wide, and its `sizes` says `434px` where the others say `692px`. Measured,
not assumed.

### Still to make

- Nothing outstanding. The "Everyone's attempts" panel was the last figure the
  original draft asked for; it landed as figure 6 on 2026-09-19.

### Known gaps

- **No 2× for `atm-description` or the embed poster.** Both are their sources'
  native size — 386×399 and a 1280×720 crop of a 2043×1208 master — so a 2×
  would be an upscale. Everything else on the page ships one.
