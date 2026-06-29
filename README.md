# MoveQuote: instant moving-quote estimator (template)

**Live demo:** https://moving-quote-estimator.vercel.app/

A self-contained, single-page instant moving-quote estimator for moving companies. A visitor picks
home size, move type, and add-ons, gets an instant ballpark price range, then submits contact details.
The form captures a fully-qualified lead (move date, ZIPs, home size, add-ons, quoted range), not just
a name and phone number.

Built by [Watchlight Interactive](https://watchlightinteractive.com). Static, no build step.

## The story

**Problem.** I'd built an instant moving-quote estimator for a single moving company. A visitor answers
a few questions, gets a ballpark price, and the form captures a real lead with the move details attached.
It worked. But it was welded to one client. Could the same tool become a repeatable Watchlight service I
could sell to movers in general?

**Who it's for.** Local and regional moving companies, who buy it. And Watchlight, selling a lead-capture
tool that deploys fast.

**Key decisions and tradeoffs.**
- **A config-driven template, not a SaaS.** The whole product is one static file. Every company-specific
  value lives in a single config object: brand, pricing, lead inbox. Re-skinning a new mover takes minutes
  and no code. The alternative was months building accounts, tenancy, and billing for something this small.
  I picked the boring option on purpose.
- **The real work was finding the seam.** The hard part wasn't code. It was deciding what counts as
  configuration and what stays fixed. Pricing was the crux. Movers price differently, so add-ons carry
  typed effects (multiply the hours, add hours, or a flat fee) and the rate band is adjustable. No general
  formula engine, because nobody needs one yet.
- **Hourly pricing, with an escape hatch.** It matches how local moves actually get priced. Long-distance
  routes to a "contact us for a custom quote" button instead of a made-up number. I'd rather solve the
  common case well than the rare case badly.
- **Public template, private client copies.** The public repo does double duty as a portfolio piece and a
  lead magnet. Each real mover is a private re-skin. One codebase, two jobs.
- **Lead capture with no backend that still won't drop a lead.** Submissions go straight to the mover
  through Web3Forms with their own key. If a deploy is set up wrong, a mailto fallback catches the lead
  inside the success screen so it's never lost quietly.

**What I learned.** Productizing a one-off is really a product-management problem. The value sits in one
decision: what every customer shares versus what each one changes. Get that line right, and "sell it to
movers in general" turns into a five-minute config edit instead of a rebuild.

## Re-skin it for a mover (about 5 minutes)

Everything company-specific lives in the `SITE` object at the bottom of `index.html`:

1. **Brand:** `name`, `tagline`, `logoUrl`, `serviceArea`, `phone`/`phoneHref`, `rating`,
   `colors` (`primary`, `primaryDark`, `dark`), `footer`, and an optional `demoBar` banner.
2. **Pricing:** `hourlyRate`, `truckFee`, `homeSizes` (crew + hours per size), `addOns`
   (each with an `effect`: `hoursMult`, `hoursAdd`, or `flat`), and the `rangeLow`/`rangeHigh`/
   `roundTo` band controls.
3. **Lead delivery:** set `web3formsKey` to the mover's [Web3Forms](https://web3forms.com)
   access key. Submissions email them the full lead. Leave it `""` for a demo (the form shows a
   mailto fallback instead of sending).
4. Deploy to Vercel (output = repo root, no framework).

## Pricing model

Hourly: `crew × hours × hourlyRate + truckFee + add-on effects`, shown as a `rangeLow` to `rangeHigh`
band rounded to `roundTo`. Long-distance move types (`mode: "contact"`) show a "custom quote"
call-to-action instead of a number.

## Tests

- `node --test`: unit tests for the pricing function (`pricing.test.js`).
- Open `test.html` in a browser for a visual pass/fail on the same cases.

## Files

- `index.html`: markup, styles, `SITE` config, UI wiring.
- `pricing.js`: pure `estimate()` pricing function (shared by the page and the tests).
- `pricing.test.js` and `test.html`: tests.
