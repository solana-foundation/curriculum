# Counter Program - Reference Implementation

**Purpose:** Deeply commented reference code for workshop presenters.  
**Audience:** Instructors preparing to teach the 1-hour Anchor workshop.  
**Not for students:** Students work in `/code/counter/` with minimal comments.

## Important: This is Reference Only

**Students work in `/code/counter/`** - this directory is for presenter study only.

The `counter/` directory contains the complete, runnable project that students will:
- Initialize themselves (`anchor init counter`)
- Configure their own environment  
- Type along during the workshop

This `final/` directory is purely for instructor preparation and reference.

## 5-Minute Presenter Prep

### 1. Read These Docs (10 min before workshop)
- [ ] [Anchor Book - Getting Started](https://www.anchor-lang.com/docs/installation)
- [ ] [Solana Account Model](https://solana.com/docs/core/accounts)
- [ ] [This file's Teaching Notes](#teaching-notes)

### 2. Preflight Checklist (5 min before workshop)
- [ ] `anchor --version` ≥ 0.31.0
- [ ] `solana --version` ≥ 2.0.0
- [ ] `solana config get` points to devnet
- [ ] `solana balance` > 2 SOL (airdrop if needed)
- [ ] `anchor keys list` matches lib.rs declare_id!

### 3. Mental Model (Know These Cold)
- **Everything is an account** (Solana's core abstraction)
- **Programs are stateless** (state lives in accounts)
- **Transactions are atomic** (all-or-nothing execution)
- **PDAs are deterministic** (no private keys needed)

## Quick Flows

### Localnet (Live Demo Default)
```bash
# Terminal A
solana-test-validator -r

# Terminal B
solana config set --url http://127.0.0.1:8899
cd code/counter
anchor build
anchor deploy --provider.cluster localnet
anchor test --provider.cluster localnet --skip-deploy
```

### Devnet (Homework/Extended Session)

```bash
cd code/counter
yarn devnet:env
solana airdrop 2
yarn devnet:build && yarn devnet:deploy
yarn devnet:test:skip-deploy
```

## Teaching Notes

### Common Student Questions

**Q: Why checked_add instead of +?**

A: Overflow protection. In production, an unchecked overflow could let an attacker wrap a balance to 0. Rust forces us to think about edge cases.

**Q: What's the discriminator (8 bytes)?**

A: Anchor's type safety. It's a hash of the account name ("Counter") that prevents you from accidentally passing the wrong account type to an instruction.

**Q: Why do we need systemProgram?**

A: Creating accounts requires calling the System Program (Solana's "account factory"). It's like needing the OS to allocate memory.

**Q: Can I just use counter++ like JavaScript?**

A: No - Rust doesn't have ++ operator. But more importantly, we want checked_add to prevent overflows. This is a teaching moment about safe vs unsafe code.

### Wallet Hygiene

**Critical Safety Message**

- **Dev wallet only**: Never use production keys in workshops
- **Devnet ≠ Mainnet**: Make this distinction crystal clear
- **Key rotation**: Students should generate new keypairs for each project
- **Never commit keys**: Add to .gitignore

### Troubleshooting

#### Program ID Drift

**Symptom:** "Error: Program FoK... is not deployed"

**Cause:** declare_id! doesn't match Anchor.toml or keypair

**Fix:**

1. `anchor keys list`
2. Copy Program ID
3. Update declare_id! in lib.rs
4. Update Anchor.toml [programs.localnet] and [programs.devnet]
5. `anchor build && anchor deploy`

#### Validator Already Running

**Symptom:** "Error: port 8899 already in use"

**Fix:** `pkill -f solana-test-validator && solana-test-validator -r`

#### IDL Not Found

**Symptom:** "Error: IDL not found"

**Fix:** `anchor build` generates target/idl/counter.json

## Code Walkthrough (Line-by-Line)

### lib.rs Key Concepts

| Lines | Concept | Why It Matters |
|-------|---------|----------------|
| 3 | declare_id! | Program's on-chain address |
| 5 | #[program] | Anchor's RPC interface builder |
| 9-13 | initialize | Account creation pattern |
| 15-19 | increment | State mutation pattern |
| 17 | checked_add | Overflow protection (security) |
| 22-25 | #[account] | Data structure + serialization |
| 29 | init | Account creation constraint |
| 29 | space | Rent calculation (8 discriminator + 8 u64) |
| 31 | Signer | Cryptographic authorization |
| 38 | mut | Write permission |

### counter.ts Key Concepts

| Lines | Concept | Why It Matters |
|-------|---------|----------------|
| 6 | AnchorProvider.env() | Wallet + RPC connection |
| 8 | workspace.counter | Program client from IDL |
| 14 | Keypair.generate() | Test isolation |
| 17-25 | .methods.initialize() | IDL → TypeScript binding |
| 20 | .accounts() | Instruction context |
| 24 | .signers() | Transaction authorization |
| 25 | .rpc() | Send & confirm |
| 33-35 | .fetch() | Read on-chain data |

## What Comes Next

After this workshop, students are ready for:

1. **PDAs (Week 4)** - Deterministic addresses, no private keys
2. **Testing (Week 7)** - LiteSVM, test-driven development
3. **Security (Week 8)** - Constraint checks, attack vectors
4. **IDL → TS Client** - Building frontends (3-hour workshop)

### IDL Export Preview

```bash
# The IDL is auto-generated at target/idl/counter.json
# Use it in your frontend:
import idl from './target/idl/counter.json';
const program = new Program(idl, provider);
```

## Resources

### Official Docs

- [Anchor Book](https://www.anchor-lang.com/)
- [Solana Docs](https://solana.com/docs)
- [Solana Cookbook](https://solanacookbook.com/)

### Security

- [Sealevel Attacks](https://github.com/coral-xyz/sealevel-attacks)
- [Neodyme Security Guide](https://workshop.neodyme.io/)

### Community

- [Anchor Discord](https://discord.gg/anchor)
- [Solana StackExchange](https://solana.stackexchange.com/)
