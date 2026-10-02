# Madhayam redesign notes

## Scan
- Stack: static HTML, vanilla CSS and vanilla JavaScript.
- No package manager, framework, CSS library or build step.
- Existing functionality retained: mobile navigation, forms/mailto fallback, donation panel, copy actions, scroll interactions, SEO/social metadata, legal pages, social links and floating WhatsApp action.

## Diagnose
- Playful rounded display typography weakened authority and editorial hierarchy.
- Homepage hero leaned on a decorative gradient/orb treatment associated with generic AI landing pages.
- Several sections used equal three-card grids, centered CTAs and repeated rounded cards.
- Missing optional photographs exposed developer-style filename placeholders, making the public site look unfinished.
- Some layout rules lived inline in HTML.
- Repeated symmetrical spacing and universal radii flattened the hierarchy.
- Decorative cursor/drift effects competed with the content.

## Fix
- Kept the existing vanilla stack; no new framework or dependency was added.
- Swapped typography to Fraunces + Manrope and rebuilt hierarchy with tighter display tracking, balanced headings and readable line lengths.
- Replaced the gradient-heavy look with a warm paper / deep forest system and one muted brick accent.
- Reworked the homepage and support cards into asymmetric editorial grids.
- Reworked programme content into a publication-style indexed list.
- Replaced broken/missing photo requests with intentional field-note panels; no stock imagery was introduced.
- Removed inline style attributes and moved layout styling into the stylesheet.
- Simplified surfaces, shadows, radii and motion; retained clear hover, active and keyboard-focus states.
- Left the existing favicon, metadata, legal pages, custom 404, social links and WhatsApp action intact.
- Checked local links, cross-page anchors, image alt attributes, meta descriptions, skip links, CSS brace balance and JavaScript syntax.
