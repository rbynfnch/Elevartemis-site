# Elevartemis Marketing Group website

Static site: plain HTML, CSS, and JavaScript. No framework, no build step, no package.json.
Hosted on Vercel, deployed automatically from GitHub (`rbynfnch/Elevartemis-site`).

## Brand
- The name is spelled **Elevartemis** in all copy (the logo wordmark displays in capitals via CSS).
- Tone: practical, approachable, smart, confident. Not corporate, not salesy.
- Palette and fonts live as CSS variables at the top of `css/styles.css`
  (navy backgrounds, purple `--purple*`, orange `--orange*`; Libre Baskerville for headings, Montserrat for body).

## Structure
| Page | Files |
|---|---|
| Home | `index.html` |
| Services | `services.html`, `css/services.css` |
| Our Work | `work.html`, `css/work.css`, `js/work.js` |
| Resources | `resources.html`, `css/resources.css`, `js/resources.js`, `js/resources-data.js` |
| About | `about.html`, `css/about.css`, `js/about.js` |
| Contact | `contact.html`, `css/contact.css`, `js/contact.js` |
| Articles | `articles/*.html`, `css/article.css` |

- `css/styles.css` and `js/main.js` are shared by every page (header, footer, scroll reveals, mobile menu).
- `js/newsletter.js` handles every newsletter signup.
- Every page repeats the same header nav and footer. When a link changes, update all six pages and every article in `articles/`.
- Nav order: Home | Services | Our Work | Resources | About | Contact.

## Articles
- One page per article in `articles/` (e.g. `articles/seo-isnt-dead.html`). Copy an existing article
  as the template. Links inside `articles/` use `../` (`../css/styles.css`, `../contact.html`).
- Articles live under Resources (no separate nav item). After adding one: add it to `articles` in
  `js/resources-data.js` with its `url`, and update the "From the Marketing Library" cards on the home page.
- The header and footer are repeated in every article too, so nav/footer changes apply there as well.

## Do not break
- **Formspree links.** The contact form's `action` in `contact.html` and `NEWSLETTER.action` in
  `js/resources-data.js` are live endpoints. Never blank or overwrite them.
- **Resources content** comes from `js/resources-data.js`. Add guides, tools, articles, and
  Start Here paths there instead of hard-coding cards in HTML. Leave `url: ''` and the card shows "Coming soon".
- **Hidden client logo strip** on the home page is commented out on purpose (saved for later). Don't delete it.

## Conventions
- Reuse existing classes and CSS variables before adding new ones. Watch for name clashes:
  `styles.css` already defines generic classes like `.step`, `.card`, and `.chip`.
- Animations use `data-reveal` (fade-up on scroll) and `data-sequence` with `.seq-item` and `--i` (staggered).
  Always add a `prefers-reduced-motion` fallback.
- Keep pages accessible: real labels, alt text (empty `alt=""` for decorative images), visible focus, keyboard support.
- Check layouts at desktop (about 1440px) and phone (about 390px) widths.
- Don't invent client names, results, testimonials, or metrics. Use [bracketed] placeholders.
- `images/work-elevartemis-desktop.jpg` and `-mobile.jpg` are screenshots of the home page shown on Our Work.
  If the home page changes noticeably, mention that they may need refreshing.

## Deploying
- Vercel deploys from GitHub on every push. There are no environment variables.
- Claude can read the Vercel project (team "Elevartemis", project `elevartemis-site`) through the
  Vercel connector: deployment status, build logs, runtime errors, domains. If a deploy fails, check
  the build log there first.
- Don't roll back, promote, or change Vercel settings, domains, or DNS without asking the owner first.
