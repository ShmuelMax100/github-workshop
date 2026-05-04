# Workshop Slides

Built with [Slidev](https://sli.dev). Markdown in → modern presentation out.

## Live site

Once GitHub Pages is enabled, slides will be live at:

**https://shmuelmax100.github.io/github-workshop/**

## Run locally

```bash
cd slides
npm install
npm run dev
```

Opens at `http://localhost:3030`.

## Build static site

```bash
npm run build
```

Outputs to `slides/dist/`. The GitHub Actions workflow at
[`.github/workflows/deploy-slides.yml`](../.github/workflows/deploy-slides.yml)
runs this on every push to `main` and deploys to GitHub Pages.

## Edit content

All slides live in [`slides.md`](./slides.md). Slides are separated by `---`.
See [Slidev docs](https://sli.dev/guide/syntax.html) for syntax (code blocks,
animations, layouts, presenter notes via `<!-- -->`).

## Export to PDF

```bash
npm run export
```

Requires Playwright (`npx playwright install chromium`).
