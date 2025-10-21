//! # Counter Program - Reference Implementation
//!
//! This is the **deeply commented reference** for workshop presenters.
//! Students work in `/code/counter/` with minimal comments.
//!
//! ## What Students Learn
//! - Anchor program structure
//! - Account initialization and mutation
//! - Safe arithmetic (overflow protection)
//! - Solana's account model basics
//!
//! ## Teaching Notes
//! - Start with "everything is an account" mental model
//! - Emphasize Program ID consistency (common student error)
//! - Use counter.count++ as gateway to state management
//!
//! ## Links
//! - [Anchor Book](https://www.anchor-lang.com/)
//! - [Solana Cookbook](https://solanacookbook.com/)

use anchor_lang::prelude::*;

// PROGRAM ID: The program's permanent address on Solana
// This must match:
// 1. Anchor.toml [programs.localnet] and [programs.devnet]
// 2. programs/counter/keys/counter-keypair.json
// 3. The deployed program address
//
// Why? Solana uses this ID to route transactions to your program.
// PDAs (covered in Week 4) derive from this ID.
// 📖 https://solana.com/docs/core/programs#program-derived-addresses
declare_id!("FoKCfkWjCJxuHLxHGkzdQ3VXrFgrnGdq4xNsZLnjJLbK");

// PROGRAM MODULE: Anchor's interface builder
// The #[program] macro generates:
// 1. RPC endpoints for each pub fn
// 2. IDL (Interface Definition Language) 
// 3. TypeScript client bindings
//
// Think of this as your program's "API surface" - what external
// clients can call. Each pub fn becomes an instruction handler.
//
// Context<T>: Anchor's account safety system
// Result<()>: Rust error handling (vs panics in production)
// 📖 https://www.anchor-lang.com/docs
#[program]
pub mod counter {
    use super::*;

    // INITIALIZE: Create a new counter account
    // This is the "constructor" pattern in Solana programs
    //
    // Key concepts:
    // - &mut ctx.accounts.counter: exclusive write access to the account
    // - Setting count = 0: explicit initialization (vs undefined behavior)
    // - Space calculation: 8 (discriminator) + 8 (u64) = 16 bytes
    //
    // Why &mut? Solana enforces exclusive access for data integrity
    // Why explicit init? Prevents reading uninitialized memory
    // 📖 https://www.anchor-lang.com/docs
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    // INCREMENT: Mutate existing counter state
    // This demonstrates state persistence across transactions
    //
    // Key concepts:
    // - checked_add(1): overflow protection (security critical!)
    // - unwrap(): safe here because we're adding 1 to a u64
    // - State persists: Solana stores account data on-chain
    //
    // Why checked_add? Prevents integer overflow attacks
    // Why unwrap? In production, handle Result properly
    // 📖 https://doc.rust-lang.org/std/primitive.u64.html#method.checked_add
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        Ok(())
    }
}

// ACCOUNT STRUCT: Data layout for on-chain storage
// The #[account] macro adds:
// 1. BorshSerialize/BorshDeserialize (serialization)
// 2. 8-byte discriminator (type safety)
// 3. Clone, Debug, Default traits
//
// Key concepts:
// - u64: atomic operations, Rust primitive, 8 bytes
// - Why not Vec or String? Complexity vs learning goals
// - Discriminator: hash of "account:Counter" for type safety
//
// Borsh: Binary Object Representation Serializer for Hashing
// Discriminator: prevents account type confusion
// 📖 https://www.anchor-lang.com/docs
#[account]
pub struct Counter {
    pub count: u64,
}

// INITIALIZE CONTEXT: Account constraints for initialize instruction
// This defines WHO can call initialize and WHAT accounts are needed
//
// Key concepts:
// - #[account(init)]: creates account + allocates space
// - payer: who pays rent-exempt minimum balance (economic model)
// - Signer<'info>: cryptographic authorization (must sign tx)
// - System program: Solana's "account factory" (creates accounts)
// - Lifetimes ('info): Rust memory safety (brief note)
//
// init constraint: creates account if it doesn't exist
// space = 8 + 8: discriminator (8) + u64 (8) = 16 bytes
// Signer: proves caller owns the private key
// 📖 https://www.anchor-lang.com/docs
// 📖 https://solana.com/docs/core/transactions#signatures
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// INCREMENT CONTEXT: Account constraints for increment instruction
// This defines WHAT accounts are needed for state mutation
//
// Key concepts:
// - #[account(mut)]: write permission (account must be mutable)
// - Why no payer? Account already exists (no creation cost)
// - Minimal constraints: show evolution to complex checks
// - Preview: add ownership checks, PDAs in advanced lessons
//
// mut constraint: account must be mutable for writes
// No init: account must already exist
// 📖 https://www.anchor-lang.com/docs
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}
