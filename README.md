# Yogesh Munees

A static portfolio. The site opens on the yard: nine pieces of work you can walk. Quick glance opens the résumé. Overview, work, and about are ordinary pages. On a phone, use the stick. On a desktop, click the ground or use WASD.

There is no server, database, account, or analytics call.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

The production build is the `dist` folder. It prerenders each page to its own `index.html`, so the résumé, work, and about pages are readable without JavaScript.

Set `VITE_SITE_URL` to the public origin, with no trailing slash, before `npm run build` when you want absolute canonical URLs, Open Graph URLs, and a sitemap. Example: `VITE_SITE_URL=https://example.com`. Without it, a small script fills those tags from the address the visitor actually loaded.

## Host it for free

Cloudflare Pages is the primary target: unlimited static bandwidth and requests on the free plan, with nothing to keep running.

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a project from the repository.
3. Build command: `npm run build`
4. Output directory: `dist`

GitHub Pages is the fallback. The workflow in `.github/workflows/pages.yml` publishes `dist` on every push to `main`. In the repository settings, set Pages to deploy from GitHub Actions.

A `*.pages.dev` or `*.github.io` address stays inside the free tier. A custom domain is optional and usually has a yearly registration fee.

## What stays out of the hosted site

Employer work is described at the level of a résumé: no customer names, source, schemas, or internal addresses. The phone number is omitted. There is no résumé download. The sign-language studio explains the pipeline and does not invent signs. Certification links open the public credential pages; the two Google Drive files have to be shared so anyone with the link can view them.
