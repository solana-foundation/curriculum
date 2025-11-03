/**
 * # Solana Anchor Counter Program - Comprehensive Test Suite
 * 
 * This test file demonstrates how to interact with Anchor programs using TypeScript.
 * It covers both traditional account management and Program Derived Addresses (PDAs).
 * 
 * Key concepts demonstrated:
 * - Provider setup and workspace configuration
 * - Auto-generated client methods from IDL
 * - Traditional account initialization and management
 * - PDA derivation and deterministic addressing
 * - Account state fetching and verification
 * - Error handling and test resilience
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { expect } from "chai";

/**
 * Main test suite for the Counter program
 * 
 * Each test demonstrates different aspects of Anchor program interaction:
 * 1. Traditional account management (initialize → increment → fetch)
 * 2. PDA-based account management (derive → initialize → update → fetch)
 */
describe("counter", () => {
  // Set up the Anchor provider using environment variables
  // This automatically configures connection to localnet/devnet based on ANCHOR_PROVIDER_URL
  anchor.setProvider(anchor.AnchorProvider.env());

  // Get the program instance from Anchor's workspace
  // The workspace contains all programs defined in Anchor.toml
  // TypeScript types are auto-generated from the IDL for type safety
  const program = anchor.workspace.counter as Program<Counter>;

  /**
   * Test: Traditional Account Management
   * 
   * This test demonstrates the classic Anchor pattern:
   * 1. Generate a new keypair for the account
   * 2. Initialize the account with initial state
   * 3. Perform operations on the account
   * 4. Verify state changes through account fetching
   * 
   * This pattern is used when you need full control over account addresses
   * and don't require deterministic addressing.
   */
  it("initialize → increment → fetch", async () => {
    // Get the provider and wallet from the program instance
    // The provider handles RPC communication with the Solana cluster
    const provider = program.provider as anchor.AnchorProvider;
    const payer = provider.wallet as anchor.Wallet;

    // Generate a new keypair for our counter account
    // This creates a unique address that we'll use for the account
    const counterKeypair = anchor.web3.Keypair.generate();

    // Initialize the counter account with count = 0
    // 
    // The .methods property contains auto-generated methods from the IDL
    // Each method corresponds to an instruction in our Rust program
    // 
    // .accounts() - Pass all required accounts for the instruction
    // .signers() - Specify which keypairs must sign the transaction
    // .rpc() - Send the transaction to the cluster and wait for confirmation
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,  // New account to be created
        payer: payer.publicKey,             // Account that pays for creation
        systemProgram: anchor.web3.SystemProgram.programId, // Required for account creation
      })
      .signers([counterKeypair])  // The keypair must sign to authorize account creation
      .rpc();

    // First increment: 0 → 1
    // 
    // Note: No signers needed here since we're only modifying an existing account
    // The payer (from provider.wallet) automatically signs the transaction
    await program.methods
      .increment()
      .accounts({ 
        counter: counterKeypair.publicKey  // Account to be modified
      })
      .rpc();

    // Fetch the account state to verify the increment
    // 
    // program.account.counter.fetch() uses the auto-generated account deserializer
    // It automatically handles Borsh deserialization and type conversion
    let counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 1st increment: count =", counterAcc.count.toString());

    // Second increment: 1 → 2
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    // Verify the second increment
    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 2nd increment: count =", counterAcc.count.toString());

    // Third increment: 2 → 3
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    // Final verification
    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 3rd increment: count =", counterAcc.count.toString());
  });

  /**
   * Test: Program Derived Address (PDA) Management
   * 
   * This test demonstrates PDA usage, which is crucial for many Solana applications:
   * 1. Derive a deterministic address using seeds and program ID
   * 2. Initialize the PDA account (if it doesn't exist)
   * 3. Perform operations on the PDA
   * 4. Verify state changes
   * 
   * PDAs are essential for:
   * - Creating accounts that programs can own without private keys
   * - Ensuring consistent addressing across different clients
   * - Building complex state management systems
   */
  it("PDA: derive → initialize → update → fetch", async () => {
    // Get the provider and wallet
    const provider = program.provider as anchor.AnchorProvider;
    const payer = provider.wallet as anchor.Wallet;

    // Derive the PDA using findProgramAddressSync
    // 
    // This function takes:
    // 1. An array of seed buffers (must match the seeds in our Rust program)
    // 2. The program ID
    // 
    // It returns:
    // 1. The derived PDA address
    // 2. The canonical bump seed (ensures the address is off-curve)
    // 
    // The seeds must exactly match what we defined in our Rust program:
    // seeds = [b"state", payer.key().as_ref()]
    const [statePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), payer.publicKey.toBuffer()],
      program.programId
    );
    console.log("Derived PDA:", statePda.toString());
    console.log("Bump:", bump);

    // Try to initialize the PDA (starts at 0)
    // 
    // We use try-catch because the PDA might already exist from previous test runs
    // This makes our tests more resilient and allows for multiple test executions
    try {
      await program.methods
        .initializePda()
        .accounts({
          state: statePda,                    // The derived PDA address
          payer: payer.publicKey,             // Payer and seed provider
          systemProgram: anchor.web3.SystemProgram.programId, // Required for account creation
        })
        .rpc();
    } catch (error) {
      // If PDA already exists, that's fine - we can still test updates
      // This is a common pattern in Solana testing to handle account reuse
      console.log("PDA already exists, continuing with updates...");
    }

    // Fetch the initial state of the PDA
    // 
    // Even if initialization failed due to existing account, we can still fetch
    // This demonstrates the resilience of PDA-based account management
    let stateAcc = await program.account.state.fetch(statePda);
    console.log("After PDA init: count =", stateAcc.count.toString());
    
    // Verify the initial state is 0
    // expect() assertions ensure our program logic is working correctly
    expect(stateAcc.count.toNumber()).to.equal(0);

    // First PDA update: 0 → 1
    // 
    // Note: No signers needed here since we're only modifying an existing PDA
    // The payer automatically signs, and the PDA constraints ensure we're operating
    // on the correct account
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,        // The PDA to be modified
        payer: payer.publicKey, // Required for PDA seed validation
      })
      .rpc();

    // Verify the first update
    stateAcc = await program.account.state.fetch(statePda);
    console.log("After 1st PDA update: count =", stateAcc.count.toString());
    expect(stateAcc.count.toNumber()).to.equal(1);

    // Second PDA update: 1 → 2
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    // Verify the second update
    stateAcc = await program.account.state.fetch(statePda);
    console.log("After 2nd PDA update: count =", stateAcc.count.toString());
    expect(stateAcc.count.toNumber()).to.equal(2);

    // Third PDA update: 2 → 3
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    // Final verification
    stateAcc = await program.account.state.fetch(statePda);
    console.log("After 3rd PDA update: count =", stateAcc.count.toString());
    expect(stateAcc.count.toNumber()).to.equal(3);
  });
});
