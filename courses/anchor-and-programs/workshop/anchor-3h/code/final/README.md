# Anchor 3h Workshop — Finalized Reference Code & Presenter Prep

**Deeply Commented, Pedagogically Structured Reference Implementation**

This directory contains the finalized reference code for the Solana Foundation's Anchor & dApp 3-Hour Workshop. These files provide comprehensive, deeply commented implementations designed for self-study, pre-session preparation, and consistent delivery quality across instructors worldwide.

## Purpose & Audience

### **Primary Audience**
- **Workshop Facilitators**: Instructors preparing to deliver the 3-hour Anchor workshop
- **Self-Learners**: Developers studying Anchor concepts independently
- **Code Reviewers**: Foundation staff ensuring educational content quality

### **Secondary Audience**
- **Post-Workshop Reference**: Participants reinforcing concepts after live sessions
- **Curriculum Developers**: Teams creating related educational materials

### **What This Provides**
- **Complete Logic Understanding**: Every line of code explained with technical precision
- **Conceptual Mapping**: Clear connections between code and Anchor framework concepts
- **Teaching Support**: Structured commentary that supports effective instruction
- **Quality Assurance**: Verified implementations that align with official documentation

## File-by-File Overview

### **`lib.rs` - Program Logic Reference**
**Purpose**: Core Solana program implementation with comprehensive technical commentary

**Key Learning Areas**:
- **Program Module Structure**: How `#[program]` creates instruction handlers
- **Account Management**: Traditional accounts vs. Program Derived Addresses (PDAs)
- **Constraint Validation**: `init`, `mut`, `payer`, `space` constraints explained
- **PDA Mechanics**: Seed derivation, bump validation, deterministic addressing
- **Context Objects**: `Context<T>` pattern and type-safe account access
- **Error Handling**: Overflow protection and security considerations

**Teaching Value**: Instructors can reference specific lines to explain Anchor concepts during live coding sessions.

### **`counter.ts` - Test Suite Reference**
**Purpose**: Comprehensive test implementation demonstrating client-side program interaction

**Key Learning Areas**:
- **Provider Setup**: `AnchorProvider.env()` and workspace configuration
- **Program Instantiation**: Type-safe program access with auto-generated types
- **Data Derivation**: Keypair generation and PDA derivation patterns
- **Instruction Execution**: Method calls, account passing, RPC transactions
- **State Verification**: Account fetching, assertions, and logging patterns
- **Error Resilience**: Try-catch blocks and test robustness

**Teaching Value**: Shows how tests validate program functionality and demonstrate expected behavior.

### **`callProgram.ts` - Client Integration Reference**
**Purpose**: Minimal client script demonstrating real-world frontend interaction patterns

**Key Learning Areas**:
- **Client Setup**: Provider configuration and wallet connection
- **IDL Usage**: Program instantiation using Interface Definition Language
- **PDA Operations**: Client-side PDA derivation and management
- **State Management**: Account fetching and manual data parsing
- **Error Handling**: Graceful failure management and user experience
- **Frontend Patterns**: How this translates to React, Vue, or other frameworks

**Teaching Value**: Bridges the gap between program logic and real-world application development.

## 5-Minute Presenter Prep

### **Pre-Session Checklist**
- [ ] **Environment Verified**: Solana CLI ≥1.18, Anchor ≥0.30, Rust stable, Node.js ≥16
- [ ] **Localnet Running**: `solana-test-validator --reset --quiet` active
- [ ] **Program Deployed**: Counter program deployed to localnet with correct program ID
- [ ] **Dependencies Installed**: All `yarn install` commands completed successfully
- [ ] **Tests Passing**: `anchor test` runs without errors

### **Key Teaching Points**
1. **PDA Fundamentals**: Emphasize deterministic addressing and seed management
2. **Account Constraints**: Explain how Anchor validates account states
3. **Client Integration**: Show how IDL enables type-safe program interaction
4. **Error Patterns**: Demonstrate common failure modes and recovery strategies

### **Common Questions & Answers**
- **Q**: "Why use PDAs instead of regular accounts?"
- **A**: PDAs provide deterministic addressing, program ownership, and eliminate key management complexity.

- **Q**: "How does Anchor generate client methods?"
- **A**: The IDL (Interface Definition Language) is generated during build and provides type-safe client methods.

- **Q**: "What happens if a PDA already exists?"
- **A**: The program handles this gracefully with proper error handling and account reuse patterns.

## Localnet vs Devnet

### **Localnet (Recommended for Workshops)**
```bash
# Start validator
solana-test-validator --reset --quiet

# Deploy program
anchor deploy

# Run tests
anchor test

# Execute client
cd client && yarn start
```

### **Devnet (Production-Like Environment)**
```bash
# Configure for devnet
solana config set --url devnet

# Deploy program
anchor deploy

# Run tests (requires devnet SOL)
anchor test

# Execute client (requires devnet configuration)
cd client && ANCHOR_PROVIDER_URL=https://api.devnet.solana.com yarn start
```

## Troubleshooting

### **Program ID Mismatch**
**Symptoms**: `DeclaredProgramIdMismatch` error during deployment
**Solution**: Ensure `declare_id!` in `lib.rs` matches the program ID in `Anchor.toml`

### **Localnet Validator Issues**
**Symptoms**: Connection refused, RPC errors
**Solution**: 
```bash
# Kill existing validator
pkill solana-test-validator

# Start fresh validator
solana-test-validator --reset --quiet
```

### **IDL Sync Problems**
**Symptoms**: Client can't find program methods
**Solution**:
```bash
# Rebuild and redeploy
anchor build
anchor deploy

# Copy IDL to client
cp target/idl/counter.json client/counter.json
```

### **Account Already Exists**
**Symptoms**: `Account already in use` errors
**Solution**: This is expected behavior - the program handles existing accounts gracefully

### **Dependency Issues**
**Symptoms**: `ts-mocha not found`, build failures
**Solution**:
```bash
# Install dependencies in all directories
cd counter && yarn install
cd ../client && yarn install
```

## Official Resources

### **Core Documentation**
- **[Anchor Book](https://book.anchor-lang.com/)**: Official Anchor framework documentation
- **[Solana Docs](https://docs.solana.com/)**: Core Solana blockchain documentation
- **[Solana Cookbook](https://solanacookbook.com/)**: Practical examples and patterns

### **Security & Best Practices**
- **[Sealevel Attacks](https://github.com/coral-xyz/sealevel-attacks)**: Security vulnerability analysis
- **[Anchor Security](https://book.anchor-lang.com/security/)**: Framework-specific security guidance

### **Community Resources**
- **[Solana Discord](https://discord.gg/solana)**: Real-time community support
- **[Anchor GitHub](https://github.com/coral-xyz/anchor)**: Source code and issue tracking

---

**This reference implementation ensures consistent, high-quality delivery of Anchor concepts across all workshop sessions. Use these files to prepare for instruction and provide participants with comprehensive post-workshop reference materials.**
