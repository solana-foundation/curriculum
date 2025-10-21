import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { expect } from "chai";

describe("counter", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.counter as Program<Counter>;

  it("initialize → increment → fetch", async () => {
    const provider = program.provider as anchor.AnchorProvider;
    const payer = provider.wallet as anchor.Wallet;

    const counterKeypair = anchor.web3.Keypair.generate();

    // Initialize counter (starts at 0)
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterKeypair])
      .rpc();

    // First increment: 0 → 1
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    let counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 1st increment: count =", counterAcc.count.toString());

    // Second increment: 1 → 2
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 2nd increment: count =", counterAcc.count.toString());

    // Third increment: 2 → 3
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    counterAcc = await program.account.counter.fetch(
      counterKeypair.publicKey
    );
    console.log("After 3rd increment: count =", counterAcc.count.toString());
  });

  it("PDA: derive → initialize → update → fetch", async () => {
    const provider = program.provider as anchor.AnchorProvider;
    const payer = provider.wallet as anchor.Wallet;

    // Derive PDA using findProgramAddressSync
    const [statePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), payer.publicKey.toBuffer()],
      program.programId
    );
    console.log("Derived PDA:", statePda.toString());
    console.log("Bump:", bump);

    // Try to initialize PDA (starts at 0) - handle case where it already exists
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
      console.log("PDA already exists, continuing with updates...");
    }

    // Fetch initial state
    let stateAcc = await program.account.state.fetch(statePda);
    console.log("After PDA init: count =", stateAcc.count.toString());
    expect(stateAcc.count.toNumber()).to.equal(0);

    // First PDA update: 0 → 1
    await program.methods
      .updatePda()
      .accounts({
        state: statePda,
        payer: payer.publicKey,
      })
      .rpc();

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

    stateAcc = await program.account.state.fetch(statePda);
    console.log("After 3rd PDA update: count =", stateAcc.count.toString());
    expect(stateAcc.count.toNumber()).to.equal(3);
  });
});
