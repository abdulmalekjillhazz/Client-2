# RoyalCity Redesign Implementation Brief

## Goal

Turn the current villa demo into a clear, trustworthy booking experience. Help guests find a suitable stay, compare real listing details, understand the price, and continue booking without losing their place.

## Design principles

- Use only business facts and listing attributes that exist in the approved source data.
- Do not invent inventory, reviews, ratings, amenities, contact details, policies, or service promises.
- Make villa search the primary guest task; keep supporting actions secondary.
- Put decision-critical information beside the action it affects: property facts and photos on detail pages, total price and terms beside booking.
- Preserve destination, dates, guest count, and selected villa as visitors move through search, login, and booking.
- Make important actions and labels readable and usable on touch screens, keyboard, and reduced-motion settings.
- Keep customer-facing pages visually consistent with the established RoyalCity palette.

## Implementation sequence

### Step 1 — Trust and continuity — complete

- [x] Remove unsupported hero statistics and the unverified named-property promotion.
- [x] Remove amenity claims and heuristic filters until listing data contains verified amenity fields.
- [x] Show only images supplied for the selected listing; do not fill galleries with unrelated images.
- [x] Remove placeholder contact/social details and internal API playground links from guest navigation.
- [x] Preserve the selected villa in the login return URL when the guest chooses to book.
- [x] Remove unsupported review, check-in, map, and host-service claims where no listing/client data backs them.

### Step 2 — Find a stay — complete

- [x] Redesign the hero around destination, dates, and guest count.
- [x] Connect search inputs to listing filters and preserve the query in the URL.
- [x] Keep the collection count and visible results synchronized with the selected filters.

### Step 3 — Compare listings

- Make villa cards scannable with consistent location, guest capacity, price/currency, and verified review information.
- Show rating only when backed by actual reviews; label review count.
- Keep interaction cues visible without hover.

### Step 4 — Decide and book

- Show a property-specific image set and verified facts.
- Show the selected nights, currency, fees/taxes, and total before confirmation when the data is available.
- Present cancellation, payment, check-in, and location details only from approved listing/policy data.
- Keep booking action accessible on mobile without obscuring content.

### Step 5 — Visual and accessibility polish

- Unify typography, color, spacing, card, and button patterns.
- Improve small text and image contrast.
- Reduce motion that hides navigation or delays comparison.
- Verify responsive layout, keyboard navigation, reduced motion, and the complete search-to-book flow in a browser.

## Progress and live verification

- Step 1 and Step 2 are implemented.
- `npm.cmd run build` completed successfully after these changes.
- Local production checks returned HTTP 200 for `/`, `/villas` with destination/date/guest query parameters, the generated CSS asset, and the villa availability endpoint. The tested dates returned `available: true`.
- A source scan found no remaining audited placeholder claims/contact details.
- Browser-based visual/accessibility verification and remaining steps still need completion. Price currency/locale, verified property details, and booking policies remain pending client facts; do not invent them.

## Client facts still needed

- Official business name and contact channels.
- Markets served and the correct currency/locale for prices.
- Approved inventory count and any public service claims.
- Verified amenities and image sets for each property.
- Review/rating source, cancellation/payment terms, check-in/out times, and location/map policy.
