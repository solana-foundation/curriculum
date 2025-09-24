# Curriculum Maintenance Guide

This guide defines how the Solana Foundation curriculum is kept accurate, discoverable, and credible over time.

---

## 1) Quarterly Review (every Mar/Jun/Sep/Dec)

**Goal:** validate code, fix drift, refresh links, and publish a tagged release.

**Owners:** Curriculum Maintainers (@guibibeau @resourcefulmind)

**Checklist**
- [ ] **Tooling sanity:** `rustc --version`, `solana --version`, `anchor --version`
- [ ] **Run demos/workshops:** each course’s canonical demo builds, deploys (devnet or local), tests pass
- [ ] **Notes parity:** facilitator notes reflect current outputs & commands
- [ ] **Links:** run link checker CI; replace dead/outdated references
- [ ] **Feedback intake:** review last quarter’s survey results + GitHub issues labeled `feedback` or `quarterly-review`
- [ ] **Roadmap triage:** decide what ships now vs. next quarter
- [ ] **Tag release:** `vYYYY-QX` and update root README “Last reviewed” date and supported toolchain versions

**Release notes (CHANGELOG.md)**
- Breaking changes (commands, APIs)
- Updated materials (slides/notes/code)
- New/retired modules

---

## 2) Distribution & Ratings

**Discovery**
- List each course/workshop on the curriculum index/site with:
  - Title, 1-line pitch, duration, level
  - Slides link (Google Slides), code repo path, last reviewed date
  - Stable tag (e.g., `v2025-Q3`)

**Ratings & Feedback**
- After each delivery, facilitators share the **SURVEY.md** link (Google Form)
- Aggregate results each quarter; flag items <3/5 for priority fixes
- Create issues with label `feedback` referencing survey data

---

## 3) Incomplete Courses

- **Draft labeling:** mark clearly as **Draft** in README + course plan
- **Placement:** keep drafts in `draft/` or a branch; don’t list on discovery page as “stable”
- **Graduation criteria:** (a) 1 successful pilot delivery, (b) notes complete, (c) passes quarterly review

---

## 4) Versioning & Tooling

- **Tag each quarterly release:** `vYYYY-QX`
- **Record toolchain versions** in each course README (e.g., `Anchor CLI vX.Y.Z`, `Solana CLI v1.19.x`)
- **Pin examples** where needed; if APIs change, bump the tag and note migration
- **Deprecation:** archive obsolete courses to `archive/` with a deprecation note

---

## 5) Governance & Roles

- **Maintainers:** own the quarterly review and merge gates
- **Contributors:** submit PRs; follow templates; add repro steps for code changes
- **Issue labels:** `quarterly-review`, `feedback`, `content-bug`, `enhancement`, `draft`, `good-first-issue`

---

## 6) Quality Bar (apply to every workshop)

- Slides header-only (unless a graphic is essential)
- Complete facilitator notes (timing, prompts, pitfalls, curriculum links)
- Runnable code demo with minimal friction (devnet or local)
- Security: audit mindset guidance and links (e.g., Rektoff roadmap)
- Clear “What’s Next” path into the broader curriculum

---

**Next scheduled review:** _2026-01-15_  
**Last reviewed:** _2025-09-24_  
