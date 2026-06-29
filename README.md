# MoveQuote — Instant Moving-Quote Estimator (template)

**Live demo:** https://moving-quote-estimator.vercel.app/

A self-contained, single-page **instant moving-quote estimator** for moving companies.
A visitor picks home size, move type, and add-ons, gets an instant ballpark price range,
then submits contact details — capturing a fully-qualified lead (move date, ZIPs, home size,
add-ons, quoted range), not just a name and phone number.

Built by [Watchlight Interactive](https://watchlightinteractive.com). Static, no build step.

## Re-skin it for a mover (≈5 minutes)

Everything company-specific lives in the `SITE` object at the bottom of `index.html`:

1. **Brand** — `name`, `tagline`, `logoUrl`, `serviceArea`, `phone`/`phoneHref`, `rating`,
   `colors` (`primary`, `primaryDark`, `dark`), `footer`, and an optional `demoBar` banner.
2. **Pricing** — `hourlyRate`, `truckFee`, `homeSizes` (crew + hours per size), `addOns`
   (each with an `effect`: `hoursMult`, `hoursAdd`, or `flat`), and the `rangeLow`/`rangeHigh`/
   `roundTo` band controls.
3. **Lead delivery** — set `web3formsKey` to the mover's [Web3Forms](https://web3forms.com)
   access key. Submissions email them the full lead. Leave it `""` for a demo (the form shows a
   mailto fallback instead of sending).
4. Deploy to Vercel (output = repo root, no framework).

## Pricing model

Hourly: `crew × hours × hourlyRate + truckFee + add-on effects`, shown as a `rangeLow`–`rangeHigh`
band rounded to `roundTo`. Long-distance move types (`mode: "contact"`) show a "custom quote"
call-to-action instead of a number.

## Tests

- `node --test` — unit tests for the pricing function (`pricing.test.js`).
- Open `test.html` in a browser — visual pass/fail for the same cases.

## Files

- `index.html` — markup, styles, `SITE` config, UI wiring.
- `pricing.js` — pure `estimate()` pricing function (shared by the page and the tests).
- `pricing.test.js` / `test.html` — tests.
