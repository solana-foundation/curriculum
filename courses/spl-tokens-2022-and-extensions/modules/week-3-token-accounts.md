# Week 3: Creating Token-2022 Mints and Accounts

## Learning Objectives

- Master Token-2022 account creation patterns
- Understand account size calculations with extensions
- Implement basic token operations (mint, transfer, burn)
- Work with Associated Token Accounts for Token-2022

## Topics Covered

- Token-2022 account structures and layouts
- Account size calculation with `getMintLen()`
- Rent exemption requirements for extended accounts
- Associated Token Account Program compatibility
- Authority management (mint, freeze, close)
- Token decimals and UI amount calculations

## Hands-on Exercises

1. **Account Size Calculator**: Build tool to calculate sizes for different extension combinations
2. **Multi-Signature Mint**: Create mint with multisig authority
3. **Token Operations Suite**: Implement mint, transfer, burn, and close operations

## Reading Assignment

- [SPL Token-2022 Extensions Guide](https://spl.solana.com/token-2022/extensions) - Account sections
- Token-2022 Rust documentation on account structures
- Solana Cookbook - Token Account Management

## Homework

- Build a comprehensive Token-2022 management CLI tool that:
  - Creates mints with configurable decimals
  - Manages multiple token accounts
  - Performs all basic operations (mint, transfer, burn)
  - Displays formatted balances with proper decimal handling
  - Includes error handling for common issues
- Create a TypeScript class wrapper for Token-2022 operations
- Write unit tests using Bankrun for all operations
- Document gas costs for each operation type
