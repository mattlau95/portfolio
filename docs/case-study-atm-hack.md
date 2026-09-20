# Case study draft: ATM Hack

*Draft for `site/projects/atm-hack.html`. Written from `docs/case-study-atm-hack.md`.*

---

## Header

- **Label:** Case study
- **Title:** ATM Hack
- **Kicker:** A GTA RP minigame, rebuilt from Twitch clips
- **Deck:** Without real numbers from NoPixel, you can't make a perfect copy. So I measured it from streamer clips, tested it on my own hands, and let the community fill in the rest.
- **Meta row:** Role: Design + Direction, with Claude doing the analysis and code · September 2026 · Shipped
- **Metrics:**
  - `626 runs` / `from 249 players in the first 19 hours`
  - `~2.3%` / `of the ring per press, fitted from streamer footage`
  - `4 hours` / `time spent on project before launch`
- **Tags:** HTML · CSS · Vanilla JS · Canvas · Google Apps Script · Google Sheets · Python · itch.io
- **Links:** [Play it on itch.io](https://mattlau95.itch.io/gta-nopixel-v-inspired-atm-hack)

---

## Overview

I enjoy a very niche form of entertainment: GTA RP NoPixel 5.0. It's a custom made server on Grand Theft Auto V where people role play as the characters, most livestream it. Within this game, there are always little mini-games and puzzles, called "hacks". One of them was a simple button masher that was really intriguiging; I saw a streamer named Blau fail it, and I wanted to try it for myself. The NoPixel 5.0 server is not available for most, so I decided to recreate this simple game spent a few hours with Claude recreating it as closely as we could, put it on itch.io, and posted it to Reddit for the community to play. It's free, unaffiliated with NoPixel, and I'm not making money from it.

## The problem

I don't have real numbers from the original game developers, I needed to figure out how to recreate the gameplay mechanics and difficulty to be as similar to the real thing as possible. 

## Role & constraints

### Role

This was a solo project built over about a day. I broke down the hack's mechanics from streamer clips, worked with Claude to measure and calibrate the difficulty, and set up a way to keep tuning it with data from the community.

## Approach

### Design

The game's UI stays close to the real one; the font NoPixel uses is a Google Font (Barlow), and their overall UI is pretty straightforward. The fun comes afterward: your run is drawn over the streamers' runs, so you compare your runs with them.

### Engineering

#### Watched the ring

I pulled clips of seven attempts: five passes (xQc, Fuslie, Garek, Lysium, Valkyrae) and two fails and had Claude track how full the ring was in every frame. The pattern was clear. Each press adds a small chunk, the ring constantly slides back, and the slide-back gets stronger the fuller the ring is and with each checkpoint. Failing isn't about being slow: both fails got stuck at 70–90% of the last ring for over a minute and a half until time ran out.

#### Listened to the keyboards

To figure out how fast people were actually pressing, Claude detected keyboard clicks in the stream audio, starting from the loud stretches I'd flagged, and matched them against how fast the ring moved at the same moment. That gave a first model, but it also said streamers were holding 12–15 presses a second for over a minute. I'm a decent masher and I top out around 9, so that didn't sit right.

#### Tested it on myself

I asked for a prototype that logs the exact time of every press, then recorded my own keyboard while playing. Lining the two up showed that my keyboard makes two clicks per press: one going down and one coming back up, about 51 ms apart. My speed test had 87 presses; the detector heard 177 clicks. The streamers' audio had the same pattern, which meant my first estimate of their speed was double the real number. I corrected for that.

#### Checked it

With the corrected numbers, the model reproduces the streamers' checkpoint times at realistic speeds. My own winning run landed between Garek's and Lysium's times without me tuning anything to make that happen. Where it landed: each press is worth about 2.3% of the ring. The first checkpoint is basically free, the second needs about 5 presses a second, and the last needs you to hold about 7.5 through the final stretch.

## Key decisions & tradeoffs

**Model the pushback, not a timer.** A "press X times in Y seconds" rule would've been easier, but it can't produce the stalls the fails show. The catch: from video alone I can't tell pushback that grows with fill apart from each press being worth less as the ring fills. I went with the one that matches the visible push-back.

**A Google Sheet instead of a real backend.** Free, 15 minutes to set up, and the data lands somewhere I can just open. The cost: Apps Script is slow to wake up, which made successful saves look like failures until retries went in.

**Check every run on the server.** The server replays each run through the official settings, so faked times and 200-press-per-second autoclickers bounce off. But on day one, someone turned their autoclicker down to just under my speed limit and landed #2. Replay proves a run follows the rules, not that a human played it.

## Outcome

I launched the game on itch.io and made a reddit post in the NoPixel subreddit. The fanbase is pretty dedicated so I was confident I was able to find people to try it. 

The Reddit post brought in **626 runs from 249 players** in the first 19 hours, 339 of them in one two-hour burst. 90% of verified runs cleared, and 84% of players cleared on their first try. That's higher than the streamers' 5 of 7, but seven clips is tiny, and fails are what gets clipped. The server caught 60 autoclicker runs; the one that slipped through gets fixed in v1.1. The gap: only 40 "how did it compare" ratings from people who've done the real hack, mostly on mouse or phone. I need more before touching the difficulty in v2.

## Reflection

I'm really happy with how it turned out. It showed me how much you can get done in a day when you split the work right: Claude does the heavy analysis and code, and you bring what it can't, like knowing the game, knowing what looks wrong, and being the test subject. The best part was watching the Google Sheet fill up as people from the community played it.

---

## Footer

- an MCL Studio project
- Designed and directed by me; analysis and code by Claude — plain HTML, CSS, and vanilla JS, no framework.
- Last updated September 2026

---

## Figures to make

1. **Hero:** the results screen, with your run over the streamer curves.
2. **"Watched the ring":** all seven clips' progress over time, with the two fails flattening out below the finish.
3. **"Tested it on myself":** a zoomed spectrogram of the press/release click pairs, with the ~51 ms gap marked.
4. **Outcome:** the side panel's "Everyone's attempts" tally and leaderboard.

Use your own charts and screenshots only, no stream footage.
