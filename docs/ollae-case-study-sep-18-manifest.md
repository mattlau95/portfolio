# Ollae case study — update manifest

Seven new images, plus three copy edits. Nothing here touches the existing
hero strip, the two live embeds, or any other section.

## Assets

| File | Size (px) | Section | Placement |
|---|---|---|---|
| `ollae-unfurl-messenger` | 900 × 937 | The problem | After the second paragraph (the one ending "…except a name") |
| `ollae-remindme-expanded` | 900 × 1185 | Approach › Design | Pair, after the "Remind me" paragraph, before the guestbook embed |
| `ollae-remindme-confirmed` | 900 × 938 | Approach › Design | Second of that pair |
| `ollae-unfurl-imessage` | 900 × 627 | Outcome | Row of four, after the preview-cards sentence |
| `ollae-unfurl-whatsapp` | 900 × 798 | Outcome | Row of four |
| `ollae-unfurl-messenger-card` | 900 × 627 | Outcome | Row of four |
| `ollae-unfurl-discord` | 900 × 740 | Outcome | Row of four |

All are WebP with a PNG fallback at identical dimensions. All below the fold:
`loading="lazy" decoding="async"`, no `fetchpriority`.

Note the two Messenger crops are deliberate: the tall one in The problem keeps
the human message above the card; the card-only one in Outcome avoids showing
the same screenshot twice on one page.

## Captions and alt text

**ollae-unfurl-messenger** (The problem)
Caption: The ask and the answer in the same thread.
Alt: A group chat message reading "Please RSVP for this Thursday volleyball 6:30pm!" above an Ollae link preview card titled Weekly Volleyball, showing the date, the location, a volleyball illustration, and an RSVP Now button.

**ollae-remindme-expanded** (Design, first of pair)
Caption: Tapping the text link opens a third answer, not a shrug.
Alt: Ollae's RSVP form with a name filled in, "I'm in" and "Can't make it" buttons, and the "Not sure yet — remind me closer to the date" link expanded to show an email field, a Remind me button, and a note that the address is used for one reminder then deleted.

**ollae-remindme-confirmed** (Design, second of pair)
Caption: Recorded as its own status, with a reminder due the day before.
Alt: Ollae's confirmation screen with a bell, the heading "We'll remind you!", the line "Matthew L · Remind me", and a link back to view who's coming.

**Outcome row** — one shared caption under all four:
Caption: Four clients, four different treatments, the same tags.

**ollae-unfurl-imessage**
Alt: The Ollae link preview in iMessage, showing the event card above the title and the ollae.app domain.

**ollae-unfurl-whatsapp**
Alt: The Ollae link preview in WhatsApp, showing the event card above the title, the description, and the ollae.app domain with the Ollae logo as the site icon.

**ollae-unfurl-messenger-card**
Alt: The Ollae link preview in Facebook Messenger, showing the event card above the title and the ollae.app domain.

**ollae-unfurl-discord**
Alt: The Ollae link preview in Discord, where the event card is nested inside Discord's own embed with the title and description repeated above it.

## Copy edits

**1. Header kicker.** Under the H1, in the same mono style as "CASE STUDY":

    올래 · Korean for "wanna come?"

**2. Role & constraints**, first paragraph. Add as the final sentence:

    Ollae is 올래, Korean for "wanna come?", which is the only question the
    product asks.

**3. Outcome**, the preview-cards sentence. Replace:

    Preview cards work reliably in iMessage, WhatsApp, Telegram, and WeChat.

with:

    Preview cards work in iMessage, WhatsApp, Messenger, and Discord.

Telegram and WeChat come out because they aren't verified. The four named
are the four shown.
