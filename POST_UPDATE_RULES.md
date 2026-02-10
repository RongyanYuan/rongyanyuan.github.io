# Post Creation & Update Rules

Use this checklist every time you create or update a post in this repo.

## 1. Back Redirect Button (Top‑Left)
- Always add a back‑redirect button **under the site name** (top‑left).
- Label must **exactly match the topic name** (EN/ZH).
- Format: `← [Topic Name]`.
- Link must point to the **topic page** (EN/ZH).

## 2. Language Switcher (Nav)
- Ensure **only one** language switcher exists in the desktop nav and **only one** in the mobile nav.
- It must point to the **correct EN/ZH pages**.

## 3. Bottom Navigation (Topic Next Link)
- Update the bottom navigation section to link to the **next post within the same topic**.
- If the current post is the **latest** in that topic, link to **itself**.
- Ensure there is **only one** bottom navigation link.

## 4. TOC / Right‑Side Index
- The TOC must include **all major sections**.
- Order must **match the actual section order** on the page.

## 5. Language Consistency
- English page: **all English**.
- Chinese page: **all Chinese**.
- No mixed language unless explicitly requested.

## 6. Math Rendering
- Use MathJax‑safe syntax only:
  - Inline: `\( ... \)`
  - Block: `\[ ... \]`
- Do **not** double‑escape backslashes.

## 7. Placement Confirmation (Updating Existing Posts)
- **Always confirm with the user** where new content should be inserted in an existing post
  (e.g., top, before/after a specific heading, end of section).

## 8. Always Update EN + ZH Together
- By default, **every update must be applied to both English and Chinese pages**.
- Ensure the English page is fully English and the Chinese page is fully Chinese.

---

This file is the default checklist for all post work in this project.


- Always close `</div>` for `.post-content-main` before inserting the TOC (`.post-content-inner-space` with `.space-toc-main`). If the main block is not closed, the TOC renders at the bottom instead of the right sidebar.
- Ensure the TOC block is a sibling of `.post-content-main` inside `.post-content-inner` (not nested inside the content).

- Code blocks should use the same styling as Python Crash Course posts (monospace font, light background, padding, rounded corners). Ensure global CSS supports this for `pre`/`code` in posts.
