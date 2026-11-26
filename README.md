# Prairie Ember Landscape Co. design preview

Design preview prepared by Premier Code Inc.

Prairie Ember Landscape Co. is a fictional company made for a generic demo shown to landscape
design-build firms in Dallas-Fort Worth. Prices, reviews, license numbers and contact details are
samples, and every photo is royalty-free stock (see `credits.html`).

**Preview:** https://landscape.premiercodeinc.com/

## The three options

| Option | Concept | Link |
|---|---|---|
| Option A | Golden hour: dark, cinematic dusk photography, large serif headlines, slow parallax | https://landscape.premiercodeinc.com/option-a/ |
| Option B | Garden journal: airy sage-and-cream editorial layout, botanical line drawings, framed hero video, project gallery as the centerpiece | https://landscape.premiercodeinc.com/option-b/ |
| Option C | Native Texas: limestone, cedar-brown and bluebonnet palette, field-guide styling, a seasonal planting calendar as the signature section | https://landscape.premiercodeinc.com/option-c/ |

Switch between them with the Option A / B / C control at the bottom-left of every page.
Photo credits: https://landscape.premiercodeinc.com/credits.html

## Confirm with the client before launch

Every item below is marked `<!-- PLACEHOLDER -->` in the option pages and is a sample today.

- **Company details:** legal name, phone number, email address and the cities actually served.
- **TCEQ Licensed Irrigator:** the irrigator's name and LI number. Texas rule 30 TAC §344.70(b) requires both on all irrigation advertising, including the website. It appears in the irrigation service and the footer.
- **Insurance** status and wording, and the **founding year** ("Serving Collin County since").
- **Consultation terms:** free or paid, length on site, and follow-up timing.
- **Design phase:** typical duration, the design fee range and whether it is credited toward the build.
- **Build timing** wording, and the process durations.
- **Maintenance plans:** tier names, what each includes, and prices.
- **"Projects typically start at"** figures for patios, lighting, irrigation and retaining walls.
- **Warranties:** plant warranty terms, and the written irrigation warranty wording.
- **Reviews:** replace the three sample reviews with real reviews the client has permission to publish.
- **Form:** the budget ranges offered, and where submissions should go (separate transactional and marketing senders).
- **reCAPTCHA v3:** add the script and token field where the placeholder comment sits in each form, and wire up the honeypot check on the server.
- **Photos:** replace stock photos with the client's own project photos (with homeowner permission), and keep `credits.html` for any stock that remains.

## Remove at launch

- [ ] The option switcher: the block between `<!-- REMOVE AT LAUNCH -->` comments at the end of each option page, and the "Switcher side effect" CSS block at the end of each option's `styles.css`.
- [ ] The two options the client doesn't choose, and the root `index.html` redirect page.
- [ ] The "Design preview" bar at the top of each page, and every visible "Sample" label once the facts are real.
- [ ] `<meta name="robots" content="noindex, nofollow">` on every page (only once the client has signed).
- [ ] The `Disallow: /` block in `robots.txt`.

## Notes

- Static files only: no build step. Each option is `option-x/index.html`, `styles.css` and `main.js`, sharing `assets/`.
- The forms are preview-only and never send anything.
- Research behind the copy (approved facts, licensing rules, plant sources) is kept outside this repo.
