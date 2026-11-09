# IVB V49 — Split HTML/CSS/JS + Bootstrap

## Project structure

- `index.html` — page structure and content
- `css/styles.css` — all custom IVB styling
- `js/main.js` — all original inline interactions, kept in their original order
- `assets/` — put the original local media files here

## Bootstrap

Bootstrap **5.3.3** is included via jsDelivr CDN:
- Bootstrap CSS is loaded before `css/styles.css`.
- Bootstrap bundle JS is loaded before `js/main.js`.

The site's original custom `.container` class was renamed to `.ivb-container` so it does not override Bootstrap's `.container` component. Existing IVB styling and layouts are otherwise retained.

## Important: restore the local assets

The source HTML references these files under `assets/`:

- `About-Kids.png`
- `Splash.webm`
- `amer.png`
- `card1.png`
- `card2.png`
- `card3.png`
- `cursor.png`
- `iim-calcutta-logo.png`
- `ivb-build.mp4`
- `ivb-hero.webm`
- `kumara.jpg`
- `logo.webp`
- `mano.png`
- `nit-trichy-logo.png`
- `ssn-logo.png`

Those files were not present alongside the source HTML in the current workspace, so they have not been fabricated or bundled. Copy the original `assets` folder from the existing website into this project's `assets/` directory, preserving filenames.

## Run locally

Use a local web server (recommended for video/media paths), for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Bootstrap is loaded from a CDN, so an internet connection is required for Bootstrap itself. Google Fonts and remote image sources also continue to load from their existing external URLs.

## Notes

- This is a structural split of the approved V49 page; the original content and interactions are preserved.
- No claim of full Bootstrap component conversion is made. Bootstrap is integrated and available for future grid, spacing, responsive utilities, forms, and components.
- Validate the site in a browser after restoring local assets.
