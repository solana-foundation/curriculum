# SPL Tokens: Token-2022 and Extensions

## Overview

This course provides an in-depth exploration of the SPL Token program on Solana, with a strong emphasis on the modern Token-2022 standard (often referred to as Token Extensions) and its advanced functionalities. The primary goal is to equip learners with the knowledge and skills to create, manage, and interact with sophisticated token features beyond basic fungible and non-fungible tokens.

The course focuses on practical application, guiding students through the nuances of Token-2022 extensions such as transfer fees, interest-bearing tokens, non-transferable tokens, transfer hooks, metadata pointers, and confidential transfers. The final project involves building an NFT-Gated Content Access Program, applying these learned concepts.

## Learning Objectives

- Understand the differences and advantages of SPL Token-2022 over the original SPL Token program.
- Create and manage Token-2022 mints and associated token accounts.
- Implement and interact with various Token-2022 extensions, including:
  - Transfer Hooks for custom transfer logic.
  - Permanent Delegates for specific operational authority.
  - Transfer Fees for on-chain royalty or fee collection.
  - Interest-Bearing Tokens for native yield.
  - Non-Transferable Tokens for soul-bound or identity use cases.
  - Metadata Pointers and On-chain Metadata.
  - Confidential Transfers for privacy-preserving transactions.
- Perform Cross-Program Invocations (CPIs) to the SPL Token and Token-2022 programs.
- Manage and update token metadata effectively using on-chain mechanisms.
- Design and build a practical application (NFT-gated access) utilizing Token-2022 features.

## Prerequisites

- Solid understanding of Rust programming.
- Firm grasp of Solana blockchain fundamentals (accounts, transactions, programs).
- Experience with basic SPL Token interactions (creating mints, token accounts, transfers).
- Familiarity with the Anchor framework is highly recommended.
- Conceptual understanding of Non-Fungible Tokens (NFTs).

## Course Outline

1.  **Introduction to SPL Token Standards:**
    - Overview of the original SPL Token program.
    - Introduction to Token-2022 (Token Extensions) and its motivations.
    - Key differences and benefits of Token-2022.
2.  **Working with Token-2022 Basics:**
    - Setting up the environment for Token-2022 development.
    - Creating Token-2022 compliant mints.
    - Initializing token accounts for Token-2022.
    - Basic minting, transferring, and burning operations.
3.  **Exploring Token-2022 Extensions (Selection):**
    - **Transfer Hooks:** Implementing custom logic on token transfers.
    - **Transfer Fees:** Configuring and collecting fees on transfers.
    - **Interest-Bearing Tokens:** How tokens can accrue interest natively.
    - **Non-Transferable Tokens:** Creating tokens that cannot be moved after issuance.
    - **Metadata:** Utilizing `MetadataPointer` and on-chain metadata with `TokenMetadata` interface.
    - **Confidential Transfers (Overview):** Understanding the principles of private transactions with ZK proofs.
    - **Permanent Delegate:** Granting enduring permissions for specific actions.
    - Other extensions as relevant (e.g., Default Account State, CPI Guard).
4.  **Interacting with Token-2022 via CPIs:**
    - Constructing CPIs to the Token-2022 program from an Anchor program.
    - Handling accounts and instruction data for various extension-related instructions.
5.  **Project: NFT-Gated Content Access Program:**
    - Designing the system: an NFT collection (Token-2022 based) acts as a key.
    - Implementing a program that checks for NFT ownership (from the specific collection) to grant access.
    - Utilizing Token-2022 features (e.g., metadata for verification, transfer hooks for logging access).
    - Client-side interaction to demonstrate gated access.

## Target Audience

This course is ideal for individuals with some experience in Rust and a basic grasp of Solana's account model and SPL Token fundamentals, who are eager to dive deep into Token-2022 and its extensions. It suits learners looking to implement sophisticated tokenomics and significantly advance their Solana tokenization capabilities.

- **Level:** Intermediate.
