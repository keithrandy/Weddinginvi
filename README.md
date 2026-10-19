# Keith & Althea — Wedding Invitation Website

Modern, minimalist, mobile-friendly wedding invitation in dusty blue, white, and champagne.

## Run locally
1. Open this folder in VS Code.
2. Open `index.html` in a browser (or use the Live Server VS Code extension).

## Customize
- `index.html`: update venue, addresses, times, dress code, RSVP deadline, contact info, love story, and map URLs.
- `script.js`: update `SETTINGS.weddingDate` with the wedding's Philippines-local time including `+08:00`, e.g. `2027-05-16T15:00:00+08:00`. The date will display in the hero and countdown.
- `script.js`: update `SETTINGS.rsvpEmail` to an inbox you control. The RSVP form prepares an email that the guest must send; **this static website does not store RSVPs or automatically submit them**.
- `styles.css`: customize colors in `:root` and styling.

## Add couple photos
1. Put images in the `assets` folder, e.g. `couple-1.jpg`, `couple-2.jpg`, `couple-3.jpg`.
2. Replace a `<div class="photo-placeholder ...">...</div>` in `index.html` with e.g. `<img class="gallery-photo" src="assets/couple-1.jpg" alt="Keith and Althea together" loading="lazy">`.
3. Add to `styles.css`:
   `.gallery-photo{width:100%;height:100%;object-fit:cover;min-height:270px}`
   Then adjust images to your desired layout; the present placeholders intentionally use colored gradients.

## Publish on GitHub Pages
1. Create a public repository called `our-wedding`.
2. Upload `index.html`, `styles.css`, `script.js`, and `assets/` at the root of the repository.
3. In repository Settings > Pages, set **Deploy from a branch**, choose `main` and `/ (root)`.
4. Your URL will usually be `https://YOUR-USERNAME.github.io/our-wedding/`.

## Important
- The map links currently open Google Maps homepage until you insert venue links.
- RSVP placeholders and timeline details are intentionally unfilled.
- Do not collect sensitive guest details using mailto. For centralized attendance management, use a properly configured form service or Google Form rather than claiming this demo saves submissions.
