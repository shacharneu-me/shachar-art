# Artist website

A front-end-only artist website built with Next.js. All content — text, images, works,
exhibitions — is edited through a content editor built into the site itself at `/studio`.
There is no server or database to run: the content lives in Sanity's hosted service, and
the site is a set of static pages that refresh when content changes.

- **About** — `/` — one image and text
- **CV** — `/cv` — text, plus an optional PDF download
- **Works** — `/works` — a scrolling index; each row shows an image, the title and the date.
  Clicking a row opens an overlay with the materials, text, extra images and a link to the
  exhibition. The overlay has no URL of its own, so the browser's back button always leaves
  the page rather than closing the overlay.
- **Selected Exhibitions** — `/exhibitions` and `/exhibitions/<name>` — title, date,
  curatorial text and the list of works. Clicking a work opens the same overlay.

---

## Running it locally

```bash
npm install
npm run dev
```

The site is at http://localhost:3000 and the content editor at http://localhost:3000/studio.

Until the CMS is connected (below) the pages render with a short note in place of content.

## Connecting the CMS

The content editor needs a free Sanity project. This is a one-time setup.

1. Create an account at [sanity.io](https://www.sanity.io/) and create a new project.
   Choose the **Production** dataset and make it **public** (the website reads content
   without a password; editing still requires a login).
2. Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

   The project ID is on the project's page at [sanity.io/manage](https://www.sanity.io/manage).

3. In **sanity.io/manage → API → CORS origins**, add `http://localhost:3000` and your live
   domain, both with credentials allowed. Without this the editor cannot save.
4. Restart `npm run dev` and open `/studio`. Log in, then fill in **Site settings** first —
   the name there appears in the header and in search results.

## Editing content

Everything is at `/studio` on the live site. The sidebar has five items:

| Item                     | What it controls                                              |
| ------------------------ | ------------------------------------------------------------- |
| **About**                | The image and text on the front page                          |
| **CV**                   | The CV page, and an optional PDF to download                  |
| **Works**                | Every work                                                    |
| **Selected Exhibitions** | Every exhibition, and which works belong to it                |
| **Site settings**        | Name, contact details and the default search description      |

Nothing is published until you press **Publish**.

A few things worth knowing:

- **A work's exhibition is set from the exhibition, not the work.** Add the work to an
  exhibition's **Works** list, and the link back to that exhibition appears automatically in
  the work's overlay. This keeps the connection in one place.
- **Works have two dates.** *Date* is a real date and only decides the order works appear
  in (newest first). *Date shown on the site* is optional free text for cases like
  `2022–2024`; when it is empty the site shows just the year.
- **Exhibitions also have two dates**, for the same reason: *Date* is free text shown
  exactly as written (`March 2024`, `June – August 2023`), and *Sort date* only controls
  the order.
- **Image descriptions** are worth filling in. They are read aloud by screen readers and
  used by search engines. The Studio flags a missing one as a warning, not an error.
- **Drag to reorder** the works inside an exhibition, and the extra images inside a work.

## Publishing the site

Any host that runs Next.js works; [Vercel](https://vercel.com) is the least work. Import the
repository, then set the same three environment variables from `.env.local` in the host's
project settings. `NEXT_PUBLIC_SITE_URL` must be the real domain, since the sitemap,
canonical URLs and social previews are built from it.

### Instant updates

Published edits appear within a minute on their own. To make them appear immediately:

1. Pick a long random string as a secret.
2. Add it to the host's environment variables as `SANITY_REVALIDATE_SECRET`, and redeploy.
3. In **sanity.io/manage → API → Webhooks**, create a webhook:
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: create, update, delete
   - **HTTP method**: `POST`
   - **Secret**: the same string

## How it is put together

```
app/
  (site)/          the visible pages, sharing the header and footer
  studio/          the content editor, deliberately outside the site layout
  api/revalidate/  webhook that refreshes pages when content is published
  sitemap.ts       lists every page, including one entry per exhibition
  robots.ts
components/        header, footer, lists, the work overlay
sanity/
  schemaTypes/     what the artist can fill in, and the rules for each field
  structure.ts     the order of the Studio's sidebar
  lib/queries.ts   the GROQ queries that read content
  lib/content.ts   one function per query, used by the pages
```

Notes for whoever edits the code next:

- **Styling** is Tailwind CSS v4. The palette and the hairline rule live in
  `app/globals.css`; there is no config file. The font is the system sans-serif stack, so
  nothing is downloaded before text is readable.
- **Images** are resized by Sanity's CDN through the custom loader in
  `sanity/lib/image-loader.ts`, so the host never does a second optimization pass. Blur
  placeholders come from Sanity's own tiny previews.
- **Caching**: pages are static and refresh at most once a minute
  (`sanity/lib/fetch.ts`), or immediately via the webhook above. If a query fails the page
  falls back to an empty state instead of erroring.
- **SEO**: per-page titles and descriptions come from the CMS with sensible fallbacks, plus
  `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph images and JSON-LD structured
  data (`Person`, `VisualArtwork`, `ExhibitionEvent`).
- `AGENTS.md` and `CLAUDE.md` are generated by `next dev` and are meant to be committed.

## Commands

| Command            | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Local development server                        |
| `npm run build`    | Production build                                |
| `npm start`        | Serve a production build                        |
| `npm run lint`     | ESLint                                          |
| `npm run typecheck`| TypeScript                                      |
| `npm run typegen`  | Regenerate types from the CMS schema (optional) |
