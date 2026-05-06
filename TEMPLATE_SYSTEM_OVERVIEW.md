# Vanilla Invoice Template System Overview

This project now uses a vanilla JS invoice rendering system (no Next.js runtime for template rendering).

## 1) Runtime and Routing

- Entry HTML: `vanilla/index.html`
- App bootstrap: `vanilla/app/main.js`
- Local server: `vanilla/server.js`

Route behavior:
- `/` serves `index.html`
- `/invoice/:templateId` also serves `index.html`
- `main.js` reads `templateId` from URL path (or `?templateId=`) and renders the matching invoice module.

## 2) Template Registry

- IDs are defined in `vanilla/features/invoices/constants.js`
- Renderer switch is in `vanilla/features/invoices/invoice-template-renderer.js`
- Each template has a module:
  - `vanilla/features/invoices/templates/invoice_fluvo_N/template.js`

Current model:
- `invoice_fluvo_1` has its own standalone implementation.
- `invoice_fluvo_2` to `invoice_fluvo_20` use a shared renderer (`shared-template.js`) plus per-template theme config.

## 3) Shared Rendering Engine

Core file: `vanilla/features/invoices/templates/shared-template.js`

`renderFluvoTemplate(target, options)` handles:
- Initial state creation (invoice meta, sender/client, line items, payment, terms, signature)
- Input rendering and binding
- Totals math recalculation:
  - subtotal
  - discount
  - tax
  - total
- Line item amount calculation
- ARIA-labeled fields for external hydration scripts

Theme customization is injected with `options.theme`, including:
- `shellClass`, `titleClass`, `titleTextClass`
- table styles (`tableHeadBgClass`, `tableBorderClass`, row classes)
- totals style (`totalBgClass`)
- hero header support (`hero.wrapClass`, `hero.bgClass`)
- decorative fragments (`topAccentHtml`, `footerAccentHtml`)

## 4) Field Contract (important for integrations)

Templates preserve these selectors via `aria-label` and consistent IDs/data attributes:

- Sender:
  - `Sender name`, `Sender address`, `Sender phone`, `Sender email`
- Bill To:
  - `Bill to name`, `Bill to address`, `Bill to phone`, `Bill to email`
- Invoice meta:
  - `Invoice number`, `Invoice date`, `Due date`, `Purchase order number`
- Line items:
  - `Line X description`, `Line X quantity`, `Line X price`, `Line X tax percent`
- Totals:
  - `Discount amount`, `Invoice tax percent`
- Other:
  - `Card holder name`, `Card number`, `ZIP code`, `Terms and conditions`, `Signature`

The shared engine also uses:
- `data-line`, `data-idx`, `data-line-amount` for line calculations.

## 5) How to Add or Edit a Template

1. Create/edit `vanilla/features/invoices/templates/invoice_fluvo_N/template.js`
2. Export `renderInvoiceFluvoNTemplate(target)`
3. For shared-engine-based template:
   - import `renderFluvoTemplate`
   - pass `number: N`
   - define unique `theme` object
4. Register in `invoice-template-renderer.js`
5. Ensure `INVOICE_TEMPLATE_IDS` includes the same key.

## 6) Deployment Notes (Vercel)

Project is static/vanilla, not Next.js build.

- Use `vercel.json` with rewrites to `index.html`
- Output directory: `vanilla`
- Framework preset: `Other`

## 7) Known Architectural Tradeoff

Templates `2..20` currently share one structural engine and vary by theme.  
If strict pixel-perfect parity per historical React template is required, each template can be progressively replaced with a fully standalone module similar to `invoice_fluvo_1`.

