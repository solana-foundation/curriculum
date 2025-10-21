import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import idl from "./counter.json";

async function main() {
  console.log("🚀 Starting Anchor 3h Workshop Client Demo");
  console.log("==========================================");

  // Set up provider for localnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the program using the generated IDL
  const program = new Program(idl as anchor.Idl, provider);
  console.log("📋 Program ID:", program.programId.toString());

  // Get the payer wallet
  const payer = provider.wallet as anchor.Wallet;
  console.log("👤 Payer:", payer.publicKey.toString());

  // Derive PDA using findProgramAddressSync
  const [statePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), payer.publicKey.toBuffer()],
    program.programId
  );
  console.log("🔑 Derived PDA:", statePda.toString());
  console.log("📊 Bump:", bump);

  try {
    // Initialize PDA (starts at 0) - handle case where it already exists
    console.log("\n📝 Initializing PDA...");
    try {
      await program.methods
        .initializePda()
        .accounts({
          state: statePda,
          payer: payer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      // If PDA already exists, that's fine - we can still test updates
      console.log("✅ PDA already exists, continuing with updates...");
    }

    // Fetch initial state using connection directly
    const stateAccountInfo = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo) {
      const stateData = stateAccountInfo.data;
      const count = stateData.readBigUInt64LE(8); // Skip 8-byte discriminator
      console.log("✅ PDA initialized! Count =", count.toString());
    }

    // First PDA update: 0 → 1
    console.log("\n📈 Updating PDA (1st time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    const stateAccountInfo1 = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo1) {
      const stateData = stateAccountInfo1.data;
      const count = stateData.readBigUInt64LE(8);
      console.log("✅ PDA updated! Count =", count.toString());
    }

    // Second PDA update: 1 → 2
    console.log("\n📈 Updating PDA (2nd time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

    const stateAccountInfo2 = await provider.connection.getAccountInfo(statePda);
    if (stateAccountInfo2) {
      const stateData = stateAccountInfo2.data;
      const count = stateData.readBigUInt64LE(8);
      console.log("✅ PDA updated! Count =", count.toString());
    }

    // Third PDA update: 2 → 3
    console.log("\n📈 Updating PDA (3rd time)...");
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

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
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});