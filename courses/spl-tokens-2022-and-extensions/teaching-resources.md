# Token-2022 and Extensions: Teaching Resources

_Last updated: June 2025_  
_Compiled for university-level Token-2022 and Extensions courses_

## Primary Learning Materials

- **[Official SPL Token-2022 Documentation](https://spl.solana.com/token-2022)**  
  The authoritative source for Token-2022 program documentation. Essential for understanding all 16 extensions, implementation details, and security considerations. Updated with each new extension release.

- **[Token Extensions Getting Started Guide](https://solana.com/developers/guides/token-extensions/getting-started)**  
  Comprehensive introduction to Token-2022 with step-by-step tutorials. Perfect for students' first exposure to token extensions with practical examples.

- **[Solana Program Library Repository](https://github.com/solana-program/token-2022)**  
  Source code and examples for Token-2022 program. Critical for understanding implementation details and advanced patterns. Includes extensive test cases.

- **[Token Extensions Extension Guide](https://www.solana-program.com/docs/token-2022/extensions#:~:text=Token%2D2022-,Extension%20Guide,-Explanation%20of%20all)**  
  Detailed documentation for each of the 16 extensions. Explains use cases, implementation patterns, and compatibility considerations.

## Video Tutorials and Courses

- **[Token Extensions YouTube Playlist](https://www.youtube.com/playlist?list=PLilwLeBwGuK6imBuGLSLmzMEyj6yVHGDO)**  
  Complete video series covering each extension individually. 15–30 minute videos with live coding demonstrations. Excellent for visual learners.

## Example Projects and Code Repositories

- **[Solana Developer Content - Token Extensions](https://github.com/solana-foundation/developer-content/tree/main/content/guides/token-extensions)**  
  Official example implementations for all extensions. Each example includes detailed comments and test suites. Maintained by Solana Foundation.

- **[Program Examples - Token-2022 Directory](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022)**  
  Practical examples showing extension combinations. Demonstrates real-world patterns like stablecoins with transfer fees. Includes JavaScript and Rust versions.

- **[Transfer Hook Order Tracker Example](https://github.com/buffalojoec/transfer-hook-order-tracker)**  
  Advanced transfer hook implementation for order tracking. Shows custom program integration with Token-2022. Excellent capstone project reference.

- **[Solana Playground Token-2022 Examples](https://beta.solpg.io)**  
  Browser-based examples requiring no installation. Pre-loaded with Token-2022 templates for each extension. Perfect for classroom demonstrations.

## Security and Best Practices

- **[Neodyme Security Analysis](https://neodyme.io/en/blog/token-2022/)**  
  "Don't shoot yourself in the foot with extensions" - comprehensive security guide. Covers common vulnerabilities and mitigation strategies. Essential reading for production deployments.

- **[Halborn Token-2022 Bugfix Review](https://www.halborn.com/blog/post/solana-token-ception-token-2022-bugfix-review)**  
  Analysis of discovered vulnerabilities and their fixes. Teaches security mindset through real examples. Includes code snippets of vulnerable patterns.

- **[Security Audit Reports Collection](https://github.com/solana-labs/security-audits/tree/master/spl)**  
  Five complete security audits from leading firms. Shows professional security assessment methodology. Critical for teaching security-first development.

## Testing Frameworks and Tools

- **[SPL Token CLI Reference](https://spl.solana.com/token#reference-guide)**  
  Complete command-line interface documentation. Covers all Token-2022 specific commands and flags. Essential for hands-on exercises.

- **[Token-2022 JavaScript Client](https://solana-labs.github.io/solana-program-library/token/js/)**  
  TypeScript/JavaScript library documentation. Critical for frontend integration with Token-2022 features. Includes code examples for each extension.

- **[A Guide to Testing Solana Programs](https://www.helius.dev/blog/a-guide-to-testing-solana-programs)**

  This article explores the core types of automated testing — Unit Testing, Integration Testing, and End-to-End (E2E) Testing. It also explores writing basic unit tests in JavaScript/TypeScript and Rust before analyzing popular Solana testing frameworks. The article ends with a practical example that tests a “King of the Hill” game program.

## Development Environment Setup

- **Token-2022 Program ID Configuration**  
  `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`  
  Essential configuration for all Token-2022 programs. Different from original token program. Must be imported correctly in all implementations.

- **[@solana/spl-token Package Setup](https://www.npmjs.com/package/@solana/spl-token)**  

  `npm install --save @solana/spl-token @solana/web3.js@1`  
  Includes Token-2022 support in latest versions. Check version compatibility for extension support. Version `0.4.0+` recommended.

- **Solana CLI Token Extensions Support**  
  Built into Solana CLI `v1.17+`. Native support for all extension commands. No additional installation required. Includes helpful error messages for extension conflicts.

---
## Advanced Topics and Patterns

- **[Transfer Fee Implementation Patterns](https://spl.solana.com/token-2022/extensions#transfer-fees)**  
  Detailed guide for percentage-based and fixed fee structures. Includes withdrawal authority patterns. Critical for DeFi integration.

- **[Understanding and Implementing SOL Transfers with Program-Derived Addresses in Solana](https://coinsbench.com/understanding-and-implementing-sol-transfers-with-program-derived-addresses-in-solana-8e95841a4029)**

  - How to implement SOL transfers from PDAs in Solana programs
  - Why PDAs with data cannot use standard transfer methods
  - Alternative approaches for transferring SOL from data-bearing PDAs
  - Best practices for handling SOL balances and transfers in your programs

- **Confidential Transfer Architecture**  
  Coming Q1 2025 with Agave 2.0. Zero-knowledge proof integration for private transfers. Theory and preparation materials available. Important for privacy-focused applications.

- **Interest-Bearing Token Mathematics**  
  Continuous compounding implementation details. Fixed-point arithmetic considerations. Rate calculation examples. Essential for DeFi and yield-bearing tokens.

- **Metadata and Metadata Pointer Patterns**  
  On-chain vs off-chain metadata strategies. URI resolution and update patterns. NFT metadata integration. Key for rich token experiences.

## Community and Support Resources

- **[Solana Tech Discord - Token-2022 Channel](https://discord.gg/solana)**  
  Dedicated channel with 145,000+ member community. Direct access to Token-2022 developers. Quick support for implementation questions.

- **[Solana Stack Exchange Token-2022 Tag](https://solana.stackexchange.com/questions/tagged/token-2022)**  
  Growing collection of Q&A specific to extensions. Well-documented solutions to common problems. Good for troubleshooting exercises.

- **Token Extensions Working Group**  
  Monthly community calls. Open to educators and developers. Roadmap updates and feedback sessions. Networking with other instructors.

## Assessment and Project Resources

- **[School of Solana Token Module](https://ackee.xyz/school-of-solana)**  
  Free course with Token-2022 specific module. NFT certification on completion. 700+ developers trained with proven curriculum.

- **Token Extension Implementation Checklist**  
  - Create basic SPL token  
  - Add single extension (transfer fee recommended)  
  - Combine compatible extensions  
  - Implement transfer hook logic  
  - Deploy to devnet with tests

## Specialized Topics for Capstone Projects

- **Stablecoin Implementation Guide**  
  Paxos USDP case study ($360M+ market cap). Combines permanent delegate and compliance features. Real-world regulatory considerations. Template for institutional tokens.

- **NFT Ticketing with Extensions**  
  - Non-transferable for soulbound tickets  
  - Transfer hooks for attendance tracking  
  - Metadata for event information  
  - Time-based features for expiration

- **[DeFi Protocol Integration – Raydium Docs](https://docs.raydium.io/raydium/updates/token-2022-support)**  
  AMM considerations for extended tokens. Liquidity pool compatibility patterns.

- **Cross-Program Invocation with Extensions**  
  Special considerations for CPI with Token-2022. Account size calculations for extensions. Program derived address patterns. Critical for composable protocols.

## Career and Industry Resources

- **Enterprise Adoption Examples**  
  Visa and Mastercard Token-2022 initiatives. PayPal USD implementation analysis. Corporate bond tokenization patterns. CBDC prototype implementations.

- **2024 Hackathon Winners Using Token-2022**  
  - Reflect: Hedge-backed stablecoin platform  
  - Ore: Proof-of-work currency with extensions  
  - FluxBot: AI-powered token interactions  
  - Prize pools and implementation details

- **Job Market for Token-2022 Skills**  
  Growing demand for extension expertise. Premium salaries for security-aware developers. Institutional DeFi opportunities. Compliance-focused positions.

## Documentation and Reference Tools

- **[Token-2022 Rust Documentation](https://docs.rs/spl-token-2022/latest/spl_token_2022/)**  
  Complete Rust API reference. Low-level implementation details. Essential for program developers.

- **Extension Instruction Reference**  
  - Comprehensive list of all instructions  
  - Required accounts for each operation  
  - Compute unit costs per instruction  
  - Error code explanations

- **Token-2022 Account Structure Guide**  
  - Base account plus extension data layout  
  - Size calculation formulas  
  - Rent exemption requirements  
  - Serialization formats

## Deployment and Production Resources

- **Mainnet Migration Checklist**  
  - Security audit completion  
  - Extension compatibility verification  
  - Compute budget optimization  
  - Upgrade authority configuration

- **Token Migration Patterns**  
  - Original SPL to Token-2022 migration  
  - Liquidity preservation strategies  
  - User communication templates  
  - Snapshot and airdrop patterns

- **Program Upgrade Considerations**  
  - Extension immutability rules  
  - Safe upgrade patterns  
  - Authority transfer procedures  
  - Emergency response planning

## Performance and Optimization

- **Extension Compute Costs**  
  - Base token operations: ~3,000 CU  
  - Transfer with fee: ~15,000 CU  
  - Transfer hook execution: Variable  
  - Optimization strategies included

- **Account Size Optimization**  
  - Minimum sizes per extension combination  
  - Dynamic allocation patterns  
  - Rent calculation examples  
  - Storage cost projections

## Supplementary Learning Platforms

- **[QuickNode Token-2022 Guide Series](https://www.quicknode.com/guides/solana-development/anchor/token-2022)**  
  Integration with Anchor framework. Step-by-step implementation guides. Infrastructure considerations covered.

- **[CryptoDataBytes Token Extensions Analysis](https://read.cryptodatabytes.com/p/a-guide-to-solana-token2022-token)**  
  Economic analysis of extension impacts. Market dynamics and adoption patterns. Strategic implementation decisions.

- **101 Blockchains Token-2022 Overview**  
  - Alternative teaching perspective  
  - Business-focused explanation  
  - Use case prioritization  
  - ROI calculations for extensions

## Teaching Tools and Utilities

- **Token Extension Explorer**  
  Built into Solana Explorer. Visual representation of active extensions. Account inspection for education. Transaction decoding with extensions.

- **Compute Unit Calculator for Extensions**  
  Integrated into Explorer transactions. Shows exact costs per extension. Helps optimize implementations. Critical for production planning.

---

_Last updated: June 2025_  
_Compiled for university-level Token-2022 and Extensions courses_
