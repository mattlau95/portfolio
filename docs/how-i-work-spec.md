# Component Spec: "How I Work" Section

## 1. Context & Objective
Implement a developer-centric, asymmetric command execution list for the "How I Work" section of the portfolio site. This layout replaces the previous horizontal 4-column structure with a scannable vertical stack that leans into a terminal/command-line aesthetic, matching the site's high-craft, dark-mode theme.

---

## 2. Layout & Structure (Asymmetric Column List)
The section must match the responsive layout paradigms used throughout the right-hand scrolling column of `image_b2dec1.png`.

- **Container:** Full-width block element with vertical spacing consistent with the surrounding "About" and "Experience" sections.
- **Header:** A crisp section title (`<h2>`) followed by a clean, single-line introductory sentence that features inline tech tokens.
- **The Workflow Stack:** A vertical list of 4 blocks. Each block is split into an asymmetric 2-column layout on desktop:
  - **Left Column (Token Column):** Fixed-width or tight flex basis (approx. `140px` to `160px`). Houses the command prompt / file name token. Monospace, left-aligned.
  - **Right Column (Content Column):** Flex-1. Houses the bold feature title and its corresponding descriptive paragraph text.

---

## 3. Visual & Typographic System

### Text Tokens (Claude Code & Linear)
Style the inline tech tokens in the introduction to match the existing project stack tags (e.g., your site's existing `Go` or `PostgreSQL` components).
- **Background:** Low-contrast background or subtle border (`rgba(255,255,255,0.05)`).
- **Font:** Monospace font family (e.g., SF Mono, Geist Mono, Fira Code), matching the styling of existing system labels.

### Command Execution Rows
For the 4-step workflow rows, implement the following typography:
- **Left Column (Commands):** 
  - Styled as clean terminal indicators. 
  - Monospace font, low-contrast muted color text (matching your site's tag text color). 
  - No loud colored backgrounds—keep it strictly monochromatic.
- **Right Column (Content):**
  - **Feature Title:** Bold sans-serif or crisp serif title matching the layout's structural weights.
  - **Description Paragraph:** Clean body copy with line-height optimized to prevent awkward vertical text stretching.

---

## 4. Copy & Content Mapping

### Section Intro
"I run a lightweight, spec-driven workflow built around `Claude Code` and `Linear`."

### Row 1
- **Command:** `/_ capture`
- **Title:** Capture, then triage
- **Body:** Quick notes go into an inbox via a custom `/capture` command; a separate `/triage` pass turns them into scoped Linear issues.

### Row 2
- **Command:** `system.md`
- **Title:** Spec before code
- **Body:** Every project starts as a version-controlled build plan, keeping the architecture and the implementation in perfect sync. This site was built that way.

### Row 3
- **Command:** `↳ linear`
- **Title:** Continuous momentum
- **Body:** One isolated project per application, running on weekly cycles. Every repository maintains an active devlog to document progress and micro-decisions.

### Row 4
- **Command:** `/_ audit`
- **Title:** UX as tooling
- **Body:** Design quality and WCAG 2.2 accessibility compliance shouldn't rely on memory. They live inside a repeatable, programmatic `/audit` command.

---

## 5. Responsive Design & Interactions
- **Desktop (Breakpoint >= 768px):** Strict 2-column horizontal split for each row. Ensure the left column text aligns perfectly with the left edge of the main scrolling text container.
- **Mobile (Breakpoint < 768px):** Gracefully collapse the asymmetric split into a single-column stacked layout. The command token (`/_ capture`) drops cleanly directly *above* the feature title, maintaining a logical reading flow.
- **Interactivity:** Maintain a pure, static editorial feel. No glowing backgrounds or bright colors. If hover micro-interactions are added, limit them to a highly subtle opacity change on the text rows.