/**
 * # Solana Anchor Counter Program - Client Interaction Demo
 * 
 * This script demonstrates how to interact with an Anchor program from a client application.
 * It mimics the patterns used in real frontend applications (React, Vue, etc.) when
 * connecting to and interacting with Solana programs.
 * 
 * Key concepts demonstrated:
 * - Client-side provider setup and wallet connection
 * - Program instantiation using IDL (Interface Definition Language)
 * - PDA derivation and management from client perspective
 * - Account state fetching and data parsing
 * - Error handling and graceful failure management
 * 
 * This script can be run independently to test program functionality
 * without requiring a full test suite or UI framework.
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import idl from "./counter.json";

/**
 * Main client interaction function
 * 
 * This function demonstrates the complete client-side workflow:
 * 1. Set up provider and program connection
 * 2. Derive PDA for deterministic account management
 * 3. Initialize PDA account (if needed)
 * 4. Perform multiple state updates
 * 5. Fetch and verify account state changes
 */
async function main() {
  console.log("🚀 Starting Anchor 3h Workshop Client Demo");
  console.log("==========================================");

  // Set up the Anchor provider for localnet connection
  // 
  // AnchorProvider.env() automatically reads environment variables:
  // - ANCHOR_PROVIDER_URL: RPC endpoint (e.g., http://localhost:8899 for localnet)
  // - ANCHOR_WALLET: Path to wallet keypair file
  // 
  // This is the same pattern used in frontend applications where
  // the provider is configured based on the target network
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the program using the generated IDL
  // 
  // The IDL (Interface Definition Language) is automatically generated
  // by Anchor during the build process. It contains:
  // - All instruction definitions and their parameters
  // - Account structures and their layouts
  // - Program metadata and version information
  // 
  // In a real frontend app, you would typically fetch the IDL from:
  // - A CDN or static file server
  // - The program's IDL account on-chain
  // - A package registry like npm
  const program = new Program(idl as anchor.Idl, provider);
  console.log("📋 Program ID:", program.programId.toString());

  // Get the payer wallet from the provider
  // 
  // The wallet represents the user's keypair and is used for:
  // - Signing transactions
  // - Paying transaction fees
  // - Providing seed material for PDA derivation
  // 
  // In a real frontend app, this would be connected to:
  // - Phantom, Solflare, or other wallet extensions
  // - Hardware wallets like Ledger
  // - Mobile wallet apps
  const payer = provider.wallet as anchor.Wallet;
  console.log("👤 Payer:", payer.publicKey.toString());

  // Derive the PDA using findProgramAddressSync
  // 
  // PDAs (Program Derived Addresses) are deterministic addresses
  // that programs can own without requiring private keys.
  // 
  // The seeds must exactly match what we defined in our Rust program:
  // seeds = [b"state", payer.key().as_ref()]
  // 
  // This ensures that:
  // - The same payer always gets the same PDA address
  // - The program can deterministically find and manage the account
  // - No private key is needed to control the account
  const [statePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), payer.publicKey.toBuffer()],
    program.programId
  );
  console.log("🔑 Derived PDA:", statePda.toString());
  console.log("📊 Bump:", bump);

  try {
    // Initialize the PDA account (starts at 0)
    // 
    // We use nested try-catch blocks to handle the case where
    // the PDA already exists from previous runs. This makes the
    // script more resilient and allows for multiple executions.
    console.log("\n📝 Initializing PDA...");
    try {
      await program.methods
        .initializePda()
        .accounts({
          state: statePda,                    // The derived PDA address
          payer: payer.publicKey,             // Payer and seed provider
          systemProgram: anchor.web3.SystemProgram.programId, // Required for account creation
        })
        .rpc(); // Send transaction and wait for confirmation
    } catch (error) {
      // If PDA already exists, that's fine - we can still test updates
      // This is a common pattern in client applications to handle
      // account reuse and idempotent operations
      console.log("✅ PDA already exists, continuing with updates...");
    }

    // Fetch the initial state using direct connection access
    // 
    // We use provider.connection.getAccountInfo() instead of
    // program.account.state.fetch() to demonstrate manual data parsing.
    // This approach gives us more control over the data extraction
    // and is useful when you need to parse custom data formats.
    const stateAccountInfo = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo) {
      const stateData = stateAccountInfo.data;
      // Parse the account data manually:
      // - First 8 bytes: Anchor discriminator (automatically added)
      // - Next 8 bytes: Our u64 count value (little-endian)
      const count = stateData.readBigUInt64LE(8); // Skip 8-byte discriminator
      console.log("✅ PDA initialized! Count =", count.toString());
    }

    // First PDA update: 0 → 1
    // 
    // This demonstrates how a frontend would trigger state changes
    // in response to user interactions (button clicks, form submissions, etc.)
    console.log("\n📈 Updating PDA (1st time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,        // The PDA to be modified
        payer: payer.publicKey, // Required for PDA seed validation
      })
      .rpc();

    // Fetch and verify the first update
    const stateAccountInfo1 = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo1) {
      const stateData = stateAccountInfo1.data;
      const count = stateData.readBigUInt64LE(8);
      console.log("✅ PDA updated! Count =", count.toString());
    }

    // Second PDA update: 1 → 2
    // 
    // Multiple updates demonstrate how frontend applications
    // can perform sequential operations and track state changes
    console.log("\n📈 Updating PDA (2nd time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    // Fetch and verify the second update
    const stateAccountInfo2 = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo2) {
      const stateData = stateAccountInfo2.data;
      const count = stateData.readBigUInt64LE(8);
      console.log("✅ PDA updated! Count =", count.toString());
    }

    // Third PDA update: 2 → 3
    // 
    // Final update to demonstrate the complete workflow
    console.log("\n📈 Updating PDA (3rd time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    // Fetch and verify the final state
    const stateAccountInfo3 = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo3) {
      const stateData = stateAccountInfo3.data;
      const count = stateData.readBigUInt64LE(8);
      console.log("✅ PDA updated! Count =", count.toString());
      console.log("\n🎉 Client demo completed successfully!");
      console.log("📊 Final PDA state: count =", count.toString());
      console.log("🔗 PDA address:", statePda.toString());
    }

  } catch (error) {
    // Handle any errors that occur during the demo
    // 
    // In a real frontend application, you would typically:
    // - Show user-friendly error messages
    // - Log errors for debugging
    // - Provide retry mechanisms
    // - Handle specific error types differently
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Execute the main function with error handling
// 
// This pattern ensures that any unhandled errors are caught
// and the process exits gracefully. In a real frontend app,
// you would handle errors by updating the UI state rather
// than exiting the process.
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
