import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

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
});
