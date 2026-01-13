# Web for Solana Development 101: Teaching Resources

## Primary Learning Materials

- **[Official Solana Documentation](https://solana.com/docs)**  
  The authoritative source for Solana development. Essential for understanding core concepts, account model, and transaction structure. Continuously updated with new features.

- **[Framework-Kit Repository](https://github.com/solana-foundation/framework-kit)**
  Modern Solana React development with `@solana/client` and `@solana/react-hooks`. Wallet Standard-first approach with comprehensive hooks and patterns for dApp development.

- **[@solana/kit Documentation](https://solana.com/docs/clients/kit)**
  The modern Solana SDK (v5.x) with Kit-native types, transaction message APIs, and functional composition patterns.

- **[Solana Cookbook](https://solanacookbook.com/)**  
  Copy-paste solutions for common Solana development patterns. Perfect for quick reference during class exercises. Covers both Web3.js and modern approaches.

- **[Anchor Book](https://book.anchor-lang.com/)**  
  Complete guide to the Anchor framework. Critical for understanding IDL generation and client-side interactions. Updated with each Anchor release.

## Video Tutorials and Courses

- **[freeCodeCamp Solana Curriculum](https://github.com/freeCodeCamp/solana-curriculum)**  
  [Mirror on freeCodeCamp](https://www.freecodecamp.org/news/solana-curriculum/)  
  Comprehensive curriculum with 10 core projects and 5 integrated projects. Self-paced with interactive exercises.

- **[60 Days of Solana by RareSkills](https://www.rareskills.io/solana-tutorial)**  
  Daily bite-sized tutorials covering all aspects of Solana development, including web-frontend lessons.

- **[Solana Blockchain Developer Bootcamp (Udemy)](https://www.udemy.com/course/solana-developer/)**  
  64.5 hours of video (Rust + JavaScript). Includes downloadable resources.

- **[Buildspace Solana Course](https://buildspace.so/)**  
  Project-based learning with community support. NFT rewards for completion.

## Example Projects and Code Repositories

- **[Solana Program Examples](https://github.com/solana-developers/program-examples)**  
  [Docs mirror](https://solana.com/docs/programs/examples)  
  Official examples with web-client implementations, maintained by Solana Foundation.

- **[dApp Scaffold](https://github.com/solana-labs/dapp-scaffold)**  
  Complete scaffolding for Solana dApps, including wallet integration and transaction examples.

- **[Next.js Solana Starter Kit](https://github.com/aeminium-labs/nextjs-solana-starter-kit)**  
  Full-stack template with TypeScript, wallet-adapter setup, and UI components.

- **[Solana Wallet Adapter + Shadcn Components](https://github.com/luigiremor/solana-wallet-adapter-base-ui-shadcn)**  
  Modern UI components using shadcn/ui for customizable wallet-connection interfaces.

## Security and Best Practices

- **[Neodyme Solana Security Course](https://neodyme.io/en/)**  
  Comprehensive security training for Solana developers.

- **[Solana Security Best Practices](https://github.com/solana-labs/security-audits)**  
  Collection of professional audit reports and guidelines.

- **Web3 Security Considerations**  
  Covered in Solana documentation — input validation, wallet-interaction hardening, rate-limiting patterns.

## Testing Frameworks and Tools

- **[Solana Playground](https://beta.solpg.io/)**  
  Browser-based IDE with pre-loaded templates for quick prototyping.

- **[Anchor Test Framework](https://www.anchor-lang.com/docs/testing)**  
  Built into Anchor CLI — supports frontend testing with simulated blockchain.

## Development Environment Setup

- **[Solana CLI Installation](https://docs.solana.com/cli/install-solana-cli-tools)**  
  Essential command-line tools for wallet management and program deployment.

- **[Node.js and Package Managers](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)**  
  Node 18+ recommended; use **npm** or **yarn**. TypeScript config templates included.

## Advanced Topics and Patterns

- **[@solana/web3-compat Documentation](https://solana.com/docs/frontend/web3-compat)**
  Boundary adapter for legacy web3.js dependencies. Use this when integrating libraries that expect web3.js types.

- **[Codama IDL Code Generation](https://github.com/codama-idl/codama)**
  Generate Kit-native TypeScript clients from program IDLs. The modern approach to type-safe program interactions.

- **[LiteSVM Testing Framework](https://github.com/LiteSVM/litesvm)**
  Fast, lightweight in-process Solana VM for unit testing. Supports Rust, TypeScript, and Python.

- **[Wallet Integration Patterns (blog)](https://blog.anishde.dev/creating-a-custom-solana-connect-wallet-ui-with-react-and-chakra-ui)**  
  Custom wallet UIs, multi-wallet strategies, and state-management best practices.

- **[Transaction Optimization](https://www.helius.dev/docs/sending-transactions/optimizing-transactions)**  
  Priority fees, compute-budget tuning, retry logic, and confirmation patterns.

## Community and Support Resources

- **[Solana Tech Discord](https://discord.gg/solana)** — 145 k members
- **[Solana Stack Exchange](https://solana.stackexchange.com/)**
- **[Superteam DAO](https://superteam.fun/)** — bounties, regional chapters
- **GitHub Discussions** — active on major Solana repos

## Assessment and Project Resources

- **[Hackathon Winners Gallery](https://build.superteam.fun/past-hackathon-winners)**
- **[Solana Breakpoint Projects](https://solana.com/breakpoint)**
- **Project Assessment Rubric Template**
  - Technical Implementation 40 %
  - User Experience 25 %
  - Code Quality 20 %
  - Documentation 15 %

## Specialized Topics for Capstone Projects

### **Note-Taking dApp Architecture**

- PDA design for user notes
- CRUD operations with Anchor
- Rich-text editor integration
- Encryption for private notes

### **DeFi Frontend Patterns**

- Token-swap interfaces
- Liquidity-pool visualizations
- Yield-farming dashboards
- Portfolio tracking

### **NFT Gallery Implementation**

- Metaplex integration
- Collection display logic
- Marketplace functionality
- Metadata handling

## Career and Industry Resources

- **[Solana Jobs Board](https://jobs.solana.com/)**
- **[Colosseum Accelerator](https://colosseum.org/)**
- **[Solana Hacker Houses](https://lu.ma/solanahackerhouse)**  
  Official calendar of in-person Hacker House and community build events worldwide.

## Documentation and Reference Tools

- **[@solana/wallet-adapter Docs](https://github.com/anza-xyz/wallet-adapter)**
- **[@coral-xyz/anchor TypeScript Client](https://www.anchor-lang.com/docs/clients/typescript)**
- **[Solana Web3.js Documentation](https://solana.com/docs/clients/javascript)**

## Deployment and Production Resources

- **[Vercel Deployment Guide — Optimized for Next.js Solana Apps](https://vercel.com/guides/deploying-nextjs-with-vercel)**  
  Covers environment variable setup, RPC endpoint management, and best practices for staging & production.

- **[QuickNode RPC Services](https://www.quicknode.com/chains/sol)** — reliable RPC infra (free tier available).

- **[Helius RPC & APIs](https://www.helius.dev/)** — enhanced APIs, webhooks, DAS for compressed NFTs.

---

## Wallet-Specific Documentation

- **[Phantom Wallet Docs](https://docs.phantom.app/)** — most-used Solana wallet; full developer guide.
- **[Solflare Wallet Docs](https://docs.solflare.com/)** — multi-platform wallet with hardware-wallet support.
- **[Backpack Wallet](https://docs.backpack.app/)** — xNFT support and built-in debugging tools.

---

## Additional Teaching Resources

- **University Partnership Programs** — Solana Foundation education grants, guest lecturers, hackathon sponsorships.
- **[Assessment Templates – Rubric Design](https://www.buffalo.edu/catt/teach/develop/design/designing-assessments/rubrics.html)**
- **Industry Guest Speakers** — DevRel engineers, dApp founders, security researchers, infra providers.

---

_Last updated: June 2025_

_Compiled for university-level Web for Solana Development courses_
