# 1-Hour Anchor Workshop (Gateway) — Slides, Notes, Code

**Purpose:** A reusable, Solana-branded workshop package for universities and meetups. In 60 minutes, learners **scaffold, deploy, and verify** a minimal Anchor program (counter) and get **conceptual previews** of accounts, PDAs, testing, and the **security/audit mindset**.  

**Scope:** **Anchor only**. No frontend UI and **no CPI** in this session. (Those move to the 3-hour/full-stack track.)

---

## Learning Outcomes

By the end of the workshop, participants can:

- Scaffold and explore an **Anchor workspace**.
- Implement, build, deploy, and verify a **minimal Anchor program** on **devnet**.
- Explain **Solana’s execution model** and why **“everything is an account”**.
- Describe **what PDAs are** and why they matter.
- Adopt **wallet security basics** and understand **devnet vs mainnet**.
- Understand that **security is a process** (audits & mindset), with resources for next steps.
- Know **where to go next** in the curriculum (PDAs, testing, security, **IDL → TS client**).

---

## Slides & Facilitator Notes

📑 **Google Slides (with speaker notes):**  
[View the deck here](https://docs.google.com/presentation/d/11l9twjXdtO-7uHoRzkJ8Nx2wAw_uQfjwOHC7z8IocSc/edit?usp=sharing)

- Slides are **header-only** to reduce clutter during delivery.  
- All teaching details (timing, prompts, pitfalls, real-world examples) live in the **speaker notes**.  
- Facilitators should run through the deck in **presenter mode** to see notes as they teach.  

---

## Repo Structure

```

courses/anchor-and-programs/workshop/anchor-1h/
├── code/
│   └── counter/
│       ├── Anchor.toml
│       ├── Cargo.toml
│       ├── programs/
│       │   └── counter/
│       │       └── src/
│       │           └── lib.rs
│       └── tests/
│           └── counter.ts
└── README.md

````

Optional: include an exported PDF of the slides in `/slides/` for archival purposes.

---

## Prerequisites

- Rust toolchain  
- Solana CLI  
- Anchor CLI  
- Node + npm/pnpm  

Verify versions:

```bash
rustc --version
solana --version
anchor --version
node --version
````

---

## Quick Start (Facilitator)

### 0) Configure devnet & fund dev wallet (single wallet)

Use a single wallet for everything: `~/.config/solana/id.json`.

```bash
yarn devnet:env
solana address    # verify it prints the same pubkey used for deploy/tests
solana airdrop 2  # may need to retry if rate-limited
```

### 1) Scaffold the project

```bash
anchor init counter
cd counter
```

### 2) Program implementation

Open `programs/counter/src/lib.rs`.

* Add an `initialize` instruction that creates a counter account with a starting value of 0.

* Add an `increment` instruction that increases the counter value by 1.
* Ensure the account has enough space allocated (discriminator + 1 field).

👉 The goal is a minimal program that stores and updates a single integer.

### 3) Set Program ID

```bash
anchor keys list
```

* Copy the generated Program ID for `counter`.
* Paste it into the `declare_id!` macro in `lib.rs`.
* Update `Anchor.toml` under `[programs.devnet]` with the same Program ID.

### 4) Build & deploy (devnet)

```bash
yarn devnet:build
yarn devnet:deploy
```

Expected:

* Build finishes without errors.
* Deploy prints a **Program Id** and a transaction signature.

### 5) Verify with Anchor test

Open `tests/counter.ts`.

* Write a test that:

  1. Calls `initialize`.
  2. Calls `increment`.
  3. Fetches the counter account and confirms its value changed from `0` to `1`.

Run (skip re-deploy to save SOL after first deploy):

```bash
yarn devnet:test:skip-deploy
```

Or to include deploy each time:

```bash
yarn devnet:test
```

### Localnet quick-switch

For fully offline dev:

```bash
solana config set --url http://127.0.0.1:8899
solana-test-validator -r
anchor build
anchor deploy --provider.cluster localnet
anchor test --provider.cluster localnet --skip-deploy
```

### Troubleshooting: Program ID drift

If you see “Unsupported program id” or the client can’t find your program:

1) Run `anchor keys list` and copy the `counter` Program ID.
2) Ensure the same ID appears in:
   - `programs/counter/src/lib.rs` inside `declare_id!(...)`
   - `Anchor.toml` in both `[programs.localnet]` and `[programs.devnet]`
   - `programs/counter/keys/counter-keypair.json` (source of truth)
3) Rebuild and redeploy.

Expected:

* Tests pass.
* Console/logs show `count = 1`.

---

## Teaching Plan (60 minutes)

* 0–5 min — Welcome, Objectives, Agenda
* 5–12 min — Solana Execution Model (accounts as hash maps)
* 12–20 min — What is Anchor?
* 20–35 min — **Demo** (scaffold → code → build → deploy → verify)
* 35–38 min — Wallet Security Basics
* 38–46 min — Spotlight: PDAs
* 46–50 min — Spotlight: Testing
* 50–54 min — Security & Audits (mindset)
* 54–58 min — Quick quiz/exercise
* 58–60 min — What’s Next (PDAs, Testing, Security, IDL → TS client teaser)

---

## Security & Audit Mindset

* Security = process, not a checkbox.
* Always plan for audits before mainnet.
* Extra reading: [Rektoff — Security Roadmap for Solana Apps](https://github.com/Rektoff/Security-Roadmap-for-Solana-applications)

---

## What’s Next

* Accounts & PDAs (deeper patterns)
* Testing & CI
* Security (constraints, validation, audits)
* **IDL → TypeScript client** (teaser only here; full-stack in 3-hour session)

---

## Maintenance

* **Quarterly Review:** update demos & links, check toolchain changes.
* **Versioning:** note CLI versions, bump repo tags when APIs change.
* **Discovery:** add to Solana curriculum site/index.
* **Ratings & Feedback:** facilitators share session results; learners rate.
* **Incomplete Courses:** clearly mark drafts/WIP; keep them in `draft/` branches.

---

## Presenter Prep

### For Instructors

Before teaching this workshop, review the **reference implementation** in `/code/final/`:

- [final/README.md](code/final/README.md) - Teaching notes, troubleshooting, FAQs
- [final/programs/counter/src/lib.rs](code/final/programs/counter/src/lib.rs) - Deeply commented program
- [final/tests/counter.ts](code/final/tests/counter.ts) - Annotated test suite

### Official Resources

- [Anchor Book](https://www.anchor-lang.com/) - Framework documentation
- [Solana Docs](https://solana.com/docs) - Core concepts
- [Solana Cookbook](https://solanacookbook.com/) - Recipes and examples

### What Comes Next

This workshop is a **gateway** to deeper Solana development:

- **Weeks 4-5:** PDAs and advanced account patterns
- **Week 7:** Testing with LiteSVM
- **Week 8:** Security and vulnerability analysis
- **3-Hour Workshop:** Full-stack (IDL → TypeScript client → UI)

The **IDL** (Interface Definition Language) generated at `target/idl/counter.json` becomes your program's API contract for building frontends. We preview this concept here but save the implementation for the full-stack session.

---

## License

Apache-2.0 (or equivalent) — attribution required.

---