# DEFINE — resume_fluvo_10 (Sydney) — invoice_fluvo_10 structure

Mirrors [invoice_fluvo_10 on invoice-web-server](https://invoice-web-server-sigma.vercel.app/invoice/invoice_fluvo_10).

## URL

| Invoice | Resume |
|---------|--------|
| `/invoice/invoice_fluvo_10` | `/resume/resume_fluvo_10` |

## Page chrome

- Title: `Resume · resume_fluvo_10 · Resume Web Server`
- Centered document card
- **Download Resume** → `POST /render/resume/resume_fluvo_10/pdf`
- **Save as PDF (browser)** → `window.print()`

## Document zones (invoice → CV)

| Invoice zone | Resume zone |
|--------------|-------------|
| INVOICE # / DATE / DUE / P.O. | Email / Phone / Location / Job title (`cvMetaRow`) |
| # INVOICE title | CURRICULUM VITAE + full name (`cvDocumentTitle`) |
| From | Professional profile (`cvFromBlock`) |
| Line items table | Experience table: Period · Role & organization · Highlights |
| Bill To (right) | Contact sidebar: photo, name, links, skills, languages |
| Subtotal / Total footer | Education + certifications + languages (`cvTotalsFooter`) |

## Code

- Page: `mount-resume-template-page.js`
- Layout: `cv-invoice-layout.js` + `cv-invoice-render.js` (`invoiceShell: true` on `/resume/resume_fluvo_N`)
- Token: `cv-template-tokens.js` [10], layout `sidebar-right`
