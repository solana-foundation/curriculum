# Week 1: Anchor Framework Introduction and Workspace Setup

## Learning Objectives

- Understand the role of Anchor in Solana program development
- Set up a complete Anchor development environment
- Create and structure an Anchor workspace
- Write your first Anchor program (counter example)
- Understand Anchor's IDL generation and type safety benefits

## Topics Covered

- Anchor framework overview and advantages over native Solana programs
- Development environment setup (Rust, Solana CLI, Anchor CLI)
- Workspace structure and configuration files
- Program modules and organization patterns
- IDL (Interface Definition Language) generation
- Basic Anchor program anatomy: `lib.rs`, `Cargo.toml`, `Anchor.toml`
- Introduction to Anchor macros: `#[program]`, `#[derive(Accounts)]`, `#[account]`

## Hands-on Exercises

1. **Environment Setup**: Install and configure Rust, Solana CLI, and Anchor CLI
2. **First Anchor Project**: Initialize workspace with `anchor init` command
3. **Counter Program**: Build a simple counter program with increment/decrement functionality
4. **IDL Exploration**: Examine generated IDL and understand its structure
5. **Testing Setup**: Run basic tests using Anchor's testing framework

## Reading Assignment

- [Anchor Installation Guide](https://www.anchor-lang.com/docs/installation)
- [Solana Developer Documentation - Introduction](https://solana.com/docs)
- [Anchor vs Native Solana Programs](https://www.helius.dev/blog/an-introduction-to-anchor-a-beginners-guide-to-building-solana-programs)

## Homework

- Complete environment setup and verify all tools are working correctly
- Build and deploy the counter program to localnet
- Explore the Solana Playground and run through basic examples
- Create a simple "Hello World" program that stores and retrieves a greeting message
- Document common setup issues encountered and their solutions
- Read through the official Anchor examples repository to familiarize yourself with project structure

## Resources

- [Solana Playground](https://beta.solpg.io/) - Browser-based IDE for testing
- [Anchor Examples](https://github.com/solana-developers/program-examples)
- [VS Code Anchor Extension](https://marketplace.visualstudio.com/items?itemName=Ayushh.vscode-anchor)
