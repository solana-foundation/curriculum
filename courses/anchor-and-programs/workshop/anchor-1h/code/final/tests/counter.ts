/**
 * Counter Program Tests - Reference Implementation
 * 
 * This file demonstrates:
 * - Anchor client setup (provider, program, wallet)
 * - Account creation (initialize)
 * - State mutation (increment)
 * - State verification (fetch)
 * 
 * Teaching Notes:
 * - Show students the IDL in target/idl/counter.json
 * - Explain how .methods.initialize() comes from the IDL
 * - Emphasize transaction = instruction + accounts + signers
 * 
 * Links:
 * - Anchor TS Client: https://www.anchor-lang.com/docs/clients/typescript
 * - Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  // PROVIDER SETUP: Connect to Solana cluster
  // AnchorProvider.env() reads from environment variables:
  // - ANCHOR_PROVIDER_URL: RPC endpoint (devnet/localnet)
  // - ANCHOR_WALLET: path to keypair file
  //
  // This is the "connection + wallet" bundle that Anchor needs
  // to send transactions and sign them.
  //
  // Why .env()? Consistent environment across team members
  // Why not manual setup? Reduces boilerplate and errors
  // 📖 https://www.anchor-lang.com/docs/testing#provider
  anchor.setProvider(anchor.AnchorProvider.env());

  // PROGRAM CLIENT: TypeScript interface to your Rust program
  // workspace.counter comes from Anchor.toml [programs.*] sections
  // The IDL (Interface Definition Language) generates these types
  // automatically from your Rust code.
  //
  // Key concepts:
  // - Program<Counter>: TypeScript types from Rust structs
  // - workspace: Anchor's program registry
  // - .methods.*: instruction handlers become method calls
  //
  // IDL: JSON schema of your program's interface
  // Type safety: TypeScript knows your program's shape
  // 📖 https://www.anchor-lang.com/docs/testing#program
  const program = anchor.workspace.counter as Program<Counter>;

  it("initialize → increment → fetch", async () => {
    // WALLET EXTRACTION: Get the payer from the provider
    // The provider contains both the RPC connection AND the wallet
    // We need the wallet to:
    // 1. Sign transactions (cryptographic authorization)
    // 2. Pay for account creation (rent-exempt minimum balance)
    //
    // Signer: proves ownership of private key
    // Payer: pays transaction fees + account creation costs
    // 📖 https://solana.com/docs/core/transactions#signatures
    const provider = program.provider as anchor.AnchorProvider;
    const payer = provider.wallet as anchor.Wallet;

    // KEYPAIR GENERATION: Create a fresh account for this test
    // Why fresh keypair per test?
    // 1. Test isolation: each test gets clean state
    // 2. No conflicts: multiple tests can run in parallel
    // 3. Realistic: mimics how users create accounts
    //
    // Alternative: reuse a PDA (Program Derived Address)
    // but that's advanced and requires seeds.
    //
    // Keypair: public key + private key pair
    // .generate(): cryptographically secure random generation
    // 📖 https://solana-labs.github.io/solana-web3.js/classes/Keypair.html
    const counterKeypair = anchor.web3.Keypair.generate();

    // ACCOUNT INITIALIZATION: Create the counter account
    // This demonstrates the "initialize" instruction from lib.rs
    //
    // Key concepts:
    // - .methods.initialize(): comes from IDL, maps to pub fn initialize
    // - .accounts(): matches the Initialize<'info> struct in Rust
    // - .signers(): who authorizes this transaction
    // - .rpc(): send transaction + wait for confirmation
    //
    // Transaction = instruction + accounts + signers
    // systemProgram: Solana's account creation program
    // 📖 https://www.anchor-lang.com/docs/testing#calling-instructions
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterKeypair])
      .rpc();

    // FIRST INCREMENT: 0 → 1
    // This demonstrates state mutation - the core of Solana programs
    //
    // Key concepts:
    // - No payer needed: account already exists
    // - No systemProgram: no account creation
    // - Just the counter account: matches Increment<'info> struct
    //
    // State persistence: Solana stores account data on-chain
    // Multiple calls: prove state survives across transactions
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    // STATE VERIFICATION: Read the account data back
    // .fetch() deserializes the on-chain account data into TypeScript
    // This proves that:
    // 1. The account was created successfully
    // 2. The increment worked (count = 1)
    // 3. State persists between transactions
    //
    // .fetch(): deserialize on-chain data to TypeScript
    // .toString(): convert BigNum to readable string
    // 📖 https://www.anchor-lang.com/docs/testing#fetching-accounts
    let counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 1st increment: count =", counterAcc.count.toString());

    // SECOND INCREMENT: 1 → 2
    // Multiple increments prove state persistence
    // This is crucial for students to understand:
    // - Solana programs maintain state
    // - Each transaction can modify that state
    // - State survives across multiple transactions
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 2nd increment: count =", counterAcc.count.toString());

    // THIRD INCREMENT: 2 → 3
    // Final proof of state persistence
    // Students should see: 0 → 1 → 2 → 3
    // This demonstrates that Solana programs are stateful,
    // unlike some blockchain systems where programs are stateless.
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 3rd increment: count =", counterAcc.count.toString());
  });
});
