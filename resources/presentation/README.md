# GitLab → GitHub Presentation

> **TL;DR** — The slide deck is generated from a single Markdown file (`gitlab-to-github-slides.md`) by `build_pptx.py`. Edit the Markdown, run `python build_pptx.py`, and out comes a 25-slide 16:9 `.pptx` with speaker notes baked in.

Source-controlleddeck for the workshop session covering terminology mapping,
PR lifecycle, `gh` CLI, branch protection, repository lifecycle, and quick
UI flows.

## Files

- [gitlab-to-github-slides.md](gitlab-to-github-slides.md) — single source of
  truth: titles, bullets, speaker notes, and visual hints.
- [build_pptx.py](build_pptx.py) — generates `gitlab-to-github.pptx` from the
  Markdown source.

## Build the `.pptx`

```powershell
pip install python-pptx
python build_pptx.py
```

Output: `gitlab-to-github.pptx` (16:9, 25 slides, speaker notes included).

## Editing

Edit the Markdown file and re-run the build script. The structure per slide is:

```markdown
## Slide N — Title

- Bullet 1
- Bullet 2
- Bullet 3

**Speaker notes:**
One paragraph of speaker notes.
```

## Tone & humor

Light humor appears on roughly 1 in 6 slides (slides 6, 16, 21). References
are subtle nods to *The Office* and *Silicon Valley*. Keep additions tasteful
and skippable — one line, no meme templates.
