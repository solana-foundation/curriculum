# Week 1: Environment Setup and Introduction to @solana/kit and Kit Plugins

## Overview

This week covers modern Solana web development using `@solana/kit` with the kit plugin architecture (`@solana/kit-plugin-rpc`, `@solana/kit-plugin-signer`). Topics include development environment setup, course structure overview, and composing plugin clients with `createClient().use(...)` as the modern, Wallet Standard-first approach to Solana development.

## Learning Objectives

Learning outcomes for this week include:

1. Set up a complete Solana development environment with Node.js, pnpm, and Git
2. Configure and run example projects built on kit plugins
3. Understand the advantages of the plugin architecture and the Wallet Standard-first approach
4. Create a basic plugin client using `createClient()` from `@solana/kit` with `.use(...)`
5. Query blockchain data using the RPC plugin's methods

## Lessons

### Lesson 1: Development Environment Setup

**Topics Covered:**

- Installing Node.js (v18+), pnpm, and Git
- Setting up Solana CLI and creating a file system wallet
- Installing `@solana/kit` and kit plugins (`@solana/kit-plugin-rpc`, `@solana/kit-plugin-signer`)
- Understanding modern Solana project structure
- Running example applications built on plugin clients

**Lab Exercise:**

- Set up development environment with Node.js, pnpm, and Solana CLI.
- Install `@solana/kit` and the RPC/signer plugins, then run an example application to verify your setup.

**Key Concepts:**

- Solana CLI tools and their purpose
- File system wallets vs hardware wallets
- Plugin composition for Solana projects
- Development cluster selection (localhost, devnet, testnet, mainnet)

### Lesson 2: Introduction to @solana/kit and Plugin Clients

**Topics Covered:**

- Why `@solana/kit`? Wallet Standard-first design and modern patterns
- Plugin clients vs legacy Web3.js comparison
- Core concepts: `createClient().use(...)`, `@solana/kit-plugin-rpc`, `@solana/kit-plugin-signer`, functional composition
- TypeScript benefits for blockchain development
- Understanding Kit's transaction message APIs

**Lab Exercise:**
Create a basic plugin client program that:

- Initializes a Solana client for devnet using `createClient().use(solanaDevnetRpc())`
- Fetches blockchain data using RPC plugin methods
- Displays cluster information
- Explores the functional composition pattern

**Key Concepts:**

- Wallet Standard and wallet discovery
- Type safety with TypeScript
- Functional programming patterns in Kit
- Plugin client architecture with `@solana/kit`

### Lesson 3: Solana Fundamentals for Web Developers

**Topics Covered:**

- Solana's account model from a frontend perspective
- Understanding transactions, instructions, and signatures
- Program Derived Addresses (PDAs) introduction
- Transaction lifecycle and confirmation strategies
- Compute units and priority fees

**Lab Exercise:**

Explore Solana fundamentals using kit plugins:

- Generate keypairs and derive addresses
- Query account information
- Understand the relationship between accounts and balances
- Practice with RPC plugin method calls

**Key Concepts:**

- Accounts vs wallets
- Lamports and SOL conversion
- Transaction anatomy
- RPC endpoints and rate limiting

## Practical Assignment

### Build a Solana Account Explorer

Create a simple web application that:

1. Connects to Solana devnet using `createClient().use(solanaDevnetRpc())` from `@solana/kit` and `@solana/kit-plugin-rpc`
2. Accepts any Solana address as input
3. Displays account information including:
   - Balance in SOL
   - Account owner
   - Executable status
   - Rent epoch
4. Shows recent transactions (bonus)

**Requirements:**

- Use the RPC plugin for all RPC calls
- Implement proper error handling
- Display loading states
- Format SOL amounts correctly (lamports to SOL)

**Implementation Guide:**

- Validate Solana addresses using Kit utilities
- Create reusable functions for account queries
- Implement proper error handling
- Format data for user display

## Additional Resources

### Required Reading

- [Solana Dev Skill — solana-foundation/solana-dev-skill](https://github.com/solana-foundation/solana-dev-skill/tree/main/skills/solana-dev)
- [@solana/kit Documentation](https://solana.com/docs/clients/official/javascript)
- [Solana Account Model](https://docs.solana.com/developing/programming-model/accounts)
- [Understanding Transactions](https://docs.solana.com/developing/programming-model/transactions)

### Supplementary Materials

- [Solana Cookbook - Getting Started](https://solanacookbook.com/getting-started/installation.html)

- **[TypeScript for Solana Development](https://solana.com/docs/clients/official/javascript)**  
  The official TypeScript/JavaScript SDK documentation for Solana, covering @solana/kit, wallet integration, and full-stack client usage.

### Practice Exercises

1. Modify the account explorer to support multiple clusters
2. Add a "copy address" button with user feedback
3. Implement address validation with helpful error messages
4. Create a cluster switcher component

## Common Issues and Solutions

### Issue: "Cannot find module '@solana/kit-plugin-rpc'"

**Solution:** Ensure `@solana/kit` and the kit plugins are properly installed in your project dependencies with `npm install @solana/kit @solana/kit-plugin-rpc @solana/kit-plugin-signer`.

### Issue: RPC rate limiting

**Solution:** Implement request throttling or use a dedicated RPC provider with higher rate limits.

### Issue: CORS errors in browser

**Solution:** Use a proxy or ensure the RPC endpoint supports CORS

## Week 1 Quiz Questions

1. What advantages do kit plugin clients offer over traditional Web3.js?
2. Explain the difference between a Solana account and a wallet
3. What is Wallet Standard and why is it important?
4. How do you convert lamports to SOL?
5. What information does `getAccountInfo` return?

## Looking Ahead

Next week covers wallet integration using kit plugin patterns, including:

- Wallet Standard discovery and connection
- Build wallet connection UI with signer plugins
- Handle multiple wallets via Wallet Standard
- Implement wallet-based authentication

_Prerequisites for next week: at least one browser wallet installed (Phantom, Solflare, or Backpack)._
