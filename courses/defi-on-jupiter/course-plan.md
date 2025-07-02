# DeFi on Jupiter: Building with Solana’s Premier DEX Aggregator

## Overview

Jupiter is a decentralized exchange (DEX) aggregator and a cornerstone of DeFi on the Solana blockchain. By aggregating liquidity from multiple Solana-based DEXs like Raydium, Orca, and Serum, Jupiter ensures optimal token swap rates, minimal slippage, and low transaction fees, leveraging Solana’s high-speed, low-cost infrastructure. This course equips developers with the skills to integrate Jupiter’s powerful APIs and toolkits into their applications, enabling seamless token swaps, custom orders, and monetized trade flows. Through hands-on projects, learners will build practical DeFi solutions using Jupiter’s Ultra API, Swap API, Trigger & Recurring API, and open-source toolkits.

## Learning Objectives

- Rapidly onboard to Solana and Jupiter using the Ultra API
- Understand Jupiter’s programs and their capabilities
- Query and manage SPL Tokens using Token & Price APIs
- Execute token swaps with the Swap API
- Create and deploy limit and recurring orders using Trigger & Recurring APIs
- Monetize applications through Jupiter’s integrator fees
- Leverage open-source toolkits like Terminal and Unified Wallet Kit
- Master advanced swap parameterization and on-chain program interactions

## Prerequisites

- Solid understanding of JavaScript ES6+ and basic TypeScript
- Basic knowledge of REST APIs and asynchronous programming
- Familiarity with Solana’s programs, instructions, accounts, and transactions
- Knowledge of creating and deploying a program on Solana
- Understanding of how to build and send Solana transactions
- General understanding of blockchain concepts is helpful but not required

## Course Outline

The course covers the following key areas, culminating in a comprehensive project:

### 1. Quick Start with Solana and Jupiter (Ultra API)

- Setting up a Solana and Jupiter development environment
- Performing token swaps via the Ultra API
- Querying wallet balances
- Searching for tokens in the Solana ecosystem
- Conducting token security checks with the Shield API

### 2. Introduction to Jupiter Programs

- Overview of Jupiter’s API suite and their use cases
- Configuring the development environment for Jupiter APIs
- Building and sending transactions
- Understanding priority fees and slippage in DeFi transactions

### 3. SPL Token Management (Token & Price API)

- Exploring the history and structure of Solana’s token ecosystem
- Querying specific token details
- Filtering tokens by various parameters
- Verifying custom tokens (optional)
- Retrieving token prices and understanding API limitations

### 4. Token Swaps (Swap API)

- Understanding the swap process and flow
- Fetching quotes for token swaps
- Retrieving and signing transactions for swaps using RPC
- Implementing best practices for swap execution

### 5. Limit and Recurring Orders (Trigger & Recurring API)

- Exploring limit orders and recurring strategies
- Setting up and deploying limit orders
- Configuring recurring order strategies
- Applying best practices for order management

### 6. Advanced Swap Parameterization (Swap & Swap Instructions API, CPI)

- Deep dive into Quote API parameters
- Configuring Swap API parameters for custom use cases
- Building transactions with swap instructions
- Interacting with Jupiter’s swap aggregator via on-chain programs

### 7. Monetizing Applications (Integrator Fees)

- Understanding Jupiter’s referral program
- Creating referral accounts and token accounts
- Adding fees to transactions across APIs
- Claiming earned fees

### 8. Open-Source Toolkits (Terminal & Unified Wallet Kit)

- Exploring Jupiter’s Terminal and Unified Wallet Kit
- Integrating the Terminal into applications with minimal code
- Implementing the Unified Wallet Kit for seamless wallet connectivity

## Target Audience

This course is designed for intermediate web developers and hackathon builders eager to integrate real token swaps, custom orders, or monetized trade flows into Solana applications. It’s ideal for developers with JavaScript/TypeScript experience looking to leverage Jupiter’s liquidity aggregation with minimal backend effort. The hands-on approach ensures practical skills for building DeFi solutions on Solana.

- **Level:** Intermediate (in web development), Beginner to Intermediate (in blockchain)
- **Focus:** Practical DeFi integration, Jupiter APIs, and production-ready patterns

## Assignments

### Foundation Assignments

1. **Environment Setup:** Configure a Solana and Jupiter development environment
2. **Ultra API Swap:** Perform a token swap using the Ultra API
3. **Token Explorer:** Build a token search and balance viewer

### Interaction Assignments

1. **Swap Quote Builder:** Create a tool to fetch and display swap quotes
2. **Transaction Flow:** Implement a signed transaction flow with RPC
3. **Token Price Tracker:** Build a real-time token price viewer

### Advanced Assignments

1. **Limit Order Setup:** Deploy a limit order using Trigger API
2. **Recurring Strategy:** Implement a recurring order strategy
3. **Referral Fee Integration:** Add and claim integrator fees in a transaction

### Major Project

1. **Final Project:** Build a clone of jup.ag, integrating Ultra API, Swap API, Trigger & Recurring API, and open-source toolkits for token swaps, order management, and monetization

## Resources

### Core Documentation
- [Jupiter Docs](https://docs.jup.ag) - Comprehensive API reference
- [Solana RPC API Documentation](https://docs.solana.com/api/http) - For transaction and account queries
- [Jupiter Terminal](https://github.com/jup-ag/terminal) - Open-source swap interface toolkit
- [Unified Wallet Kit](https://github.com/jup-ag/wallet-kit) - Wallet integration toolkit