# Anchor 3-Hour Workshop - Live Scaffold

**PDA Integration + IDL-Based Client Interaction**

Welcome to the live coding scaffold for the 3-Hour Solana Anchor & dApp Workshop! This is your hands-on environment where we'll build upon the 1-hour counter program and add powerful PDA (Program Derived Address) functionality with real client interaction.

## 🎯 What's New in 3h vs 1h

### **PDA Mastery**
- **Deterministic Addresses**: Learn how PDAs create predictable, program-controlled accounts
- **Seed Management**: Master the art of crafting seeds for unique PDA derivation
- **Bump Validation**: Understand how bumps ensure PDA uniqueness and security

### **Client Integration**
- **IDL-Based Interaction**: Use generated Interface Definition Language for type-safe program calls
- **Real dApp Patterns**: Experience how frontend applications communicate with Solana programs
- **State Management**: Fetch and display on-chain data in your client applications

### **Production-Ready Concepts**
- **Account Validation**: Proper PDA constraints and ownership checks
- **Error Handling**: Robust client-side error management
- **Type Safety**: Leverage TypeScript for bulletproof program interactions

## 🚀 Quick Start

### Prerequisites
- **Solana CLI**: `solana --version ≥ 1.18`
- **Anchor Framework**: `anchor --version ≥ 0.30`
- **Rust**: `rustc stable`
- **Node.js**: `node --version ≥ 16`

### Verify Your Setup
Before starting, run these commands to ensure everything is ready:

```bash
# Check Solana version (should be ≥ 1.18)
solana --version

# Check Anchor version (should be ≥ 0.30)  
anchor --version

# Check Rust version
rustc --version

# Check Node.js version (should be ≥ 16)
node --version
```

**If any command fails or shows an outdated version, please install/update before proceeding.**

### Pre-flight Checklist
```bash
# 1. Set up localnet (if not running)
solana-test-validator --reset --quiet &

# 2. Configure for localnet
solana config set --url localhost

# 3. Verify localnet is running
solana cluster-version
```

## 🏗️ Workshop Structure

### **Hour 1-2: Program Development**
Building on the 1h counter program (if you haven't completed it, see the [1h Workshop](../anchor-1h/) first), we'll extend it with PDA functionality:

```rust
// TODO: Add PDA state account
#[account]
pub struct State {
    pub count: u64,
}

// TODO: Implement PDA initialization
pub fn initialize_pda(ctx: Context<InitializePda>) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.count = 0;
    Ok(())
}

// TODO: Add PDA update functionality
pub fn update_pda(ctx: Context<UpdatePda>) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.count = state.count.checked_add(1).unwrap();
    Ok(())
}
```

### **Hour 3: Client Integration**
We'll build a minimal client that interacts with our PDA program:

```typescript
// TODO: Derive PDA using findProgramAddressSync
const [statePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("state"), payer.publicKey.toBuffer()],
  program.programId
);

// TODO: Initialize PDA from client
await program.methods
  .initializePda()
  .accounts({
    state: statePda,
    payer: payer.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

## 🛠️ Build & Deploy

### **Step 1: Build the Program**
```bash
# From the code/ directory:
cd counter
anchor build
```

**Expected Output:**
```
Finished `release` profile [optimized] target(s) in X.XXs
```

### **Step 2: Deploy to Localnet**
```bash
anchor deploy
```

**Expected Output:**
```
Program Id: [YOUR_PROGRAM_ID] (will be different for each deployment)
Deploy success
```

### **Step 3: Run Tests**
```bash
anchor test
```

**Expected Output:**
```
✅ initialize → increment → fetch
✅ PDA: derive → initialize → update → fetch
```

## 🖥️ Client Demo

### **Step 1: Install Dependencies**
```bash
# From the code/ directory:
cd client
yarn install
```

### **Step 2: Run Client Script**
```bash
ANCHOR_PROVIDER_URL=http://localhost:8899 ANCHOR_WALLET=~/.config/solana/id.json yarn ts-node callProgram.ts
```

**Expected Output:**
```
🚀 Starting Anchor 3h Workshop Client Demo
==========================================
📋 Program ID: [YOUR_PROGRAM_ID]
👤 Payer: [YOUR_WALLET_ADDRESS]
🔑 Derived PDA: [YOUR_PDA_ADDRESS]
📊 Bump: [YOUR_BUMP_VALUE]

📝 Initializing PDA...
✅ PDA initialized! Count = 0

📈 Updating PDA (1st time)...
✅ PDA updated! Count = 1

📈 Updating PDA (2nd time)...
✅ PDA updated! Count = 2

📈 Updating PDA (3rd time)...
✅ PDA updated! Count = 3

🎉 Client demo completed successfully!
📊 Final PDA state: count = 3
🔗 PDA address: [YOUR_PDA_ADDRESS]
```

## ✅ Workshop Completion Checklist

Mark these off as you complete them:

- [ ] Program builds successfully (`anchor build`)
- [ ] Program deploys to localnet (`anchor deploy`)
- [ ] All tests pass (`anchor test`)
- [ ] Client script runs successfully
- [ ] You can explain PDA derivation
- [ ] You understand IDL-based client interaction
- [ ] You can modify the PDA seeds and see the address change

## 🎓 Learning Outcomes

By the end of this workshop, you'll understand:

### **PDA Fundamentals**
- **Deterministic Derivation**: How seeds create predictable addresses
- **Bump Management**: Why bumps matter for PDA uniqueness
- **Account Constraints**: Proper validation in Anchor contexts

### **Client Integration**
- **IDL Usage**: Type-safe program interaction patterns
- **State Fetching**: Reading on-chain data efficiently
- **Error Handling**: Robust client-side error management

### **dApp Architecture**
- **Program-Client Communication**: How frontends interact with programs
- **State Management**: Managing application state across the blockchain
- **Production Patterns**: Real-world development practices

## 🔧 Troubleshooting

### **Program ID Mismatch**
If you see `DeclaredProgramIdMismatch` errors:
```bash
# Update the program ID in lib.rs
declare_id!("YOUR_ACTUAL_PROGRAM_ID");

# Update Anchor.toml
[programs.localnet]
counter = "YOUR_ACTUAL_PROGRAM_ID"
```

### **Localnet Validator Won't Start**
```bash
# Kill any existing validator
pkill solana-test-validator

# Start fresh
solana-test-validator --reset --quiet &

# Verify it's running
solana cluster-version
```

### **Client Connection Issues**
If the client can't connect:
```bash
# Verify localnet is running
solana cluster-version

# Check wallet configuration
solana config get

# Ensure you're on localnet
solana config set --url localhost
```

### **Yarn Install Fails**
```bash
# Clear cache and retry
yarn cache clean
yarn install

# If still failing, try npm
npm install
```

### **Program Deploys But Tests Fail**
```bash
# Check if program is actually deployed
solana program show [YOUR_PROGRAM_ID]

# Redeploy if needed
anchor deploy

# Run tests again
anchor test
```

### **Build Errors**
If you encounter build issues:
```bash
# Clean and rebuild
anchor clean
anchor build

# If Rust issues, update Rust
rustup update
```

### **Environment Variable Issues**
If client script fails with environment errors:
```bash
# Set environment variables explicitly
export ANCHOR_PROVIDER_URL=http://localhost:8899
export ANCHOR_WALLET=~/.config/solana/id.json

# Then run the script
yarn ts-node callProgram.ts
```

## 📚 Resources

- **[Anchor Book](https://book.anchor-lang.com/)**: Comprehensive Anchor documentation
- **[Solana Docs - PDAs](https://solana.com/docs/core/pda)**: Official PDA documentation
- **[Solana Cookbook](https://solanacookbook.com/core-concepts/pdas.html)**: Practical PDA examples
- **[1h Workshop](../anchor-1h/)**: Foundation concepts

## 🎯 Next Steps

After completing this workshop:
1. **Explore Advanced PDAs**: Multi-seed PDAs, cross-program invocations
2. **Build Full dApps**: Add React frontends, wallet integration
3. **Deploy to Mainnet**: Take your programs to production
4. **Join the Community**: Connect with other Solana developers

---

**Ready to build the future of decentralized applications? Let's dive in!** 🚀

*This scaffold is designed for live coding sessions. All commands are tested and ready to run.*
