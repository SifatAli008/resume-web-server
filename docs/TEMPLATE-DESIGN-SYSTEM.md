# Fluvo resume — design system (20 templates)

Print-first A4 CV system. Source of truth: `cv-design-tokens.js`, `cv-editor-styles.js`, `resume-print.css`.

## Global constraints

| Token | Value |
|-------|--------|
| Page | 210 × 297 mm · 3 pages max |
| Padding | 14mm top · 16mm L/R · 16mm bottom |
| Formal padding | 15mm top · 17mm L/R (templates 12, 19) |
| Body | 10.5pt · line-height 1.45 · `#18181b` |
| Section gap | 1.75rem (`mb-[1.75rem]`) |
| Block gap | 1.25rem |
| Row gap | 1rem |
| Date column | **7rem** + 1.25rem gap |
| Motion | **None** on `#resume-print-root` |

## Typography

| Role | Spec | Class |
|------|------|--------|
| Name | 1.75rem · 800 · -0.025em | `cv-name-emphasis` / `EIN_H1` |
| Title | 0.95rem · 400 · 0.01em · muted | `EIN_TITLE` |
| Section H2 | 10–11px uppercase · 0.14–0.24em | `sec()` in `cv-shared-ui.js` |
| Body | 14px / 10.5pt | `EIN` |
| Dates | tabular-nums · `#52525b` | `EIN_DATE` |
| Meta label | 10px bold uppercase · 0.14em | invoice meta row |
| Meta value | 12px | invoice meta inputs |

## Layout families

See `cv-template-ui.js` `LAYOUT` map. Invoice dedicated URLs use `cv-invoice-render.js` per family.

## Skills UI

One style per template — `SKILLS_STYLE_BY_TEMPLATE` in `cv-skills-ui.js`.

## Quality gates

```bash
npm run build:css
npm run test:resume          # static smoke + checklist + full audit
npm run test:resume-audit    # 20 templates × builder + static + invoice + skills markers
```

Checks: 3 pages (incl. long fixture), 7rem date grid, `cv-name-emphasis`, layout family, skills UI markers, invoice zone order, print CSS (no motion), split/banner/sidebar rules.
