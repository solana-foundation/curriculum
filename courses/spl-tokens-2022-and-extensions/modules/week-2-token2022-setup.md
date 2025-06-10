# Week 2: Token-2022 Environment Setup & Basics

## Learning Objectives

- Configure development environment specifically for Token-2022
- Understand Token-2022 program ID and its usage
- Create first Token-2022 mint without extensions
- Master the @solana/spl-token SDK for Token-2022

## Topics Covered

- Token-2022 Program ID: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`
- Setting up @solana/spl-token package (v0.4.0+)
- Differences in account sizes with extensions
- Basic mint creation with Token-2022
- Using the correct program ID in all operations
- Devnet vs Mainnet considerations

## Hands-on Exercises

1. **Environment Verification**: Script to verify Token-2022 is accessible
2. **Basic Mint Creation**: Create a simple Token-2022 mint via CLI
3. **SDK Setup**: Initialize a TypeScript project with Token-2022 support

## Reading Assignment

- [Getting Started with Token Extensions](https://solana.com/developers/guides/token-extensions/getting-started)
- [SPL Token CLI Reference](https://spl.solana.com/token#reference-guide)
- @solana/spl-token documentation for Token-2022

## Homework

- Create a Node.js script that:
  - Connects to devnet
  - Creates a Token-2022 mint (no extensions)
  - Creates an associated token account
  - Mints 1000 tokens
  - Displays all account information
- Document differences observed between Token and Token-2022 operations
- Set up a local validator with Token-2022 program deployed
- Create bash aliases for common Token-2022 CLI commands
