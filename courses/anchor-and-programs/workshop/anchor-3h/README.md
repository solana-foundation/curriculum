# Solana Anchor & dApp Workshop (3-Hour)

## Purpose

This workshop introduces developers to Solana’s on-chain programming model using the **Anchor framework**, guiding them from setup to deployment and client interaction.  
It is designed for university builders, hackathon participants, and developers transitioning from Web2 or EVM backgrounds.

## Scope

Participants will build, test, and interact with a simple on-chain program (counter example) while learning Solana’s account model, PDAs, and IDL-based client interaction.  
The session combines live coding, conceptual slides, and quick quizzes for reinforcement.

**Duration:** 3 hours  
**Difficulty:** Beginner → Intermediate  
**Delivery Mode:** Live + Hands-On (Localnet)  

---

## 🎓 Learning Outcomes

By the end of the workshop, learners will be able to:

1. Set up and validate their local **Solana + Anchor** development environment.  
2. Initialize and structure an **Anchor workspace** (programs, accounts, and instructions).  
3. Explain how Solana’s **account model** underpins program state.  
4. Implement and derive **Program Derived Addresses (PDAs)** securely in Anchor.  
5. Compile, deploy, and test a working Solana program using `anchor build` and `anchor test`.  
6. Use the generated **IDL** to interact with their program via a TypeScript client.  
7. Apply key **security practices**, including dev-wallet separation and safe testing clusters.  
8. Troubleshoot common **build, deploy, and validator errors**.  
9. Extend their program logic and connect to broader Solana learning tracks.

---

### Slides & Facilitator Notes Integration

This workshop includes a **Google Slides deck** with embedded speaker notes that guide facilitators through each concept, code demo, and discussion point.

#### Workshop Slides

- Access the official Solana-branded slides here:  
  [View Slides on Google Drive](https://docs.google.com/presentation/d/1b-Bb9AJESqjWV7A7p9I2AzLEQsu95GIgGO2frUxQ3BI/edit?usp=sharing)
- The deck is structured into six teaching blocks that align with this README:
  - Block A — On-Ramp & Environment  
  - Block B — Program Skeleton & Accounts  
  - Block C — PDA Lite  
  - Block D — Build → Deploy → Test  
  - Block E — IDL & Client Interaction  
  - Block F — Wrap-Up & Next Steps
- Each block maps directly to the workshop flow and learning objectives.

#### Speaker Notes as Facilitator Guide

- The **speaker notes within the slides** contain:
  - Purpose and learning outcome for each slide.  
  - Key talking points and analogies.  
  - Code cues and timing guidance.  
  - Engagement prompts and expected learner questions.
- Use **Presenter View** during delivery to see these private notes while presenting live.

#### 🧭 How to Use Slides 

1. **Before the workshop:** Review the slides alongside this README to understand flow and setup.  
2. **During delivery:** Present from Google Slides in *Presenter View* to see your private notes.  
3. **After delivery:** Export the deck as PDF with notes to share a recap or upload to your LMS.

> *Tip:* The slides carry the visuals, the speaker notes carry your voice, and the curriculum ensures every session feels unified across the Solana Foundation's learning network.

---

## Workshop Flow

### Block A — On-Ramp & Environment  
**Purpose:** Equip learners with the mindset and tools to begin Solana development.  
**Slides:** 1–6  
**Learning Outcome Alignment:** (1, 3, 7)

**Facilitator Notes:**  
- Contrast Solana programs vs. dApps (backend vs. frontend logic).  
- Verify `rustc`, `solana`, and `anchor` installation versions.  
- Run a local validator (`solana-test-validator`) and confirm via `solana balance`.  
- Reinforce wallet hygiene: dev wallet ≠ personal wallet.  
- Engagement cue: *“Why is separating data (accounts) from logic (programs) safer?”*

---

### Block B — Program Skeleton & Accounts  
**Purpose:** Introduce Anchor’s workspace, macros, and the Solana account model.  
**Slides:** 7–13  
**Learning Outcome Alignment:** (2, 3, 5)

**Facilitator Notes:**  
- Explain the purpose of `lib.rs`, `Cargo.toml`, and `Anchor.toml`.  
- Use `anchor init counter` live and show the generated folder structure.  
- Code cue: implement `initialize()` and explain the `#[derive(Accounts)]` context.  
- Highlight that programs are *stateless*—state lives in accounts.  
- Quick check: learners describe what `init`, `mut`, `payer`, and `space` mean.  

---

### Block C — PDA Lite (Program Derived Addresses)  
**Purpose:** Teach secure, deterministic account creation via PDAs.  
**Slides:** 14–19  
**Learning Outcome Alignment:** (4, 7)

**Facilitator Notes:**  
- Conceptualize PDAs: “accounts owned by programs, not people.”  
- Show `Pubkey::find_program_address` → seeds + bump → PDA.  
- Add PDA logic to `#[account(seeds = [...], bump)]` and test.  
- Engagement: ask why PDAs eliminate the need for private keys.  
- Safety tip: discuss deterministic addresses and ownership checks (`has_one`).  

---

### Block D — Build → Deploy → Test  
**Purpose:** Compile, deploy, and validate program logic.  
**Slides:** 20–25  
**Learning Outcome Alignment:** (5, 8)

**Facilitator Notes:**  
- Build flow: `anchor build` → `.so` binary → `target/deploy` → IDL JSON.  
- Emphasize syncing program ID: `declare_id!()` ↔ `Anchor.toml`.  
- Deploy with `anchor deploy --provider.cluster localnet`.  
- Run `anchor test` to execute both Rust and TypeScript tests.  
- Troubleshooting: ID drift, missing IDL, validator reset (`Ctrl+C` → restart).  

---

### Block E — IDL & Client Interaction  
**Purpose:** Bridge on-chain logic to a frontend client via the IDL.  
**Slides:** 26–31  
**Learning Outcome Alignment:** (6, 7)

**Facilitator Notes:**  

- Define IDL: “Interface Definition Language describing your program’s API.”  
- Show how `anchor build` auto-generates the `IDL JSON` and client bindings.  
- Code cue:  
  ```ts
  await program.methods.increment()
    .accounts({ counter: counterPubkey })
    .rpc()
    ```
- Emphasize how Anchor abstracts complex RPC calls into simple methods.
- Reinforce security: always use dev wallets for frontend testing.
- Quick quiz: “What belongs in the IDL vs. what stays in Rust code?”

⸻

### Block F — Wrap-Up & Next Steps

**Purpose**: Reinforce learning and connect to the broader Solana curriculum.
**Slides**: 32–36
**Learning Outcome Alignment**: (9)

**Facilitator Notes:**

- Recap flow: build → deploy → test → interact.
- Share common pitfalls: wrong cluster, keypair mismatch, insufficient SOL.
- Discussion prompt: “What could you build next using a PDA?”
- Mention advanced workshops: Full-Stack, Quant, Security, and Web Dev.
- End with resources and appreciation for participation.

⸻

### Presenter Prep & Environment Setup

Pre-Session Checklist:

- rustc, cargo, solana, and anchor versions verified.
- Local validator running (solana-test-validator).
- Dev wallet configured (~/.config/solana/dev.json).
- solana airdrop 4 successful on localnet.
- anchor build completes without warnings.
- Program ID matches in both lib.rs and Anchor.toml.

Command References:
```bash
solana config get
solana address -k target/deploy/<program>-keypair.json
anchor build
anchor deploy --provider.cluster localnet
anchor test
```

⸻

### Troubleshooting

### Troubleshooting Guide

| **Issue** | **Likely Cause** | **Fix** |
|--------------|--------------------|-------------|
| **Program is not deployed** | Mismatch between `declare_id!()` and `Anchor.toml` | Copy the correct key from `target/deploy/<program>-keypair.json` and redeploy. |
| **Account does not exist** | Local validator was restarted or wiped | Restart validator and re-run `anchor deploy`. |
| **Transaction simulation failed** | Wrong cluster or missing SOL balance | Run `solana airdrop 4` or check `solana config get`. |
| **IDL not found** | IDL JSON not generated | Run `anchor build` to regenerate the IDL. |
| **Command not found: anchor** | Anchor CLI not in PATH | Run `source ~/.cargo/env` or add Cargo bin to your `.zshrc`. |

⸻

### Resources & Further Learning

- [The Anchor Book](https://www.anchor-lang.com/docs)
- [Solana Docs](https://solana.com/docs)
- [Solana Cookbook](https://solanacookbook.com)
- [Solana Security Guidelines](https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security)
- [Solana Playground](https://beta.solpg.io)
- [Solana Discord](https://discord.gg/solana)
- [Solana Bootcamp](https://github.com/solana-developers/developer-bootcamp-2024)

---

### Summary

This README provides facilitators and learners with a complete guide to the **Solana Anchor & dApp Workshop** — aligning slides, demos, and learning objectives in one document.  

It’s designed to be **reproducible, discoverable, and educationally sound**, so any instructor, anywhere, can deliver the same world-class developer experience.

---