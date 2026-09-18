# dev/ollae-media

Source media for the Ollae case study that is **not** shipped. Like
`dev/kumon-media/`, nothing here is served — only `site/` deploys
(`wrangler.toml`, MAT-716).

| File | Why it is here |
|---|---|
| `ollae-success-animation.mp4` | The success screen as a clip. The case study uses the still (`site/assets/ollae/ollae-emoji-success.*`) in the emoji strip instead, so the clip is unused. Kept because it is the only copy. |

If the clip is ever wanted on the page, the site already has the pattern:
`.cs-video` + `js-cs-video` + `scripts/case-study-video.js`, as used on
`projects/pocalab.html`. It needs a WebM sibling and a poster to match.
