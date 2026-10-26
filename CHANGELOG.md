# Changelog — v2 (review, bug fixes, loop refactor)

Found by reading the code. Not yet run through a browser test pass, so please follow the checklist in README.md after opening it.

## Mistakes removed
| # | Mistake | Fix |
|---|---------|-----|
| 1 | `form.hidden = true` did nothing: `.volunteer-modal form { display:grid }` overrides the `hidden` attribute, so the success message appeared under the still-visible form. Same flaw hid nothing for `.campaign-grid`. | Global `[hidden]{display:none!important}`. |
| 2 | Clicking the padding of the volunteer dialog closed it (the dialog itself had the padding, so `event.target === dialog`) and wiped typed answers. | Padding moved to an inner wrapper; backdrop close now needs press **and** release outside the dialog. |
| 3 | Form reset code was duplicated and inconsistent (`closeSuccess` forgot the consent checkbox). | One `resetForm()` driven by a `FIELDS` loop. |
| 4 | Validation errors were not linked to their fields and never cleared while typing. | `aria-describedby` added in a loop; fields re-validate live after the first submit; focus moves to the success message. |
| 5 | `body.modal-open` CSS existed but was never applied (page scrolled behind dialogs). | Applied/removed by the dialog helpers. |
| 6 | Redundant Escape handler duplicated native `<dialog>` behaviour. | Removed; Escape now only closes the mobile menu. |
| 7 | Search matched button text like “View details” and “sample”, so some queries matched every card. | Search uses title, category, blurb, goal and activity only. |
| 8 | Filter count was hard-coded “04”; hover looked identical to the active chip; status text differed before/after load. | Counts computed per category; separate hover style; one status message. |
| 9 | All four progress bars had the same accessible name; dialog image alt said “illustration” for a photo. | Names include the campaign title plus `aria-valuetext`; real alt text used. |
| 10 | Text as small as 8–10px; many greys failed WCAG AA contrast; focus ring colour (#c7d76c) was almost invisible; form borders under 3:1. | Minimum 11–12px, darker greys, forest + lime double focus ring, stronger input borders, darker closing-card green. |
| 11 | “Copy link” copied a sentence, not a link. A shared link pasted into an open tab did nothing. | Copies the URL only; `hashchange` opens the campaign; URL hash follows the open dialog. |
| 12 | Google Fonts loaded with CSS `@import` (render-blocking); no skip link; icon SVG duplicated; stray `&`. | `<link>` + preconnect; skip link; one `<symbol>` sprite; `&amp;`. |

## Improvements
- Sticky translucent header, animated progress bars (respect reduced motion), image-failure placeholder, Open Graph tags, `<noscript>` notice, larger close button and touch targets, mobile menu closes on Escape / outside click, “Back to campaigns” now scrolls there.
- `styles.css` is now readable (it was minified onto 6 lines).

## Where loops are used (`app.js`)
- `CAMPAIGNS`, `STEPS`, `STRIP`, `APPROACH`, `CATEGORIES` → `.map().join('')` render the cards, steps, trust strip, approach points and filter chips (previously ~7 KB of copy-pasted HTML).
- `for…of` over campaigns for search/filter, over chips for active state, over `FIELDS` for validation/reset, `forEach` over every `<dialog>`, `$$()` loops for observers and nav.
- Build-time loops (not shipped) darkened greys and raised font sizes in the stylesheet.

## Not verified
Unsplash image URLs could not be tested from the build environment. If one is dead, the card shows the paw placeholder; swap the id in `CAMPAIGNS`.
