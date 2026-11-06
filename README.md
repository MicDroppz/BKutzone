# Barber Kutzone Store - Space & Cyber Edition

A futuristic, space-themed online store for high-tech barber tools and cybernetic barber attire. Built with plain HTML5, CSS3, and vanilla JavaScript. Deployed on Cloudflare Pages and managed via PageCMS.

## Local Development
Since the project uses `fetch()` to dynamically retrieve JSON configuration and content files, running it through a local HTTP server is required.

1. Open your terminal in the project root directory.
2. Run a simple local server using Python, Node, or VS Code Live Server:
   - Python 3: `python -m http.server 8000`
   - Node (`npx`): `npx serve .`
3. Open `http://localhost:8000` in your browser.

## PageCMS Configuration
- PageCMS reads configuration from `.pages.yml`.
- All site text can be edited in `content/site.json`.
- Products and categories can be updated, added, or removed in `content/products.json`.
- Uploaded media assets store directly in the `/images` folder.

## Cloudflare Pages Deployment
- **Framework Preset**: None (Static HTML)
- **Build Command**: Leave empty (or `exit 0`)
- **Build Output Directory**: `/` (Root directory)