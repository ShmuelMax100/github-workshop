const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "GitHub Workshop — SecuriThings";

// ── Palette ────────────────────────────────────────────────────────────────────
const BG        = "0D1117";   // GitHub dark background
const BG_CARD   = "161B22";   // card/panel background
const BG_LIGHT  = "21262D";   // lighter panel
const GREEN     = "3FB950";   // GitHub green
const BLUE      = "58A6FF";   // GitHub blue
const PURPLE    = "D2A8FF";   // accent purple
const ORANGE    = "F0883E";   // accent orange
const WHITE     = "FFFFFF";
const GRAY      = "8B949E";   // muted text
const GRAY_LIGHT= "C9D1D9";   // body text

// ── Helper: module divider ─────────────────────────────────────────────────────
function addDivider(num, title, subtitle, duration, color) {
  const s = pres.addSlide();
  s.background = { color: BG };

  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: color }, line: { color: color }
  });

  // Module number
  s.addText(`MODULE ${num}`, {
    x: 0.4, y: 1.5, w: 9.2, h: 0.5,
    fontSize: 13, bold: true, color: color,
    charSpacing: 6, align: "left"
  });

  // Title
  s.addText(title, {
    x: 0.4, y: 2.0, w: 9.2, h: 1.2,
    fontSize: 44, bold: true, color: WHITE, align: "left"
  });

  // Subtitle
  s.addText(subtitle, {
    x: 0.4, y: 3.2, w: 7, h: 0.5,
    fontSize: 20, color: GRAY_LIGHT, align: "left"
  });

  // Duration badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.85, w: 1.9, h: 0.42,
    fill: { color: color }, line: { color: color }
  });
  s.addText(duration, {
    x: 0.4, y: 3.85, w: 1.9, h: 0.42,
    fontSize: 13, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
  });
}

// ── Helper: slide header ───────────────────────────────────────────────────────
function addHeader(slide, title, accentColor) {
  slide.background = { color: BG };
  slide.addText(title, {
    x: 0.45, y: 0.28, w: 9.1, h: 0.62,
    fontSize: 26, bold: true, color: WHITE, align: "left"
  });
  // thin accent line under title
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 0.93, w: 1.4, h: 0.05,
    fill: { color: accentColor || GREEN }, line: { color: accentColor || GREEN }
  });
}

// ── Helper: code block ─────────────────────────────────────────────────────────
function addCode(slide, code, x, y, w, h, fontSize) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: "010409" }, line: { color: "30363D", pt: 1 }
  });
  slide.addText(code, {
    x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.16,
    fontSize: fontSize || 9, fontFace: "Consolas", color: GRAY_LIGHT,
    align: "left", valign: "top"
  });
}

// ── Helper: card ──────────────────────────────────────────────────────────────
function addCard(slide, x, y, w, h, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  // left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: accentColor }, line: { color: accentColor }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };

  // GitHub octocat-style corner dots
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      s.addShape(pres.shapes.OVAL, {
        x: 8.5 + i * 0.28, y: 0.2 + j * 0.28, w: 0.12, h: 0.12,
        fill: { color: "21262D" }, line: { color: "21262D" }
      });
    }
  }

  s.addText("GitHub Workshop", {
    x: 0.5, y: 1.2, w: 9, h: 1.3,
    fontSize: 52, bold: true, color: WHITE, align: "left"
  });

  // Green underline accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.5, w: 5.5, h: 0.07,
    fill: { color: GREEN }, line: { color: GREEN }
  });

  s.addText("From GitLab & Jenkins to GitHub-Native Development", {
    x: 0.5, y: 2.7, w: 9, h: 0.6,
    fontSize: 20, color: GRAY_LIGHT, align: "left"
  });

  // Detail pills
  const pills = [
    { label: "SecuriThings Engineering", color: BG_LIGHT },
    { label: "3.5 Hours", color: BG_LIGHT },
    { label: "Hands-On", color: BG_LIGHT },
  ];
  pills.forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5 + i * 2.5, y: 3.65, w: 2.3, h: 0.38,
      fill: { color: p.color }, line: { color: "30363D", pt: 1 }
    });
    s.addText(p.label, {
      x: 0.5 + i * 2.5, y: 3.65, w: 2.3, h: 0.38,
      fontSize: 12, color: GRAY_LIGHT, align: "center", valign: "middle", margin: 0
    });
  });

  s.addText("3 Modules: Collaboration  ·  Actions  ·  Operations", {
    x: 0.5, y: 4.3, w: 9, h: 0.4,
    fontSize: 13, color: GRAY, align: "left"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — AGENDA
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Agenda", BLUE);

  const rows = [
    { num: "01", label: "GitHub Collaboration & CI Flow", time: "60 min", color: GREEN },
    { num: "02", label: "GitHub Actions Deep Dive",       time: "80 min", color: BLUE },
    { num: "—",  label: "Break",                          time: "10 min", color: GRAY },
    { num: "03", label: "Day-to-Day Operations & Debugging", time: "30 min", color: ORANGE },
  ];

  rows.forEach((r, i) => {
    const y = 1.2 + i * 1.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 9.1, h: 0.82,
      fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 0.06, h: 0.82,
      fill: { color: r.color }, line: { color: r.color }
    });
    s.addText(r.num, {
      x: 0.65, y, w: 0.6, h: 0.82,
      fontSize: 20, bold: true, color: r.color, align: "center", valign: "middle"
    });
    s.addText(r.label, {
      x: 1.35, y, w: 6.5, h: 0.82,
      fontSize: 16, bold: r.num !== "—", color: WHITE, align: "left", valign: "middle"
    });
    s.addText(r.time, {
      x: 7.9, y, w: 1.5, h: 0.82,
      fontSize: 14, color: r.color, bold: true, align: "right", valign: "middle"
    });
  });

  s.addText("Total: 3 hours 30 minutes", {
    x: 0.45, y: 5.1, w: 9.1, h: 0.35,
    fontSize: 12, color: GRAY, align: "right"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — PREREQUISITES
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Before We Start", GREEN);

  const items = [
    { icon: "✓", text: "GitHub account with repository access" },
    { icon: "✓", text: "GitHub CLI (gh) installed and authenticated" },
    { icon: "✓", text: "Git configured locally" },
  ];

  items.forEach((item, i) => {
    const y = 1.15 + i * 0.88;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 9.1, h: 0.7,
      fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
    });
    s.addShape(pres.shapes.OVAL, {
      x: 0.65, y: y + 0.17, w: 0.36, h: 0.36,
      fill: { color: GREEN }, line: { color: GREEN }
    });
    s.addText(item.icon, {
      x: 0.65, y: y + 0.17, w: 0.36, h: 0.36,
      fontSize: 12, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(item.text, {
      x: 1.18, y, w: 8.1, h: 0.7,
      fontSize: 15, color: GRAY_LIGHT, align: "left", valign: "middle"
    });
  });

  // Code block
  addCode(s, "gh auth status && git --version && gh --version", 0.45, 3.82, 9.1, 0.52, 12);

  s.addText("Full setup guide  →  START-HERE.md", {
    x: 0.45, y: 4.55, w: 9.1, h: 0.35,
    fontSize: 12, color: GRAY, align: "left",
    italic: true
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 1 DIVIDER
// ══════════════════════════════════════════════════════════════════════════════
addDivider(1, "GitHub Collaboration", "& CI Flow", "60 minutes", GREEN);

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — LOGIN, CLONE & FORK WITH gh
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Login, Clone & Fork with gh", GREEN);

  s.addText("First five minutes on a new machine — without ever opening a browser", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.32,
    fontSize: 12, color: GRAY, italic: true
  });

  // Left card — Auth
  addCard(s, 0.45, 1.42, 4.5, 3.9, BLUE);
  s.addText("1 · Authenticate", {
    x: 0.65, y: 1.5, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: BLUE
  });
  addCode(s,
    `gh auth login\n# choose: GitHub.com\n# protocol: HTTPS\n# auth: web browser\n\ngh auth status\ngh auth refresh -s read:org`,
    0.6, 1.88, 4.2, 2.05, 10.5
  );
  const authItems = [
    "Stores token in OS keychain",
    "Configures git credential helper",
    "Use -s to add scopes (org, gist, etc.)",
  ];
  s.addText(authItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < authItems.length - 1, color: GRAY_LIGHT, fontSize: 11 }
  })), { x: 0.65, y: 4.05, w: 4.1, h: 1.2 });

  // Right card — Clone & Fork
  addCard(s, 5.1, 1.42, 4.5, 3.9, GREEN);
  s.addText("2 · Clone & Fork", {
    x: 5.3, y: 1.5, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: GREEN
  });
  addCode(s,
    `# Clone (you have write access)\ngh repo clone owner/repo\n\n# Fork + clone + set upstream\ngh repo fork owner/repo --clone\n\n# Sync your fork later\ngh repo sync owner/repo`,
    5.25, 1.88, 4.2, 2.45, 10.5
  );
  const cloneItems = [
    "fork --clone sets upstream remote automatically",
    "repo sync pulls in changes from upstream",
  ];
  s.addText(cloneItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < cloneItems.length - 1, color: GRAY_LIGHT, fontSize: 11 }
  })), { x: 5.3, y: 4.45, w: 4.1, h: 0.85 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — GITLAB → GITHUB MAPPING
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "GitLab → GitHub: Same Concepts, New Names", GREEN);

  const rows = [
    ["Merge Request (MR)",       "Pull Request (PR)"],
    [".gitlab-ci.yml",           ".github/workflows/*.yml"],
    ["Pipeline",                 "Workflow / Actions"],
    ["Runner",                   "Runner"],
    ["Protected Branch",         "Branch Protection Rule"],
    ["CODEOWNERS",               "CODEOWNERS"],
    ["Group / Project",          "Organization / Repository"],
    ["CI/CD Variables (masked)", "Secrets  ${{ secrets.NAME }}"],
    ["CI/CD Variables (plain)",  "Variables  ${{ vars.NAME }}"],
  ];

  // Header row
  ["GitLab", "GitHub"].forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45 + i * 4.6, y: 1.05, w: 4.5, h: 0.38,
      fill: { color: i === 0 ? "E24329" : "24292F" }, line: { color: BG }
    });
    s.addText(h, {
      x: 0.45 + i * 4.6, y: 1.05, w: 4.5, h: 0.38,
      fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0
    });
  });

  rows.forEach((row, i) => {
    const y = 1.43 + i * 0.43;
    const bg = i % 2 === 0 ? BG_CARD : BG_LIGHT;
    row.forEach((cell, j) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.45 + j * 4.6, y, w: 4.5, h: 0.41,
        fill: { color: bg }, line: { color: BG }
      });
      s.addText(cell, {
        x: 0.55 + j * 4.6, y, w: 4.3, h: 0.41,
        fontSize: 11.5, color: j === 0 ? GRAY_LIGHT : GREEN,
        fontFace: cell.includes("{{") || cell.includes(".yml") || cell.includes("CODEOWNERS") ? "Consolas" : "Calibri",
        align: "left", valign: "middle"
      });
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — PR LIFECYCLE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Pull Request Lifecycle", GREEN);

  const steps = [
    { label: "Branch",        sub: "git checkout -b\nfeature/my-change",  color: GREEN },
    { label: "Push",          sub: "git push -u origin\nfeature/my-change", color: GREEN },
    { label: "Open PR",       sub: "gh pr create\nor UI",                 color: BLUE },
    { label: "Review",        sub: "Comments,\nsuggestions",              color: BLUE },
    { label: "Approve",       sub: "gh pr review\n--approve",             color: PURPLE },
    { label: "Merge",         sub: "Squash /\nRebase / Merge",            color: PURPLE },
    { label: "Delete Branch", sub: "Auto or\nmanual",                     color: ORANGE },
  ];

  const boxW = 1.18, boxH = 0.7, startX = 0.35, y = 1.15, arrowY = y + boxH / 2 - 0.03;

  steps.forEach((step, i) => {
    const x = startX + i * (boxW + 0.2);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: boxW, h: boxH,
      fill: { color: BG_CARD }, line: { color: step.color, pt: 1.5 }
    });
    s.addText(step.label, {
      x, y, w: boxW, h: boxH,
      fontSize: 10.5, bold: true, color: step.color, align: "center", valign: "middle"
    });
    // Arrow
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: x + boxW, y: arrowY, w: 0.2, h: 0,
        line: { color: GRAY, width: 1.5 }
      });
    }
  });

  // Sub-labels below each step
  steps.forEach((step, i) => {
    const x = startX + i * (boxW + 0.2);
    addCode(s, step.sub, x, y + boxH + 0.12, boxW, 0.78, 8.5);
  });

  // Key rules
  const rules = [
    "Direct pushes to main are blocked",
    "At least 1 approval required",
    "All CI checks must pass before merge",
  ];
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 3.9, w: 9.3, h: 1.42,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  s.addText("Branch Protection Enforces:", {
    x: 0.55, y: 3.97, w: 4, h: 0.3,
    fontSize: 11, bold: true, color: GREEN
  });
  s.addText(rules.map(r => ({ text: r, options: { bullet: true, breakLine: true, color: GRAY_LIGHT } })), {
    x: 0.55, y: 4.27, w: 9, h: 0.9,
    fontSize: 11, color: GRAY_LIGHT
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — DRAFT PRs & PR TEMPLATES
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Draft PRs & PR Templates", GREEN);

  // Left card — Draft PRs
  addCard(s, 0.45, 1.1, 4.5, 4.2, BLUE);
  s.addText("Draft PRs", {
    x: 0.65, y: 1.18, w: 4.1, h: 0.4,
    fontSize: 15, bold: true, color: BLUE
  });
  const draftItems = [
    "Signals: not ready for review",
    "Reviewers not notified until ready",
    "gh pr create --draft",
    "gh pr ready  (when done)",
    "Use for: WIP, early feedback, CI-first",
  ];
  s.addText(draftItems.map((t, i) => ({
    text: t,
    options: {
      bullet: true, breakLine: i < draftItems.length - 1,
      color: t.startsWith("gh") ? GREEN : GRAY_LIGHT,
      fontFace: t.startsWith("gh") ? "Consolas" : "Calibri",
      fontSize: 12
    }
  })), { x: 0.65, y: 1.65, w: 4.1, h: 3.4 });

  // Right card — PR Templates
  addCard(s, 5.1, 1.1, 4.5, 4.2, GREEN);
  s.addText("PR Templates", {
    x: 5.3, y: 1.18, w: 4.1, h: 0.4,
    fontSize: 15, bold: true, color: GREEN
  });
  s.addText(".github/PULL_REQUEST_TEMPLATE.md", {
    x: 5.3, y: 1.6, w: 4.1, h: 0.28,
    fontSize: 9.5, color: GRAY, fontFace: "Consolas"
  });
  const tplItems = [
    "Auto-populates the PR body",
    "Sections: Summary · Changes · Type · Testing · Checklist",
    "Enforces team standards on every PR",
    "Rule: Write WHY, not what — the diff shows what",
  ];
  s.addText(tplItems.map((t, i) => ({
    text: t,
    options: { bullet: true, breakLine: i < tplItems.length - 1, color: GRAY_LIGHT, fontSize: 12 }
  })), { x: 5.3, y: 1.95, w: 4.1, h: 3.1 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — GH CLI DAILY WORKFLOWS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "GitHub CLI — Your Daily Driver", BLUE);

  const leftCmds = [
    "gh pr create",
    "gh pr list --assignee @me",
    "gh pr checkout 42",
    "gh pr review --approve",
    "gh pr merge --squash --delete-branch",
    "gh pr checks --watch",
  ];

  const rightCmds = [
    "gh run list --status failure",
    "gh run view --log-failed",
    "gh run rerun --failed --debug",
    "gh run download",
    "gh secret set MY_SECRET",
    "gh repo clone owner/repo",
  ];

  // Left panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.05, w: 4.5, h: 0.38,
    fill: { color: BLUE }, line: { color: BLUE }
  });
  s.addText("Pull Requests", {
    x: 0.45, y: 1.05, w: 4.5, h: 0.38,
    fontSize: 13, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
  });
  addCode(s, leftCmds.join("\n"), 0.45, 1.43, 4.5, 3.85, 11.5);

  // Right panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.05, w: 4.5, h: 0.38,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  s.addText("Operations", {
    x: 5.1, y: 1.05, w: 4.5, h: 0.38,
    fontSize: 13, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
  });
  addCode(s, rightCmds.join("\n"), 5.1, 1.43, 4.5, 3.85, 11.5);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — BRANCH PROTECTION
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Branch Protection Rules", GREEN);

  s.addText("Enforce your standards automatically — no discipline required", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.35,
    fontSize: 13, color: GRAY, italic: true
  });

  const rules = [
    "Require pull request before merging",
    "Required approvals: 1+",
    "Dismiss stale reviews when new commits are pushed",
    "Require status checks to pass  (CI must be green)",
    "Require branches to be up to date before merging",
    "Block force pushes",
    "Restrict deletions",
  ];

  rules.forEach((rule, i) => {
    const y = 1.48 + i * 0.52;
    s.addShape(pres.shapes.OVAL, {
      x: 0.45, y: y + 0.09, w: 0.32, h: 0.32,
      fill: { color: GREEN }, line: { color: GREEN }
    });
    s.addText("✓", {
      x: 0.45, y: y + 0.09, w: 0.32, h: 0.32,
      fontSize: 11, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(rule, {
      x: 0.92, y, w: 8.5, h: 0.5,
      fontSize: 13.5, color: GRAY_LIGHT, valign: "middle"
    });
  });

  s.addText("Settings  →  Branches  →  Add branch protection rule", {
    x: 0.45, y: 5.2, w: 9.1, h: 0.3,
    fontSize: 11, color: GRAY, italic: true, align: "right"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — REPOSITORY LIFECYCLE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Repository Lifecycle", GREEN);

  const sections = [
    {
      title: "CODEOWNERS",
      color: GREEN,
      content: "* → @org/platform-team\nsrc/ → @org/dev-leads\n.github/workflows/ → @org/platform-team",
      isCode: true
    },
    {
      title: "Merge Controls",
      color: BLUE,
      content: "Enable: Squash merge only\nAuto-delete head branches: ON\nAuto-merge: available per PR",
      isCode: false
    },
    {
      title: "Metadata",
      color: PURPLE,
      content: "Description + Topics → discoverability\nEnable only features you use\nDefault branch: main",
      isCode: false
    },
  ];

  sections.forEach((sec, i) => {
    const x = 0.45 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.08, w: 3.0, h: 4.25,
      fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.08, w: 3.0, h: 0.42,
      fill: { color: sec.color }, line: { color: sec.color }
    });
    s.addText(sec.title, {
      x, y: 1.08, w: 3.0, h: 0.42,
      fontSize: 13, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    if (sec.isCode) {
      addCode(s, sec.content, x + 0.1, 1.6, 2.8, 2.5, 10);
    } else {
      const lines = sec.content.split("\n");
      s.addText(lines.map((l, j) => ({
        text: l,
        options: { bullet: true, breakLine: j < lines.length - 1, color: GRAY_LIGHT, fontSize: 11.5 }
      })), { x: x + 0.12, y: 1.62, w: 2.76, h: 2.6 });
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — QUICK UI FLOWS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "GitHub UI — Power Shortcuts", BLUE);

  const shortcuts = [
    { action: "Fuzzy file finder",       how: "Press  T  in any repo" },
    { action: "Jump to line",            how: "Press  L  when viewing a file" },
    { action: "Blame view",              how: "Press  B  or click Blame" },
    { action: "Permanent link (SHA)",    how: "Press  Y  to convert URL" },
    { action: "Keyboard shortcut list",  how: "Press  ?  on any page" },
    { action: "VS Code in browser",      how: "Press  .  (period) in any repo" },
    { action: "Compare branches",        how: "/compare/main...my-branch in URL" },
    { action: "Inline code suggestion",  how: "± icon in a review comment" },
  ];

  // Header
  ["Action", "Shortcut / How"].forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45 + i * 5.0, y: 1.05, w: i === 0 ? 4.9 : 4.65, h: 0.38,
      fill: { color: BG_LIGHT }, line: { color: BG }
    });
    s.addText(h, {
      x: 0.55 + i * 5.0, y: 1.05, w: i === 0 ? 4.9 : 4.65, h: 0.38,
      fontSize: 12, bold: true, color: BLUE, valign: "middle"
    });
  });

  shortcuts.forEach((row, i) => {
    const y = 1.43 + i * 0.5;
    const bg = i % 2 === 0 ? BG_CARD : BG_LIGHT;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 4.9, h: 0.48,
      fill: { color: bg }, line: { color: BG }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.45, y, w: 4.65, h: 0.48,
      fill: { color: bg }, line: { color: BG }
    });
    s.addText(row.action, {
      x: 0.6, y, w: 4.7, h: 0.48,
      fontSize: 12, color: GRAY_LIGHT, valign: "middle"
    });
    s.addText(row.how, {
      x: 5.55, y, w: 4.45, h: 0.48,
      fontSize: 12, color: GREEN, fontFace: "Consolas", valign: "middle"
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — MODULE 1 EXERCISE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  s.addText("HANDS-ON", {
    x: 0.45, y: 0.2, w: 9.1, h: 0.35,
    fontSize: 11, bold: true, color: GREEN, charSpacing: 5
  });
  s.addText("Module 1 Exercise", {
    x: 0.45, y: 0.55, w: 9.1, h: 0.75,
    fontSize: 34, bold: true, color: WHITE
  });
  s.addText("Build a complete PR workflow from scratch", {
    x: 0.45, y: 1.3, w: 9.1, h: 0.38,
    fontSize: 16, color: GRAY_LIGHT, italic: true
  });

  const steps = [
    "Create a feature branch",
    "Add greet() function to src/app.py",
    "Open a PR — fill in the template properly (WHY, not what)",
    "Request a review from your partner",
    "Review their PR — leave at least one comment",
    "Approve and merge:  gh pr merge --squash --delete-branch",
  ];

  steps.forEach((step, i) => {
    const y = 1.85 + i * 0.52;
    s.addShape(pres.shapes.OVAL, {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fill: { color: GREEN }, line: { color: GREEN }
    });
    s.addText(String(i + 1), {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fontSize: 12, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(step, {
      x: 0.95, y, w: 8.6, h: 0.5,
      fontSize: 13, color: step.includes("gh pr") ? GREEN : GRAY_LIGHT,
      fontFace: step.includes("gh pr") ? "Consolas" : "Calibri",
      valign: "middle"
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.1, w: 9.1, h: 0.35,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  s.addText("⏱ ~25 min   |   modules/01-github-collaboration/exercises/exercise.md", {
    x: 0.55, y: 5.1, w: 9.0, h: 0.35,
    fontSize: 11, color: GRAY, valign: "middle"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 2 DIVIDER
// ══════════════════════════════════════════════════════════════════════════════
addDivider(2, "GitHub Actions", "Deep Dive", "80 minutes", BLUE);

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — JENKINS VS GITHUB ACTIONS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Jenkins → GitHub Actions", BLUE);

  const rows = [
    ["Jenkinsfile",              ".github/workflows/*.yml"],
    ["pipeline {}",             "workflow file"],
    ["stage('Build')",          "jobs: build:"],
    ["steps { sh '...' }",      "steps: - run: ..."],
    ["agent { label 'linux' }", "runs-on: [self-hosted, linux]"],
    ["withCredentials([...])",  "secrets.MY_SECRET"],
    ["when { branch 'main' }",  "if: github.ref == 'refs/heads/main'"],
    ["parallel {}",             "jobs without needs: (parallel by default)"],
    ["post { always {} }",      "if: always()"],
    ["Shared Library",          "Reusable Workflow / Composite Action"],
  ];

  ["Jenkinsfile", "GitHub Actions"].forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45 + i * 4.6, y: 1.05, w: 4.5, h: 0.38,
      fill: { color: i === 0 ? "4A90D9" : "238636" }, line: { color: BG }
    });
    s.addText(h, {
      x: 0.45 + i * 4.6, y: 1.05, w: 4.5, h: 0.38,
      fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0
    });
  });

  rows.forEach((row, i) => {
    const y = 1.43 + i * 0.42;
    const bg = i % 2 === 0 ? BG_CARD : BG_LIGHT;
    row.forEach((cell, j) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.45 + j * 4.6, y, w: 4.5, h: 0.4,
        fill: { color: bg }, line: { color: BG }
      });
      s.addText(cell, {
        x: 0.58 + j * 4.6, y, w: 4.25, h: 0.4,
        fontSize: 10.5, fontFace: "Consolas",
        color: j === 0 ? GRAY_LIGHT : GREEN,
        align: "left", valign: "middle"
      });
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 15 — CORE CONCEPTS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "GitHub Actions — Core Concepts", BLUE);

  // Annotated YAML
  const yamlLines = [
    { text: "name: CI", color: WHITE },
    { text: "on:                    ", color: ORANGE },
    { text: "  push:", color: GRAY_LIGHT },
    { text: "    branches: [main]", color: GREEN },
    { text: "jobs:                  ", color: PURPLE },
    { text: "  build:", color: GRAY_LIGHT },
    { text: "    runs-on: ubuntu-latest    ", color: BLUE },
    { text: "    steps:", color: GRAY_LIGHT },
    { text: "      - uses: actions/checkout@v4    ", color: GREEN },
    { text: "      - run: pytest src/             ", color: WHITE },
  ];

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.05, w: 5.8, h: 4.25,
    fill: { color: "010409" }, line: { color: "30363D", pt: 1 }
  });

  yamlLines.forEach((line, i) => {
    s.addText(line.text, {
      x: 0.65, y: 1.18 + i * 0.4, w: 5.4, h: 0.38,
      fontSize: 11, fontFace: "Consolas", color: line.color, valign: "middle"
    });
  });

  // Annotations on right
  const annotations = [
    { label: "TRIGGER",   sub: "push, PR, schedule, manual", color: ORANGE,   y: 1.45 },
    { label: "JOBS",      sub: "parallel by default",         color: PURPLE,   y: 2.65 },
    { label: "RUNNER",    sub: "where the job runs",          color: BLUE,     y: 3.45 },
    { label: "ACTION",    sub: "pre-built, from Marketplace", color: GREEN,    y: 4.25 },
    { label: "COMMAND",   sub: "any shell script",            color: WHITE,    y: 4.65 },
  ];

  annotations.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.5, y: a.y, w: 3.1, h: 0.58,
      fill: { color: BG_CARD }, line: { color: a.color, pt: 1 }
    });
    s.addText(a.label, {
      x: 6.65, y: a.y + 0.04, w: 2.8, h: 0.26,
      fontSize: 10, bold: true, color: a.color
    });
    s.addText(a.sub, {
      x: 6.65, y: a.y + 0.28, w: 2.8, h: 0.24,
      fontSize: 9.5, color: GRAY
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 16 — SECRETS, VARIABLES & ENVIRONMENTS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Secrets, Variables & Environments", BLUE);

  const cols = [
    {
      title: "Secrets",
      badge: "${{ secrets.NAME }}",
      color: ORANGE,
      items: ["Encrypted, masked in logs", "Passwords, tokens, API keys", "Scope: Org → Repo → Environment"]
    },
    {
      title: "Variables",
      badge: "${{ vars.NAME }}",
      color: BLUE,
      items: ["Plain text, visible in logs", "Non-sensitive config (URLs, regions)", "Scope: Org → Repo → Environment"]
    },
    {
      title: "Environments",
      badge: "staging / production",
      color: GREEN,
      items: ["Named deployment targets", "Required reviewers = approval gate", "Replaces Jenkins manual approval"]
    },
  ];

  cols.forEach((col, i) => {
    const x = 0.45 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.08, w: 3.0, h: 4.25,
      fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.08, w: 3.0, h: 0.42,
      fill: { color: col.color }, line: { color: col.color }
    });
    s.addText(col.title, {
      x, y: 1.08, w: 3.0, h: 0.42,
      fontSize: 14, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(col.badge, {
      x: x + 0.1, y: 1.6, w: 2.8, h: 0.34,
      fontSize: 9.5, fontFace: "Consolas", color: col.color, align: "center"
    });
    s.addText(col.items.map((item, j) => ({
      text: item,
      options: { bullet: true, breakLine: j < col.items.length - 1, color: GRAY_LIGHT, fontSize: 12 }
    })), { x: x + 0.12, y: 2.05, w: 2.76, h: 2.8 });
  });

  s.addText("More specific scope overrides broader — Environment > Repository > Organization", {
    x: 0.45, y: 5.2, w: 9.1, h: 0.28,
    fontSize: 10.5, color: GRAY, italic: true, align: "center"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — ENVIRONMENTS: APPROVALS & PROTECTION RULES
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Environments — Approvals & Protection Rules", BLUE);

  s.addText("Native replacement for Jenkins manual-approval plugins — gates, reviewers, and scoped secrets", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.32,
    fontSize: 12, color: GRAY, italic: true
  });

  // Left — Protection rules list
  addCard(s, 0.45, 1.42, 4.5, 3.9, ORANGE);
  s.addText("Protection Rules", {
    x: 0.65, y: 1.5, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: ORANGE
  });
  const rules = [
    "Required reviewers (up to 6)",
    "Wait timer before deploy",
    "Allowed deployment branches",
    "Environment-scoped secrets & vars",
    "Custom protection rules (Apps)",
    "Deployment history & rollback",
  ];
  rules.forEach((r, i) => {
    const y = 1.88 + i * 0.52;
    s.addShape(pres.shapes.OVAL, {
      x: 0.65, y: y + 0.08, w: 0.28, h: 0.28,
      fill: { color: ORANGE }, line: { color: ORANGE }
    });
    s.addText("✓", {
      x: 0.65, y: y + 0.08, w: 0.28, h: 0.28,
      fontSize: 10, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(r, {
      x: 1.05, y, w: 3.7, h: 0.45,
      fontSize: 11.5, color: GRAY_LIGHT, valign: "middle"
    });
  });

  // Right — YAML usage
  addCode(s,
    `jobs:\n  deploy-prod:\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://app.example.com\n    steps:\n      - run: ./deploy.sh\n        env:\n          API_KEY: \${{ secrets.PROD_API_KEY }}`,
    5.1, 1.42, 4.5, 3.0, 10.5
  );
  s.addText("Settings → Environments → New environment", {
    x: 5.1, y: 4.55, w: 4.5, h: 0.3,
    fontSize: 11, color: GRAY, italic: true
  });
  s.addText("Job pauses on Reviewers gate until approved in UI", {
    x: 5.1, y: 4.88, w: 4.5, h: 0.3,
    fontSize: 11, color: GREEN
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 17 — JOB ORCHESTRATION
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Job Orchestration", BLUE);

  // Dependency graph (left side)
  const nodes = [
    { label: "lint",   x: 0.55, y: 1.85, color: GREEN },
    { label: "test",   x: 0.55, y: 2.75, color: GREEN },
    { label: "build",  x: 2.5,  y: 2.28, color: BLUE },
    { label: "deploy", x: 4.45, y: 2.28, color: ORANGE },
    { label: "notify", x: 4.45, y: 3.5,  color: GRAY },
  ];

  nodes.forEach(n => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: n.x, y: n.y, w: 1.7, h: 0.52,
      fill: { color: BG_CARD }, line: { color: n.color, pt: 1.5 }
    });
    s.addText(n.label, {
      x: n.x, y: n.y, w: 1.7, h: 0.52,
      fontSize: 12, bold: true, color: n.color, align: "center", valign: "middle"
    });
  });

  // Arrows (lines)
  const arrows = [
    { x: 2.25, y: 2.11, w: 0.25, h: 0 },  // lint → build
    { x: 2.25, y: 3.01, w: 0.25, h: 0 },  // test → build
    { x: 4.2,  y: 2.54, w: 0.25, h: 0 },  // build → deploy
    { x: 4.75, y: 2.8,  w: 0,    h: 0.7 }, // build → notify (vertical)
  ];
  arrows.forEach(a => {
    s.addShape(pres.shapes.LINE, {
      x: a.x, y: a.y, w: a.w, h: a.h,
      line: { color: GRAY, width: 1.5 }
    });
  });

  s.addText("main only", {
    x: 4.45, y: 1.95, w: 1.7, h: 0.28,
    fontSize: 9, color: ORANGE, italic: true, align: "center"
  });
  s.addText("on failure", {
    x: 4.45, y: 4.05, w: 1.7, h: 0.28,
    fontSize: 9, color: GRAY, italic: true, align: "center"
  });

  // Key patterns (right side)
  const patterns = [
    { code: "needs: [lint, test]",                    desc: "sequential" },
    { code: "(no needs:)",                             desc: "parallel by default" },
    { code: "if: github.ref == 'refs/heads/main'",    desc: "conditional" },
    { code: "if: failure()",                           desc: "on failure only" },
    { code: "if: always()",                            desc: "always runs" },
    { code: "strategy: matrix:",                       desc: "parallel variants" },
    { code: "concurrency: cancel-in-progress: true",  desc: "cancel stale runs" },
  ];

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.35, y: 1.08, w: 3.2, h: 4.3,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });

  patterns.forEach((p, i) => {
    const y = 1.2 + i * 0.58;
    s.addText(p.code, {
      x: 6.5, y, w: 2.9, h: 0.28,
      fontSize: 9.5, fontFace: "Consolas", color: GREEN
    });
    s.addText("→  " + p.desc, {
      x: 6.5, y: y + 0.28, w: 2.9, h: 0.24,
      fontSize: 9.5, color: GRAY
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — PASSING DATA BETWEEN STEPS & JOBS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Passing Data Between Steps & Jobs", BLUE);

  s.addText("Each job is a fresh VM — pick the right channel for the data you're moving", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.3,
    fontSize: 12, color: GRAY, italic: true
  });

  // Mechanism table header
  const headers = [{ label: "Mechanism", w: 2.4 }, { label: "Scope", w: 1.7 }, { label: "Use For", w: 5.0 }];
  let hx = 0.45;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: hx, y: 1.38, w: h.w, h: 0.36,
      fill: { color: BG_LIGHT }, line: { color: BG }
    });
    s.addText(h.label, {
      x: hx + 0.1, y: 1.38, w: h.w - 0.1, h: 0.36,
      fontSize: 11, bold: true, color: BLUE, valign: "middle"
    });
    hx += h.w;
  });

  const mechs = [
    { name: "$GITHUB_OUTPUT",   scope: "step → step",  use: "Named values referenced by step id (small)",  color: GREEN },
    { name: "$GITHUB_ENV",      scope: "step → step",  use: "Env vars for all later steps in the job",     color: GREEN },
    { name: "env: at job/step", scope: "static",       use: "Constants known at workflow author time",     color: GRAY_LIGHT },
    { name: "jobs.<j>.outputs", scope: "job → job",    use: "Small strings between dependent jobs (needs)", color: PURPLE },
    { name: "actions/cache",    scope: "run → run",    use: "Reusable deps (pip / npm / gradle) across runs", color: ORANGE },
    { name: "upload/download-artifact", scope: "job → job / run", use: "Files: builds, test reports, coverage", color: ORANGE },
  ];
  mechs.forEach((m, i) => {
    const y = 1.74 + i * 0.42;
    const bg = i % 2 === 0 ? BG_CARD : BG_LIGHT;
    let x = 0.45;
    [
      { w: 2.4, text: m.name, color: m.color, code: true },
      { w: 1.7, text: m.scope, color: GRAY,  code: false },
      { w: 5.0, text: m.use,   color: GRAY_LIGHT, code: false },
    ].forEach(c => {
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: c.w, h: 0.4,
        fill: { color: bg }, line: { color: BG }
      });
      s.addText(c.text, {
        x: x + 0.1, y, w: c.w - 0.12, h: 0.4,
        fontSize: 10.5, color: c.color,
        fontFace: c.code ? "Consolas" : "Calibri",
        valign: "middle"
      });
      x += c.w;
    });
  });

  // Bottom code samples — outputs + artifact handoff
  addCode(s,
    `# step output\n- id: ver\n  run: echo "tag=v1.2.\${{ github.run_number }}" >> $GITHUB_OUTPUT\n- run: echo "\${{ steps.ver.outputs.tag }}"`,
    0.45, 4.32, 4.5, 1.0, 9.5
  );
  addCode(s,
    `# job output → next job\noutputs:\n  tag: \${{ steps.ver.outputs.tag }}\nbuild:\n  needs: prepare\n  steps: [run: echo \${{ needs.prepare.outputs.tag }}]`,
    5.1, 4.32, 4.5, 1.0, 9.5
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 18 — REUSABLE WORKFLOWS & COMPOSITE ACTIONS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Reusable Workflows & Composite Actions", BLUE);

  // Left card
  addCard(s, 0.45, 1.08, 4.5, 2.7, PURPLE);
  s.addText("Reusable Workflow", {
    x: 0.65, y: 1.16, w: 4.1, h: 0.38,
    fontSize: 14, bold: true, color: PURPLE
  });
  s.addText("workflow_call", {
    x: 0.65, y: 1.55, w: 2.2, h: 0.28,
    fontSize: 10, fontFace: "Consolas", color: GRAY
  });
  const rwItems = [
    "A full workflow called from another workflow",
    "Has its own runner and jobs",
    "Pass inputs, secrets, get outputs",
    "Best for: shared deploy / release pipelines",
  ];
  s.addText(rwItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < rwItems.length - 1, color: GRAY_LIGHT, fontSize: 11.5 }
  })), { x: 0.65, y: 1.88, w: 4.1, h: 1.7 });

  // Right card
  addCard(s, 5.1, 1.08, 4.5, 2.7, GREEN);
  s.addText("Composite Action", {
    x: 5.3, y: 1.16, w: 4.1, h: 0.38,
    fontSize: 14, bold: true, color: GREEN
  });
  s.addText("action.yml", {
    x: 5.3, y: 1.55, w: 2.2, h: 0.28,
    fontSize: 10, fontFace: "Consolas", color: GRAY
  });
  const caItems = [
    "Steps packaged as a single uses: call",
    "Runs on the caller's runner",
    "Best for: shared setup (install, cache, auth)",
  ];
  s.addText(caItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < caItems.length - 1, color: GRAY_LIGHT, fontSize: 11.5 }
  })), { x: 5.3, y: 1.88, w: 4.1, h: 1.7 });

  // Code example bottom
  addCode(s,
    `jobs:\n  deploy:\n    uses: ./.github/workflows/deploy.yml\n    with:\n      environment: staging\n    secrets: inherit`,
    0.45, 3.95, 9.1, 1.38, 11.5
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — PERFORMANCE & SCALE: CACHING & MATRIX
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Performance & Scale — Caching & Matrix", BLUE);

  s.addText("Two levers that pay off on every run: cache dependencies, parallelize across versions", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.3,
    fontSize: 12, color: GRAY, italic: true
  });

  // Left — Caching
  addCard(s, 0.45, 1.4, 4.5, 3.92, GREEN);
  s.addText("Built-in cache via setup-*", {
    x: 0.65, y: 1.48, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: GREEN
  });
  addCode(s,
    `- uses: actions/setup-node@v4\n  with:\n    node-version: '20'\n    cache: 'yarn'\n    cache-dependency-path: yarn.lock\n\n- uses: actions/setup-python@v5\n  with:\n    python-version: '3.12'\n    cache: 'pip'`,
    0.6, 1.85, 4.2, 2.1, 9.5
  );
  const cacheItems = [
    "One line — keys & paths handled for you",
    "Works for: npm, yarn, pnpm, pip, gradle, maven",
    "Drop to actions/cache@v4 only for custom paths",
  ];
  s.addText(cacheItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < cacheItems.length - 1, color: GRAY_LIGHT, fontSize: 11 }
  })), { x: 0.65, y: 4.07, w: 4.1, h: 1.2 });

  // Right — Matrix
  addCard(s, 5.1, 1.4, 4.5, 3.92, BLUE);
  s.addText("strategy: matrix", {
    x: 5.3, y: 1.48, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: BLUE
  });
  addCode(s,
    `strategy:\n  fail-fast: false\n  matrix:\n    python: ['3.10', '3.11', '3.12']\n    os: [ubuntu-latest, windows-latest]\n    exclude:\n      - { os: windows-latest, python: '3.10' }`,
    5.25, 1.85, 4.2, 1.95, 9.5
  );
  const matrixItems = [
    "N parallel variants from one job definition",
    "fail-fast: false — let all variants finish",
    "include / exclude — fine-tune the combinations",
  ];
  s.addText(matrixItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < matrixItems.length - 1, color: GRAY_LIGHT, fontSize: 11 }
  })), { x: 5.3, y: 3.92, w: 4.1, h: 1.35 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — SECURITY BEST PRACTICES & SHA PINNING
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Security Best Practices & SHA Pinning", BLUE);

  s.addText("Tags can move, SHAs cannot — pin third-party actions and lock down permissions", {
    x: 0.45, y: 1.0, w: 9.1, h: 0.3,
    fontSize: 12, color: GRAY, italic: true
  });

  // Left — SHA pinning
  addCard(s, 0.45, 1.4, 4.5, 3.92, ORANGE);
  s.addText("SHA Pinning", {
    x: 0.65, y: 1.48, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: ORANGE
  });
  addCode(s,
    `# ❌ tag — can be moved\n- uses: actions/checkout@v4\n\n# ✅ pinned to immutable SHA\n- uses: actions/checkout@\\\n  11bd71901bbe5b1630ceea73d27597364c9af683\n  # v4.2.2`,
    0.6, 1.85, 4.2, 2.2, 9.5
  );
  s.addText("Use Dependabot to keep pinned SHAs up to date", {
    x: 0.65, y: 4.18, w: 4.1, h: 0.3,
    fontSize: 10.5, color: GRAY, italic: true
  });

  // Right — Hardening checklist
  addCard(s, 5.1, 1.4, 4.5, 3.92, GREEN);
  s.addText("Workflow Hardening", {
    x: 5.3, y: 1.48, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: GREEN
  });
  const sec = [
    { code: "permissions: contents: read", desc: "Minimal default token scope" },
    { code: "pull_request_target — avoid",  desc: "Runs with write token on forks" },
    { code: "secrets via env:",            desc: "Never inline in run: scripts" },
    { code: "OIDC → cloud",                desc: "No long-lived AWS / Azure keys" },
    { code: "CODEOWNERS .github/workflows", desc: "Workflow changes need review" },
    { code: "concurrency:",                desc: "Prevent overlapping deploys" },
  ];
  sec.forEach((item, i) => {
    const y = 1.88 + i * 0.55;
    s.addText(item.code, {
      x: 5.3, y, w: 4.1, h: 0.26,
      fontSize: 10, fontFace: "Consolas", color: GREEN
    });
    s.addText("→  " + item.desc, {
      x: 5.4, y: y + 0.26, w: 4.0, h: 0.24,
      fontSize: 10, color: GRAY_LIGHT
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 20 — RUNNERS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Runners — Where Your Jobs Execute", BLUE);

  const tableRows = [
    { label: "Setup",          gh: "Zero config",            self: "You manage" },
    { label: "Cost",           gh: "Per-minute billing",     self: "Your infra" },
    { label: "Isolation",      gh: "Fresh VM per job",       self: "Shared (configurable)" },
    { label: "Private network",gh: "No",                     self: "Yes" },
    { label: "Custom tools",   gh: "Install each run",       self: "Pre-installed" },
    { label: "Best for",       gh: "Standard CI",            self: "Large builds, private infra" },
  ];

  // Header
  [{ label: "", w: 2.8 }, { label: "GitHub-Hosted", w: 3.1 }, { label: "Self-Hosted", w: 3.6 }].forEach((h, i) => {
    const x = 0.45 + [0, 2.8, 5.9][i];
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: h.w, h: 0.42,
      fill: { color: i === 0 ? BG_LIGHT : i === 1 ? BLUE : GREEN },
      line: { color: BG }
    });
    s.addText(h.label, {
      x, y: 1.05, w: h.w, h: 0.42,
      fontSize: 13, bold: true, color: i === 0 ? WHITE : "000000",
      align: "center", valign: "middle", margin: 0
    });
  });

  tableRows.forEach((row, i) => {
    const y = 1.47 + i * 0.49;
    const bg = i % 2 === 0 ? BG_CARD : BG_LIGHT;
    const cells = [
      { x: 0.45, w: 2.8, text: row.label, color: GRAY_LIGHT, bold: true },
      { x: 3.25, w: 2.65, text: row.gh,   color: row.gh === "No" ? ORANGE : GRAY_LIGHT, bold: false },
      { x: 5.9,  w: 3.65, text: row.self, color: row.self === "Yes" ? GREEN : GRAY_LIGHT, bold: false },
    ];
    cells.forEach(c => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: c.x, y, w: c.w, h: 0.47,
        fill: { color: bg }, line: { color: BG }
      });
      s.addText(c.text, {
        x: c.x + 0.12, y, w: c.w - 0.14, h: 0.47,
        fontSize: 11.5, color: c.color, bold: c.bold, valign: "middle"
      });
    });
  });

  s.addText("Use self-hosted when: private network access · large Docker cache · specialized hardware (GPU) · cost at scale", {
    x: 0.45, y: 5.18, w: 9.1, h: 0.28,
    fontSize: 10.5, color: GRAY, italic: true
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 21 — MANUAL TRIGGERS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Manual Triggers — workflow_dispatch", BLUE);

  addCode(s,
    `on:\n  workflow_dispatch:\n    inputs:\n      environment:\n        type: choice\n        options: [staging, production]\n      dry-run:\n        type: boolean\n        default: true`,
    0.45, 1.08, 4.5, 2.8, 11
  );

  // Right: trigger methods
  addCard(s, 5.1, 1.08, 4.5, 2.8, BLUE);
  s.addText("Trigger from UI", {
    x: 5.3, y: 1.16, w: 4.1, h: 0.32, fontSize: 12, bold: true, color: BLUE
  });
  s.addText("Actions tab → select workflow → Run workflow", {
    x: 5.3, y: 1.5, w: 4.1, h: 0.32, fontSize: 11, color: GRAY_LIGHT
  });
  s.addText("Trigger from CLI", {
    x: 5.3, y: 2.0, w: 4.1, h: 0.32, fontSize: 12, bold: true, color: BLUE
  });
  addCode(s,
    `gh workflow run deploy.yml \\\n  --field environment=staging \\\n  --field dry-run=false`,
    5.25, 2.38, 4.2, 1.35, 10
  );

  // Use cases
  const usecases = ["On-demand deploy", "Hotfix release", "Database migration", "Manual smoke test"];
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 4.05, w: 9.1, h: 1.28,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  s.addText("Use cases:", {
    x: 0.65, y: 4.12, w: 2, h: 0.3,
    fontSize: 11, bold: true, color: BLUE
  });
  usecases.forEach((u, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.65 + i * 2.2, y: 4.5, w: 2.0, h: 0.68,
      fill: { color: BG_LIGHT }, line: { color: "30363D", pt: 1 }
    });
    s.addText(u, {
      x: 0.65 + i * 2.2, y: 4.5, w: 2.0, h: 0.68,
      fontSize: 11, color: GRAY_LIGHT, align: "center", valign: "middle"
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 22 — MODULE 2 EXERCISE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: BLUE }, line: { color: BLUE }
  });
  s.addText("HANDS-ON", {
    x: 0.45, y: 0.2, w: 9.1, h: 0.35,
    fontSize: 11, bold: true, color: BLUE, charSpacing: 5
  });
  s.addText("Module 2 Exercise", {
    x: 0.45, y: 0.55, w: 9.1, h: 0.75,
    fontSize: 34, bold: true, color: WHITE
  });
  s.addText("Build a complete CI workflow from scratch", {
    x: 0.45, y: 1.3, w: 9.1, h: 0.38,
    fontSize: 16, color: GRAY_LIGHT, italic: true
  });

  const steps = [
    "Create  .github/workflows/ci.yml",
    "Add lint job  (ruff check src/)",
    "Add test job with matrix  (Python 3.10, 3.11, 3.12)",
    "Add build job  —  needs: [lint, test]",
    "Add deploy-staging  —  only on main branch",
    "Push and watch PR checks enforce the gates",
    "Trigger manually:  gh workflow run ci.yml",
  ];

  steps.forEach((step, i) => {
    const y = 1.85 + i * 0.51;
    s.addShape(pres.shapes.OVAL, {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fill: { color: BLUE }, line: { color: BLUE }
    });
    s.addText(String(i + 1), {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0
    });
    s.addText(step, {
      x: 0.95, y, w: 8.6, h: 0.48,
      fontSize: 13,
      color: step.includes("gh workflow") || step.includes("needs:") ? BLUE : GRAY_LIGHT,
      fontFace: step.includes("gh workflow") || step.includes(".yml") ? "Consolas" : "Calibri",
      valign: "middle"
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.18, w: 9.1, h: 0.3,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  s.addText("⏱ ~30 min   |   modules/02-github-actions/exercises/exercise.md   |   Stuck? → solutions/02-ci-workflow/", {
    x: 0.55, y: 5.18, w: 9.0, h: 0.3,
    fontSize: 10, color: GRAY, valign: "middle"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 23 — BREAK
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("Break", {
    x: 0.5, y: 1.5, w: 9, h: 1.4,
    fontSize: 72, bold: true, color: WHITE, align: "center"
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 2.95, w: 3.0, h: 0.52,
    fill: { color: BG_LIGHT }, line: { color: "30363D", pt: 1 }
  });
  s.addText("10 minutes", {
    x: 3.5, y: 2.95, w: 3.0, h: 0.52,
    fontSize: 18, color: GRAY_LIGHT, align: "center", valign: "middle", margin: 0
  });
  s.addText("Grab coffee · Ask questions · Browse resources/cheatsheet.md", {
    x: 0.5, y: 4.1, w: 9, h: 0.38,
    fontSize: 13, color: GRAY, align: "center", italic: true
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE 3 DIVIDER
// ══════════════════════════════════════════════════════════════════════════════
addDivider(3, "Day-to-Day Operations", "& Debugging", "30 minutes", ORANGE);

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 25 — MONITORING & RE-RUNNING
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Monitoring Workflow Runs", ORANGE);

  // Left panel — UI
  addCard(s, 0.45, 1.08, 4.5, 4.25, ORANGE);
  s.addText("In the UI", { x: 0.65, y: 1.16, w: 4.1, h: 0.35, fontSize: 13, bold: true, color: ORANGE });
  const uiItems = [
    "Actions tab → filter by workflow, branch, status",
    "Click run → job graph with status indicators",
    "Click job → step logs with timestamps",
    "$GITHUB_STEP_SUMMARY → rich markdown on summary page",
  ];
  s.addText(uiItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < uiItems.length - 1, color: GRAY_LIGHT, fontSize: 11.5 }
  })), { x: 0.65, y: 1.6, w: 4.1, h: 1.6 });

  addCode(s,
    `# Re-run options\ngh run rerun <id> --failed\ngh run rerun <id> --failed --debug\ngh run cancel <id>`,
    0.6, 3.3, 4.2, 1.88, 10.5
  );

  // Right panel — CLI
  addCard(s, 5.1, 1.08, 4.5, 4.25, BLUE);
  s.addText("Via gh CLI", { x: 5.3, y: 1.16, w: 4.1, h: 0.35, fontSize: 13, bold: true, color: BLUE });
  addCode(s,
    `gh run list --workflow ci.yml\ngh run list --status failure\ngh run view <id>\ngh run view <id> --log-failed\ngh run view <id> --log\ngh run watch`,
    5.25, 1.6, 4.2, 3.58, 11
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 26 — ARTIFACTS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Artifacts — Persist & Share Build Outputs", ORANGE);

  addCode(s,
    `# Upload (in any job)\n- uses: actions/upload-artifact@v4\n  if: always()          # capture even on failure\n  with:\n    name: test-results\n    path: test-results.xml\n    retention-days: 30`,
    0.45, 1.08, 4.5, 2.32, 10.5
  );

  addCode(s,
    `# Download (in another job)\n- uses: actions/download-artifact@v4\n  with:\n    name: test-results\n    path: ./results\n\n# CLI\ngh run download <id> --name test-results`,
    0.45, 3.52, 4.5, 1.85, 10.5
  );

  // Key points right
  addCard(s, 5.1, 1.08, 4.5, 4.25, ORANGE);
  s.addText("Key Points", { x: 5.3, y: 1.16, w: 4.1, h: 0.35, fontSize: 13, bold: true, color: ORANGE });
  const kpItems = [
    "Each job gets a fresh VM — artifacts are the bridge between jobs",
    "if: always() — capture outputs even when tests fail",
    "Default retention: 90 days",
    "Use artifacts for: test results, dist/, logs, coverage reports",
  ];
  s.addText(kpItems.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < kpItems.length - 1, color: GRAY_LIGHT, fontSize: 12 }
  })), { x: 5.3, y: 1.65, w: 4.1, h: 3.5 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 27 — DEBUGGING
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Debugging Workflows", ORANGE);

  // Top: enable debug
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.05, w: 9.1, h: 0.32,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });
  s.addText("Enable Debug Logging", {
    x: 0.55, y: 1.05, w: 9.0, h: 0.32,
    fontSize: 12, bold: true, color: "000000", valign: "middle"
  });
  addCode(s,
    `gh secret set ACTIONS_STEP_DEBUG --body "true"    # verbose step output\ngh run rerun <id> --failed --debug                # or: per-run debug\ngh secret delete ACTIONS_STEP_DEBUG               # clean up after`,
    0.45, 1.37, 9.1, 0.88, 10.5
  );

  // Middle: common failures
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 2.42, w: 9.1, h: 0.32,
    fill: { color: BG_LIGHT }, line: { color: BG_LIGHT }
  });
  s.addText("Common Failure Patterns", {
    x: 0.55, y: 2.42, w: 9.0, h: 0.32,
    fontSize: 12, bold: true, color: ORANGE, valign: "middle"
  });
  const failures = [
    { cause: "Permission denied",      fix: "Add permissions: to the job" },
    { cause: "Secret empty",           fix: "Check name, scope, environment match" },
    { cause: "Job skipped",            fix: "Check if: — use refs/heads/main not main" },
    { cause: "Cache miss every time",  fix: "Check hashFiles() pattern matches your lockfile" },
  ];
  failures.forEach((f, i) => {
    const y = 2.82 + i * 0.44;
    s.addText(f.cause, { x: 0.55, y, w: 3.5, h: 0.4, fontSize: 11.5, color: ORANGE, valign: "middle", bold: true });
    s.addText("→  " + f.fix, { x: 4.1, y, w: 5.3, h: 0.4, fontSize: 11.5, color: GRAY_LIGHT, valign: "middle" });
  });

  // Bottom: annotations
  addCode(s,
    `echo "::notice::Deploy started"\necho "::warning::Approaching rate limit"\necho "::error file=src/app.py,line=10::Syntax error"\necho "::group::Logs" && cat build.log && echo "::endgroup::"`,
    0.45, 4.65, 9.1, 0.78, 10.5
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 28 — MODULE 3 EXERCISE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });
  s.addText("HANDS-ON", {
    x: 0.45, y: 0.2, w: 9.1, h: 0.35,
    fontSize: 11, bold: true, color: ORANGE, charSpacing: 5
  });
  s.addText("Module 3 Exercise", {
    x: 0.45, y: 0.55, w: 9.1, h: 0.75,
    fontSize: 34, bold: true, color: WHITE
  });
  s.addText("Trigger a failure, debug it, fix it, download artifacts", {
    x: 0.45, y: 1.3, w: 9.1, h: 0.38,
    fontSize: 16, color: GRAY_LIGHT, italic: true
  });

  const steps = [
    "Add an intentional failing test to src/test_app.py",
    "Push and open a PR — watch CI fail",
    "Identify failure:  gh run view --log-failed",
    "Enable debug:  gh secret set ACTIONS_STEP_DEBUG true",
    "Re-run:  gh run rerun --failed --debug",
    "Fix the test and push — watch all checks go green",
    "Download artifacts:  gh run download",
  ];

  steps.forEach((step, i) => {
    const y = 1.85 + i * 0.51;
    s.addShape(pres.shapes.OVAL, {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fill: { color: ORANGE }, line: { color: ORANGE }
    });
    s.addText(String(i + 1), {
      x: 0.45, y: y + 0.08, w: 0.34, h: 0.34,
      fontSize: 12, bold: true, color: "000000", align: "center", valign: "middle", margin: 0
    });
    s.addText(step, {
      x: 0.95, y, w: 8.6, h: 0.48,
      fontSize: 13,
      color: step.includes("gh ") ? ORANGE : GRAY_LIGHT,
      fontFace: step.includes("gh ") ? "Consolas" : "Calibri",
      valign: "middle"
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.18, w: 9.1, h: 0.3,
    fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
  });
  s.addText("⏱ ~15 min   |   modules/03-operations-debugging/exercises/exercise.md   |   Stuck? → solutions/03-debugging/", {
    x: 0.55, y: 5.18, w: 9.0, h: 0.3,
    fontSize: 10, color: GRAY, valign: "middle"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 29 — KEY TAKEAWAYS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addHeader(s, "Key Takeaways", GREEN);

  const groups = [
    {
      title: "Collaboration",
      color: GREEN,
      items: [
        "PRs are the unit of collaboration — use them for everything",
        "Branch protection + CODEOWNERS = automated code review standards",
        "gh CLI brings the full GitHub experience into your terminal",
      ]
    },
    {
      title: "Actions",
      color: BLUE,
      items: [
        "Your Jenkinsfile becomes a YAML workflow — same concepts, new syntax",
        "Jobs run in parallel by default; use needs: to sequence",
        "Environments replace Jenkins manual approvals — no plugin required",
      ]
    },
    {
      title: "Operations",
      color: ORANGE,
      items: [
        "gh run is your first debugging tool — faster than reading the UI",
        "ACTIONS_STEP_DEBUG reveals what normal logs hide",
        "if: always() + upload-artifact = never lose test results",
      ]
    },
  ];

  groups.forEach((g, i) => {
    const y = 1.1 + i * 1.48;
    addCard(s, 0.45, y, 9.1, 1.35, g.color);
    s.addText(g.title, {
      x: 0.65, y: y + 0.06, w: 9.0, h: 0.34,
      fontSize: 13, bold: true, color: g.color
    });
    s.addText(g.items.map((t, j) => ({
      text: t, options: { bullet: true, breakLine: j < g.items.length - 1, color: GRAY_LIGHT, fontSize: 12 }
    })), { x: 0.65, y: y + 0.42, w: 8.7, h: 0.88 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 30 — RESOURCES
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };

  s.addText("Resources & Next Steps", {
    x: 0.45, y: 0.28, w: 9.1, h: 0.65,
    fontSize: 30, bold: true, color: WHITE
  });

  // Workshop repo box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.1, w: 9.1, h: 1.15,
    fill: { color: BG_CARD }, line: { color: GREEN, pt: 1 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.1, w: 0.07, h: 1.15,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  s.addText("Workshop Repo", {
    x: 0.68, y: 1.17, w: 4, h: 0.3,
    fontSize: 12, bold: true, color: GREEN
  });
  s.addText("github.com/ShmuelMax100/github-workshop", {
    x: 0.68, y: 1.48, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Consolas", color: BLUE
  });
  s.addText("resources/cheatsheet.md  ·  All guides linked from README.md", {
    x: 0.68, y: 1.78, w: 8.5, h: 0.28,
    fontSize: 11, color: GRAY
  });

  // External links
  const links = [
    { label: "GitHub Docs",                   url: "docs.github.com",                         color: WHITE },
    { label: "Actions Marketplace",           url: "github.com/marketplace?type=actions",      color: WHITE },
    { label: "GitHub CLI Manual",             url: "cli.github.com/manual",                   color: WHITE },
    { label: "act — run Actions locally",     url: "github.com/nektos/act",                   color: WHITE },
  ];

  links.forEach((link, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.45 + col * 4.65, y = 2.55 + row * 0.88;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.45, h: 0.75,
      fill: { color: BG_CARD }, line: { color: BG_LIGHT, pt: 1 }
    });
    s.addText(link.label, {
      x: x + 0.15, y: y + 0.06, w: 4.1, h: 0.3,
      fontSize: 13, bold: true, color: link.color
    });
    s.addText(link.url, {
      x: x + 0.15, y: y + 0.38, w: 4.1, h: 0.28,
      fontSize: 11, fontFace: "Consolas", color: BLUE
    });
  });

  s.addText("Thank you  —  Questions?", {
    x: 0.45, y: 5.1, w: 9.1, h: 0.42,
    fontSize: 20, bold: true, color: WHITE, align: "center"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// WRITE FILE
// ══════════════════════════════════════════════════════════════════════════════
const outPath = "C:/Users/shmuelmax/OneDrive - Microsoft/Documents/Projects/github-workshop/GitHub-Workshop-SecuriThings.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("✅ Created: " + outPath))
  .catch(e => { console.error("❌ Error:", e); process.exit(1); });
