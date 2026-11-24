# RoyalCity UI/UX Design Audit

**Date:** 24 November 2026
**Scope:** Local production build at `http://localhost:3000`; home, villa directory, villa detail, contact, notes, auth, and shared navigation; source review of the booking and filtering flows.
**Audit type:** Heuristic product-design review. No analytics, user interviews, or real booking data were available.

## Executive summary

The interface has a usable starting structure and a coherent luxury-travel direction: large property photography, clear page headings, responsive grids, and a visible villa-browsing action. The main design risk is credibility. Several promises, prices, property features, and contact details look like demo content, while the page presents them as real. A traveler deciding whether to spend a substantial amount needs accurate listing evidence, understandable pricing, and confidence that the next action will preserve their booking intent.

The biggest wins are to make all claims/data truthful, make search the primary path, and show reliable property-specific proof before asking people to book.

## Priority improvements

### P0 — Fix trust and booking continuity before launch

1. **Replace or remove placeholder contact details.** The contact page and footer display `+91 000 000 0000`, `ozgur@gmail.com`, and “All Rights Reserved by Ozgur.” These look unfinished and make it hard to believe support is available. Use the actual business identity, service region, contact channels, and legal entity; hide fields that are not ready.
   Evidence: `src/components/Contact/Contact.jsx`, `src/components/Footer/Footer.jsx`.

2. **Make headline proof match the inventory.** The home hero claims “240+ Elite Villas,” “4.9/5 Guest Rating,” “38 Destinations,” and “24/7 Concierge,” while the seed catalog contains 9 villas. Keep only claims the client can substantiate, and calculate them from live data where appropriate. Unsupported numbers can lower trust more than having no numbers.
   Evidence: `src/subComponents/HeroSection.jsx`, `src/villas.js`, `server/data/villas.js`.

3. **Use real property attributes for feature filters.** “Pet Friendly” currently means guest capacity ≤12; “Electric Car” means nightly rent ≥250; “Fitness/Gym” means at least 6 bedrooms; “Boat Morning” means Greece. These rules can return properties that do not provide the advertised amenity. Add explicit amenity fields to listing data and filter only on those fields; remove a filter until its data is reliable.
   Evidence: `src/components/Villa/Villas.jsx`, `src/subComponents/OurSpecialities.jsx`.

4. **Show only photos from the selected villa.** The detail gallery combines the selected listing photo with generic site photos such as `/landing.jpg`, `/people2.jpg`, and `/villa10.jpg`. A guest may read those as photos of the property they are about to book. Store a property-specific image array and never silently fill it with unrelated homes.
   Evidence: `src/components/Villa/SingleVilla.jsx` (`galleryImages`).

5. **Preserve the villa when sign-in interrupts booking.** “Sign in to book” passes React Router `state`, but the new Next link adapter discards that state; login redirects using a `next` query parameter. After authentication, the guest can lose the villa they intended to book. Put the return destination in a safe `next=/villa/[id]` URL and verify it survives login and registration.
   Evidence: `src/components/Villa/BookingPanel.jsx`, `src/components/NextLink.jsx`, `src/components/Auth/Login.jsx`.

### P1 — Make choosing and comparing stays easier

6. **Put a useful search form in the first screen.** The hero offers “Explore Villas” and “Talk to us,” but no destination, dates, or guest search. Villa discovery usually starts with a trip constraint. Add destination, check-in/out, and guest count with a single “Search stays” action; let “Explore all” remain secondary. Do not imply availability until dates are checked.

7. **Improve villa-card decision information.** Cards show price, location/category, capacity, bedrooms, area, and bathrooms, but omit the listing rating even though the page promises standout ratings. Show verified rating/review count, actual standout amenity, and a consistent location. Make “View stay” visible without hover so touch users receive the same cue. Avoid using area or bedroom count as a substitute for guest-relevant features.
   Evidence: `src/components/Villa/VillaCard.jsx`, `src/subComponents/TopVillas.jsx`.

8. **Clarify the real price.** “Rs. 240 / night” does not say which rupee currency, and the guest-facing pages target European destinations. Use the correct ISO currency and locale formatting. On the detail/booking panel, show the selected dates, nights, fees/taxes, and total before asking the guest to confirm; explain what can still change.
   Evidence: `src/components/Villa/VillaCard.jsx`, `src/components/Villa/BookingPanel.jsx`, `src/components/Auth/Profile.jsx`.

9. **Make the villa directory filters understandable.** Distinguish destinations from property types, label the active filters, provide a clear reset action, and show result counts after each change. The current heading mixes location and category chips without a clear filter structure, and amenity filters are not represented in the data. Keep filter state in the URL so searches can be shared.
   Evidence: `src/components/Villa/Villas.jsx`.

10. **Move the Notes API Playground out of guest navigation.** It is exposed as “Notes” in the main nav and footer even though the page is an API CRUD playground. That reads like an unfinished internal tool and distracts from villa discovery. Remove it from public navigation; if staff need it, gate it behind an internal/admin route.
    Evidence: `src/components/Navbar/Navbar.jsx`, `src/components/Footer/Footer.jsx`, `src/components/Notes/Notes.jsx`.

11. **Add booking confidence near the decision point.** Show cancellation terms, payment timing, what is included, host response expectations, and how reviews are verified next to the availability/booking controls. These answer high-stakes questions at the moment they matter rather than asking the guest to infer them.
    Evidence: `src/components/Villa/BookingPanel.jsx`, `src/components/Villa/SingleVilla.jsx`.

### P2 — Refine the brand and reduce friction

12. **Replace generic/mismatched marketing copy with a specific promise.** “Be Our Guest,” “Nightline Penthouse,” “Elite Villas,” and “curated homes” do not clearly say where RoyalCity operates or why it is different. Align the hero headline, image, and proof with the actual destination, audience, and service proposition. Do not feature a named property unless it exists in inventory.
    Evidence: `src/subComponents/HeroSection.jsx`.

13. **Build a consistent visual system.** The main pages use warm brand tones and rounded cards, while the Notes tool uses a separate blue/purple gradient style. Define a small set of brand tokens for color, type scale, spacing, borders, and button hierarchy, then apply them consistently to customer-facing pages. Reserve high-saturation color for meaningful actions or statuses.
    Evidence: `tailwind.config.js`, `src/components/Notes/Notes.jsx`.

14. **Raise the readability of secondary text.** Several repeated labels and hero-stat captions are 11–13px, while much body copy is 14px. Increase task-critical labels, prices, filter controls, and metadata to comfortably readable sizes; keep small text for nonessential captions only. Check contrast over photography in both themes.
    Evidence: `src/subComponents/HeroSection.jsx`, `src/components/Notes/Notes.jsx`, `src/components/Villa/VillaCard.jsx`.

15. **Reduce movement that competes with browsing.** The navbar hides while scrolling down, cards animate into view, and the hero has pulsing effects. Motion can add polish, but on a property-search task it should not hide navigation or delay comparison. Keep the nav easy to recover, respect reduced-motion preference everywhere, and prioritize stable images/layout.
    Evidence: `src/components/Navbar/Navbar.jsx`, `src/components/Villa/VillaCard.jsx`, `src/subComponents/HeroSection.jsx`.

16. **Make the About and Host claims provable.** Copy promises hand verification, verified travelers, dynamic pricing guidance, and dedicated support. Explain what “verified” means, how support works, and what hosts actually receive; otherwise soften or remove the claims.
    Evidence: `src/subComponents/About.jsx`, `src/components/AboutUs/AboutUs.jsx`, `src/subComponents/Host.jsx`.

## Suggested redesign order

1. Confirm the real brand, operating markets, currency, contact details, inventory count, and supported amenities with the client.
2. Fix false/missing property data and the sign-in return path.
3. Redesign the home hero around destination/date/guest search and truthful proof.
4. Redesign listing cards and filters to support fast, credible comparison.
5. Rework the detail page around property-specific media, transparent total price, reviews, policies, and a persistent booking action.
6. Remove internal/demo UI from guest routes and unify the remaining visual system.
7. Check desktop and mobile layouts, keyboard use, reduced motion, contrast, image loading, and the complete search-to-book path in a real browser.

## Verification notes

- Local production build completed successfully during the audit.
- Live production checks returned HTTP 200 for home, villas, contact, notes, register, and the catalog/notes/health API endpoints.
- The production stylesheet returned HTTP 200 and included the project’s custom utility rules.
- A screenshot-capable connected browser was not available in this session, so this report does not claim a pixel-level visual inspection, cross-browser check, or screen-reader/accessibility test. Those should be part of the redesign QA pass.
