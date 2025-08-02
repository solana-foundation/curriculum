# Week 1: Environment Setup and Introduction to Gill

## Overview

This week covers modern Solana web development using the `gill` library and `wallet-ui` examples. Topics include development environment setup, course structure overview, and working with gill as a lightweight alternative to Web3.js.

## Learning Objectives

Learning outcomes for this week include:

1. Set up a complete Solana development environment with Node.js, pnpm, and Git
2. Configure and run the wallet-ui example projects
3. Understand gill's advantages over traditional Web3.js
4. Create a basic Solana client using gill
5. Query blockchain data using gill's RPC methods

## Lessons

### Lesson 1: Development Environment Setup

**Topics Covered:**

- Installing Node.js (v18+), pnpm, and Git
- Setting up Solana CLI and creating a file system wallet
- Cloning and exploring the wallet-ui repository
- Understanding Turborepo/monorepo structure
- Running wallet-ui examples

**Lab Exercise:**

- Set up development environment with Node.js, pnpm, and Solana CLI. 
- Clone and explore the wallet-ui repository to understand the project structure and run example applications.

**Key Concepts:**

- Solana CLI tools and their purpose
- File system wallets vs hardware wallets
- Monorepo benefits for Solana projects
- Development cluster selection (localhost, devnet, testnet, mainnet)

### Lesson 2: Introduction to Gill Library

**Topics Covered:**

- Why gill? Modern JavaScript patterns and tree-shaking
- Gill vs Web3.js comparison
- Core gill concepts: `SolanaClient`, RPC methods, functional composition
- TypeScript benefits for blockchain development
- Understanding gill's pipe pattern

**Lab Exercise:**
Create a basic gill program that:

- Initializes a Solana client for devnet
- Fetches blockchain data using RPC methods
- Displays cluster information
- Explores the functional composition pattern

**Key Concepts:**

- Tree-shaking and bundle size optimization
- Type safety with TypeScript
- Functional programming patterns in gill
- RPC client architecture

### Lesson 3: Solana Fundamentals for Web Developers

**Topics Covered:**

- Solana's account model from a frontend perspective
- Understanding transactions, instructions, and signatures
- Program Derived Addresses (PDAs) introduction
- Transaction lifecycle and confirmation strategies
- Compute units and priority fees

**Lab Exercise:**

Explore Solana fundamentals using gill:

- Generate keypairs and derive addresses
- Query account information
- Understand the relationship between accounts and balances
- Practice with RPC method calls

**Key Concepts:**

- Accounts vs wallets
- Lamports and SOL conversion
- Transaction anatomy
- RPC endpoints and rate limiting

## Practical Assignment

### Build a Solana Account Explorer

Create a simple web application that:

1. Connects to Solana devnet using gill
2. Accepts any Solana address as input
3. Displays account information including:
   - Balance in SOL
   - Account owner
   - Executable status
   - Rent epoch
4. Shows recent transactions (bonus)

**Requirements:**

- Use gill for all RPC calls
- Implement proper error handling
- Display loading states
- Format SOL amounts correctly (lamports to SOL)

**Implementation Guide:**

- Validate Solana addresses using gill utilities
- Create reusable functions for account queries
- Implement proper error handling
- Format data for user display

## Additional Resources

### Required Reading

- [Gill Library Documentation](https://github.com/solana-foundation/gill)
- [Solana Account Model](https://docs.solana.com/developing/programming-model/accounts)
- [Understanding Transactions](https://docs.solana.com/developing/programming-model/transactions)

### Supplementary Materials

- [Solana Cookbook - Getting Started](https://solanacookbook.com/getting-started/installation.html)

- **[TypeScript for Solana Development](https://solana.com/docs/clients/javascript)**  
  The official TypeScript/JavaScript SDK documentation for Solana, covering @solana/web3.js, wallet integration, and full-stack client usage. 

### Practice Exercises

1. Modify the account explorer to support multiple clusters
2. Add a "copy address" button with user feedback
3. Implement address validation with helpful error messages
4. Create a cluster switcher component

## Common Issues and Solutions

### Issue: "Cannot find module 'gill'"

**Solution:** Ensure gill is properly installed in your project dependencies.

### Issue: RPC rate limiting

**Solution:** Implement request throttling or use a dedicated RPC provider with higher rate limits.

### Issue: CORS errors in browser

**Solution:** Use a proxy or ensure the RPC endpoint supports CORS

## Week 1 Quiz Questions

1. What advantages does gill offer over traditional Web3.js?
2. Explain the difference between a Solana account and a wallet
3. What is the purpose of the `pipe` function in gill?
4. How do you convert lamports to SOL?
5. What information does `getAccountInfo` return?

## Looking Ahead

Next week covers wallet integration using the wallet-ui patterns, including:

- Set up wallet providers
- Build wallet connection UI
- Handle multiple wallet adapters
- Implement wallet-based authentication

_Prerequisites for next week: at least one browser wallet installed (Phantom, Solflare, or Backpack)._