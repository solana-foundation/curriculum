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

---

## Lessons

### Lesson 1: Development Environment Setup

#### Introduction

Setting up your development environment correctly is the foundation of successful Solana development. Unlike traditional web development, blockchain development requires additional tooling to interact with the network, manage cryptographic keys, and work with monorepo structures for complex projects.

In this lesson, you'll install all necessary tools, clone and explore the wallet-adapter repository (which contains wallet-ui examples), understand its Turborepo structure, and run the example applications.

#### Topics Covered

- Installing Node.js (v18+), pnpm, and Git
- Setting up Solana CLI and creating a file system wallet
- Cloning and exploring the wallet-ui repository
- Understanding Turborepo/monorepo structure
- Running wallet-ui examples

---

#### Part 1: Prerequisites Installation

##### Node.js and pnpm

Node.js is the JavaScript runtime that powers modern web development. Solana's JavaScript libraries require Node.js version 18 or higher. The wallet-adapter repository uses **pnpm** as its package manager, which is faster and more efficient than npm.

**Installation:**

**macOS/Linux:**
```bash
# Using the official installation script (recommended)
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

This single command installs:
- Rust (version 1.90.0+)
- Solana CLI (version 2.3.13+)
- Anchor Framework (version 0.32.1+)
- Node.js (version 24.10.0+)
- Yarn (version 1.22.22+)

**Installing pnpm:**

After Node.js is installed, enable pnpm using Corepack (built into Node 16+):

```bash
corepack enable
corepack prepare pnpm@9.1.0 --activate
```

**Windows:**

Windows developers **must use Windows Subsystem for Linux (WSL)**. Solana development on native Windows is not officially supported.

1. Install WSL 2: Follow [Microsoft's WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install)
2. Open your WSL terminal (Ubuntu recommended)
3. Run the installation scripts above from within WSL

**Verification:**

After installation, close and reopen your terminal, then verify all tools:

```bash
rustc --version && solana --version && anchor --version && node --version && pnpm --version
```

Expected output (versions may be newer):
```
rustc 1.90.0
solana-cli 2.3.13
anchor-cli 0.32.1
v24.10.0
9.1.0
```

**Common Pitfall:**
If commands aren't found after installation, you may need to add them to your PATH. The installer typically adds this automatically, but if not:

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

---

##### Git

Git is required for cloning repositories and version control.

**Installation:**

```bash
# macOS (using Homebrew)
brew install git

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install git

# Already included in the Solana install script above
```

**Verification:**
```bash
git --version
```

---

#### Part 2: Solana CLI Configuration

The Solana CLI is your primary tool for interacting with Solana clusters, managing wallets, and deploying programs.

##### Understanding Solana Clusters

Solana operates multiple independent networks called **clusters**:

| Cluster | Purpose | RPC Endpoint | Use Cases |
|---------|---------|--------------|-----------|
| **Mainnet Beta** | Production network | `https://api.mainnet-beta.solana.com` | Real transactions with real SOL |
| **Devnet** | Development testing | `https://api.devnet.solana.com` | Testing with free devnet SOL |
| **Testnet** | Validator testing | `https://api.testnet.solana.com` | Stress testing network upgrades |
| **Localhost** | Local validator | `http://127.0.0.1:8899` | Fast, offline development |

**For this course, we'll primarily use Devnet** - it behaves like mainnet but uses free test SOL.

##### Configuring Your Cluster

Set your default cluster to devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

Verify your configuration:

```bash
solana config get
```

Expected output:
```
Config File: /Users/yourname/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/yourname/.config/solana/id.json
Commitment: confirmed
```

##### Creating Your Development Wallet

Solana uses **keypairs** (public/private key pairs) to identify accounts. Let's create your development wallet:

```bash
solana-keygen new
```

You'll be prompted to enter a passphrase (optional for development). The CLI creates a keypair file at `~/.config/solana/id.json`.

**⚠️ CRITICAL SECURITY WARNING:**
- **NEVER** commit keypair files to version control
- **NEVER** share your private key or seed phrase
- **NEVER** use development wallets on mainnet
- Development wallets created without passphrases are **NOT SECURE** for real funds

**View your public address:**

```bash
solana address
```

This displays your wallet's public key (base58-encoded, 32-44 characters). Example:
```
7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1
```

##### Requesting Devnet SOL

On devnet, SOL is free! Request an airdrop to fund your wallet:

```bash
solana airdrop 2
```

This requests 2 SOL from the devnet faucet. You can request up to 2 SOL per airdrop, with rate limiting.

**Check your balance:**

```bash
solana balance
```

Expected output:
```
2 SOL
```

**Common Issues:**

1. **Airdrop fails with "rate limit exceeded"**: Wait a few minutes and try again
2. **Balance shows 0**: The transaction might still be confirming. Wait 30 seconds and check again
3. **Connection timeout**: The devnet faucet may be under heavy load. Try again later or use a different RPC endpoint

---

#### Part 3: Understanding Lamports and SOL

Solana's native token is **SOL**, but internally, the blockchain tracks amounts in **lamports** (the smallest unit).

**Conversion:**
- 1 SOL = 1,000,000,000 lamports (1 billion)
- 1 lamport = 0.000000001 SOL

This is similar to:
- Bitcoin: 1 BTC = 100,000,000 satoshis
- Ethereum: 1 ETH = 1,000,000,000,000,000,000 wei (1 quintillion)

**Why lamports?**
- Eliminates floating-point arithmetic errors
- Ensures precise integer math in programs
- Named after Leslie Lamport, computer scientist who pioneered distributed systems

**Example conversions:**

| Lamports | SOL |
|----------|-----|
| 1,000,000,000 | 1 SOL |
| 500,000,000 | 0.5 SOL |
| 1,000,000 | 0.001 SOL |
| 5,000 | 0.000005 SOL (typical transaction fee) |

---

#### Part 4: Cloning and Exploring the Wallet-UI Repository

The **Anza wallet-adapter repository** contains modular TypeScript wallet adapters and UI components for Solana applications. This is what the outline refers to as "wallet-ui" - it includes example applications demonstrating wallet integration patterns.

##### What is Wallet Adapter?

Wallet adapter is a toolkit that enables Solana applications to connect to user wallets (Phantom, Solflare, Backpack, etc.) in a standardized way. It provides:

- **Modular adapters** for different wallets
- **React components** for wallet UI
- **Hooks** for wallet interaction
- **Example projects** demonstrating integration

##### Repository Structure

The wallet-adapter is organized as a **monorepo** using:

- **Turborepo** - Build system for managing multi-package workspaces
- **pnpm** - Fast, disk-efficient package manager
- **TypeScript** - Type-safe development across all packages

**Key directories:**
```
wallet-adapter/
├── packages/
│   ├── core/              # Core adapter logic
│   ├── wallets/           # Individual wallet adapters
│   ├── ui/                # UI components
│   │   ├── react-ui/      # React UI components
│   │   └── material-ui/   # Material-UI variant
│   └── starter/           # Example projects
│       ├── example/       # Basic example
│       └── react-ui-starter/  # React UI starter
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace config
└── BUILD.md               # Build instructions
```

##### Cloning the Repository

```bash
# Clone the wallet-adapter repository
git clone https://github.com/anza-xyz/wallet-adapter.git

# Navigate into the repository
cd wallet-adapter

# Install dependencies
pnpm install
```

The initial `pnpm install` may take a few minutes as it downloads dependencies for all packages in the monorepo.

##### Understanding Turborepo Structure

**What is Turborepo?**

Turborepo is a build system optimized for monorepos (repositories containing multiple packages). It provides:

1. **Task Pipeline** - Define dependencies between build tasks
2. **Intelligent Caching** - Skip rebuilding unchanged packages
3. **Parallel Execution** - Build multiple packages simultaneously
4. **Remote Caching** - Share build artifacts across teams

**Exploring turbo.json:**

```bash
cat turbo.json
```

You'll see three main tasks defined:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "build/**", "dist/**", "lib/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**What this means:**

- **`"dependsOn": ["^build"]`** - The `^` prefix means "build all dependencies first"
- **`outputs`** - These directories are cached by Turborepo
- **`lint`** - Runs independently (no cached outputs)
- **`test`** - Can only run after builds complete

This hierarchical build system ensures packages build in the correct order without manual intervention.

##### Understanding Monorepo Benefits

**Why use a monorepo for Solana projects?**

1. **Shared code** - Common utilities used across multiple packages
2. **Atomic changes** - Update multiple packages in one commit
3. **Consistent tooling** - Same ESLint, Prettier, TypeScript configs
4. **Simplified dependencies** - Internal packages reference each other easily
5. **Better developer experience** - One repo, one clone, one install

**Visualizing the structure:**

```
┌─────────────────────────────────────────────────────┐
│           Wallet Adapter Monorepo (Root)             │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌───────────────┐  ┌───────────────┐               │
│  │  core package │  │ wallets pkg   │               │
│  │  (base logic) │  │ (adapters)    │               │
│  └───────┬───────┘  └───────┬───────┘               │
│          │                   │                       │
│          └──────┬────────────┘                       │
│                 ↓                                     │
│          ┌───────────────┐                           │
│          │   ui packages │                           │
│          │  (components) │                           │
│          └───────┬───────┘                           │
│                  ↓                                     │
│          ┌───────────────┐                           │
│          │    starter    │                           │
│          │   (examples)  │                           │
│          └───────────────┘                           │
│                                                       │
│    All packages share: TypeScript, ESLint, Prettier │
│    All packages built with: Turborepo pipeline      │
└─────────────────────────────────────────────────────┘
```

**Exploring package relationships:**

```bash
# View workspace structure
cat pnpm-workspace.yaml
```

You'll see:
```yaml
packages:
  - 'packages/*'
  - 'packages/ui/*'
```

This tells pnpm to treat every directory under `packages/` as a separate package that can depend on other packages in the workspace.

---

#### Part 5: Running Wallet-UI Examples

##### Building the Monorepo

Before running examples, build all packages:

```bash
# From the wallet-adapter root directory
pnpm run build
```

**What happens during build:**

1. Turborepo analyzes the dependency graph
2. Builds packages in topological order (dependencies first)
3. Caches outputs for unchanged packages
4. Shows progress for each package

Initial builds take several minutes. Subsequent builds are much faster due to caching.

**Common build issues:**

| Issue | Solution |
|-------|----------|
| `command not found: turbo` | Run `pnpm install` again |
| TypeScript errors | Check Node.js version (need 18+) |
| Out of memory | Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" pnpm build` |

##### Running the React UI Starter

The **react-ui-starter** is a complete example application demonstrating wallet integration with React:

```bash
# Navigate to the starter example
cd packages/starter/react-ui-starter

# Start the development server
pnpm run start
```

The application will open at `http://localhost:1234`.

**What you'll see:**

1. **Wallet Connection Button** - Connect/disconnect wallet
2. **Wallet Selection Modal** - Choose from available wallets
3. **Account Information** - Display connected wallet address
4. **Network Indicator** - Shows current cluster (devnet/mainnet)
5. **Example Transactions** - Send SOL, sign messages

**Exploring the code:**

```bash
# View the main App component
cat src/App.tsx
```

Key patterns you'll find:

**1. Provider Setup:**
```typescript
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

<ConnectionProvider endpoint="https://api.devnet.solana.com">
  <WalletProvider wallets={[...]}>
    <WalletModalProvider>
      {/* Your app */}
    </WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```

**2. Using Wallet Hooks:**
```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

function MyComponent() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Use these to interact with Solana
}
```

**3. UI Components:**
```typescript
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

<WalletMultiButton />  // Handles connect/disconnect/wallet selection
```

##### Testing Wallet Integration

**Prerequisites:**
- Install a browser wallet extension:
  - [Phantom](https://phantom.app/) (recommended for beginners)
  - [Solflare](https://solflare.com/)
  - [Backpack](https://backpack.app/)

**Steps to test:**

1. **Open the example app** at `http://localhost:1234`
2. **Click "Select Wallet"** - Modal shows available wallets
3. **Choose your installed wallet** (e.g., Phantom)
4. **Approve the connection** in the wallet popup
5. **See your address displayed** in the UI
6. **Try example actions:**
   - View account balance
   - Send a test transaction (on devnet)
   - Sign a message
   - Disconnect wallet

**Common issues:**

| Issue | Solution |
|-------|----------|
| No wallets detected | Install a browser extension wallet |
| Connection rejected | Refresh page and try again |
| Transaction fails | Ensure you have devnet SOL (airdrop) |
| Wrong network | Check wallet is set to devnet |

##### Exploring Different Examples

The wallet-adapter repo contains multiple example projects:

```bash
# Navigate to examples directory
cd packages/starter

# List available examples
ls -la
```

**Available examples:**

1. **`example/`** - Minimal vanilla JavaScript example
2. **`react-ui-starter/`** - React with UI components (what we just ran)
3. **`nextjs-starter/`** - Next.js integration pattern
4. **`material-ui-starter/`** - Material-UI themed components

**Running different examples:**

```bash
# Example: Run the Next.js starter
cd packages/starter/nextjs-starter
pnpm run dev
```

Each example demonstrates different integration patterns but follows the same core concepts:
- Provider hierarchy
- Wallet hooks
- Transaction signing

---

#### Lab Exercise 1: Environment Verification & Wallet-UI Exploration

Complete these tasks to verify your setup and explore the wallet-adapter repository:

**Part A: Tool Verification**

**Task 1: Verify all tools are installed**
```bash
rustc --version && solana --version && anchor --version && node --version && pnpm --version
```

**Task 2: Create a second keypair for testing**
```bash
solana-keygen new -o ~/test-wallet.json
```

**Task 3: View your configuration**
```bash
solana config get
```

**Task 4: Request devnet SOL and verify balance**
```bash
solana airdrop 2
solana balance
```

**Part B: Wallet-UI Repository Exploration**

**Task 5: Clone and build wallet-adapter**
```bash
git clone https://github.com/anza-xyz/wallet-adapter.git
cd wallet-adapter
pnpm install
pnpm run build
```

**Task 6: Identify monorepo structure**

Answer these questions by exploring the repository:

1. How many packages are in the `packages/` directory?
2. What file defines the Turborepo task pipeline?
3. Which package manager does this project use?
4. Name three wallet adapters in `packages/wallets/`

**Task 7: Run the react-ui-starter example**
```bash
cd packages/starter/react-ui-starter
pnpm run start
```

**Task 8: Test wallet integration**

1. Open http://localhost:1234
2. Install Phantom wallet if you haven't
3. Connect your wallet
4. Take a screenshot showing:
   - Your connected wallet address
   - The network indicator (devnet)
   - The wallet connection button

**Task 9: Explore the code**

Open `packages/starter/react-ui-starter/src/App.tsx` and identify:
1. Which provider components are used?
2. Which hooks are imported from `@solana/wallet-adapter-react`?
3. Where is the `WalletMultiButton` component used?

**Deliverables:**

Submit a document containing:
1. Screenshots of all tool versions
2. Your wallet balance verification
3. Screenshot of the running wallet-ui example with connected wallet
4. Answers to the exploration questions in Tasks 6 and 9
5. A brief explanation (2-3 sentences) of why monorepos are useful for Solana projects

---

#### Key Concepts Summary

✅ **Solana CLI tools** - Command-line interface for interacting with Solana networks
✅ **File system wallets** - JSON files containing keypair data (public + private keys)
✅ **Clusters** - Different Solana networks (mainnet, devnet, testnet, localhost)
✅ **Lamports** - Smallest unit of SOL (1 SOL = 1 billion lamports)
✅ **Airdrops** - Free SOL distribution on devnet for testing
✅ **RPC endpoints** - HTTP/WebSocket URLs for blockchain communication
✅ **pnpm** - Fast, efficient package manager using symlinks and content-addressable storage
✅ **Monorepo** - Single repository containing multiple packages with shared tooling
✅ **Turborepo** - Build system optimizing monorepo task execution with caching
✅ **Wallet adapter** - Standardized interface for connecting Solana wallets to applications

---

### Lesson 2: Introduction to Gill Library

#### Introduction

Gill is a modern JavaScript/TypeScript client library for interacting with the Solana blockchain. Built on top of Anza's `@solana/kit` libraries (the next generation of Web3.js), Gill provides a cleaner, more type-safe, and tree-shakeable API for Solana development with quality-of-life improvements.

In this lesson, you'll learn why Gill exists, how it compares to Web3.js, and how to use it to build efficient Solana web applications.

---

#### Part 1: Why Gill? Comparing to Web3.js

##### The Evolution of Solana JavaScript Libraries

**Timeline:**

1. **@solana/web3.js v1** (original) - Widely used but has limitations
2. **@solana/kit** (v2, by Anza) - Complete rewrite with modern architecture
3. **Gill** (by Solana Foundation) - Built on kit with improved developer experience

##### Web3.js v1 Limitations

The original `@solana/web3.js` (v1.x) has served the Solana ecosystem well, but it has significant limitations:

1. **Large Bundle Sizes**: The entire library is bundled even if you only use a small portion
2. **Limited Tree-Shaking**: Modern build tools can't effectively eliminate unused code
3. **Inconsistent TypeScript Support**: Types are often incomplete or incorrect
4. **Older JavaScript Patterns**: Designed before modern ES6+ features became standard
5. **Verbose API**: Long function names and complex patterns for common tasks

**Example problem:**
```javascript
// Old Web3.js - imports everything
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

// Final bundle includes hundreds of KB of unused code
// Even if you only need Connection
```

##### Enter @solana/kit (Web3.js v2)

Anza (formerly Solana Labs) developed `@solana/kit` as a complete rewrite addressing these issues:

- ✅ **Modular architecture** - Import only what you need
- ✅ **TypeScript-first** - Full type safety throughout
- ✅ **Tree-shakeable** - Build tools can remove unused code
- ✅ **Modern JavaScript** - Uses latest language features
- ✅ **Smaller bundles** - 70-90% size reduction in typical apps
- ✅ **Functional patterns** - Pipe helpers for transaction building

##### Why Gill on Top of Kit?

Gill builds on `@solana/kit` with quality-of-life improvements:

**Core Philosophy:**
> "Gill ships both the same low-level primitives as Kit and lightly opinionated abstractions to simplify common tasks, all from a single, compatible interface."

**Key advantages:**

- **One-to-one compatibility** - All @solana/kit imports can be directly replaced with gill
- **Helper functions** - `createTransaction()` simplifies transaction creation
- **Better ergonomics** - Cleaner API for common tasks
- **Improved DevEx** - Easier adoption curve without sacrificing flexibility
- **Additional utilities** - Explorer links, keypair management, conversions

**Comparison Table:**

| Feature | Web3.js v1 | @solana/kit (v2) | Gill |
|---------|------------|------------------|------|
| **Bundle size** | ~300KB | ~50KB | ~50KB |
| **Tree-shaking** | ❌ Limited | ✅ Full | ✅ Full |
| **TypeScript** | ⚠️ Partial | ✅ Complete | ✅ Complete |
| **Modern JS** | ❌ ES5 patterns | ✅ ES2022+ | ✅ ES2022+ |
| **DX helpers** | ❌ None | ⚠️ Some | ✅ Many |
| **Learning curve** | Medium | Steep | Gentle |
| **Pipe pattern** | ❌ No | ✅ Yes | ✅ Yes |

**Migration path:**

```
Web3.js v1 → @solana/kit → Gill (easiest)
     ↓           ↑
     └───────────┘
    Direct migration also possible
```

##### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Your Application                     │
│               (React, Next.js, Node.js, etc.)            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Gill SDK (gill)                        │
│  • createSolanaClient()    • lamportsToSol()             │
│  • createTransaction()     • solToLamports()             │
│  • loadKeypairSignerFromFile()                           │
│  • getSignatureFromTransaction()                         │
│                                                           │
│  Opinionated helpers + full @solana/kit compatibility   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│          @solana/kit (foundation / Web3.js v2)           │
│  • RPC clients (createSolanaRpc)                         │
│  • Transaction types (CompilableTransaction)             │
│  • Signers (TransactionSigner)                           │
│  • Address utilities (address, getAddressEncoder)        │
│  • Pipe helpers (transaction composition)                │
│                                                           │
│  Low-level primitives, tree-shakeable, type-safe        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 Solana Blockchain                        │
│         (Devnet, Testnet, Mainnet, Localhost)            │
│                                                           │
│  • JSON-RPC API (getAccountInfo, sendTransaction, etc.) │
│  • WebSocket API (account subscriptions, logs, etc.)    │
└─────────────────────────────────────────────────────────┘
```

---

#### Part 2: Installing and Setting Up Gill

##### Installation

Install Gill in your project:

```bash
npm install gill
```

Or using other package managers:

```bash
# pnpm (recommended)
pnpm add gill

# yarn
yarn add gill

# bun
bun add gill
```

##### TypeScript Configuration

Gill is TypeScript-first and requires modern TypeScript compiler settings. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "lib": ["ES2022"]
  }
}
```

**Why these settings?**

- **`target: "ES2022"`** - Enables modern JavaScript features (async/await, optional chaining, etc.)
- **`module: "ESNext"`** - Uses native ES modules for better tree-shaking
- **`moduleResolution: "bundler"`** - Optimizes for bundler tools (Vite, Webpack, etc.)
- **`strict: true`** - Enables all strict type checking (catches bugs early)

---

#### Part 3: Core Gill Concepts

##### 1. Creating a Solana Client

The first step in any Gill application is creating a client connection to a Solana cluster:

```typescript
import { createSolanaClient } from 'gill';

// Using a cluster moniker (simplified)
const { rpc, rpcSubscriptions, sendAndConfirmTransaction } =
  createSolanaClient({ urlOrMoniker: 'devnet' });

// Using a custom RPC endpoint
const client = createSolanaClient({
  urlOrMoniker: 'https://api.devnet.solana.com'
});
```

**Available Monikers:**
- `'devnet'` - Development network (for testing)
- `'mainnet'` - Production network (real SOL, use with caution!)
- `'localnet'` - Local validator (must be running on your machine)

**What you get back:**

| Property | Type | Purpose |
|----------|------|---------|
| `rpc` | `Rpc` | RPC client for querying blockchain data |
| `rpcSubscriptions` | `RpcSubscriptions` | WebSocket client for real-time updates |
| `sendAndConfirmTransaction` | `Function` | Helper for sending and confirming transactions |

**⚠️ Production Warning:**

The public RPC endpoints have strict rate limits (often 1-2 requests/second). For production applications, use a dedicated RPC provider:

- [Helius](https://helius.dev) - Free tier: 100 req/sec, advanced features
- [QuickNode](https://quicknode.com) - Enterprise-grade infrastructure
- [Triton](https://triton.one) - Performance-optimized RPC
- [Alchemy](https://alchemy.com) - Developer-friendly platform

---

##### 2. Making RPC Requests

All RPC methods in Gill/Kit use the `.send()` pattern to execute requests:

```typescript
// Get the current slot (block height)
const slot = await rpc.getSlot().send();
console.log('Current slot:', slot);  // e.g., 289123456

// Get the latest blockhash (needed for transactions)
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
console.log('Latest blockhash:', latestBlockhash.blockhash);

// Get account information
import { address } from '@solana/kit';

const accountAddress = address('7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1');
const accountInfo = await rpc.getAccountInfo(accountAddress).send();
console.log('Account balance:', accountInfo?.value?.lamports);
```

**Why the `.send()` pattern?**

This enables **composability** and **lazy evaluation**:

```typescript
// Build the request (doesn't execute yet)
const request = rpc.getSlot();

// Can pass it around, store it, modify it
const requestWithOptions = request./* add options */;

// Only executes when .send() is called
const result = await request.send();
```

This pattern allows you to:
- Build requests dynamically
- Compose complex queries
- Defer execution until needed
- Test request building without network calls

---

##### 3. Working with Addresses

Solana addresses are 32-byte public keys, usually displayed as base58-encoded strings (like `7xJ9qH5G...`).

```typescript
import { address } from '@solana/kit';
import { checkedAddress } from 'gill';

// Create an address (validates format)
const addr = address('7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1');

// Validate an address with error handling (Gill helper)
try {
  const validAddr = checkedAddress(userInputAddress);
  console.log('Valid address:', validAddr);
} catch (error) {
  console.error('Invalid address format:', error.message);
  // Show user-friendly error in your UI
}
```

**Address validation patterns:**

```typescript
// Pattern 1: Using try-catch (recommended for user input)
function validateAndUseAddress(input: string) {
  try {
    const addr = checkedAddress(input);
    return fetchAccountData(addr);
  } catch {
    throw new Error('Please enter a valid Solana address');
  }
}

// Pattern 2: Using optional types
function parseAddress(input: string): Address | null {
  try {
    return checkedAddress(input);
  } catch {
    return null;
  }
}
```

---

##### 4. Understanding Gill's Pipe Pattern

**What is the Pipe Pattern?**

The pipe pattern is a functional programming concept where you chain operations together, passing the output of one function as input to the next. In Solana/Gill context, Kit provides pipe helpers for transaction building.

**Visual representation:**

```
Input → Function A → Intermediate → Function B → Output
```

**In transaction building:**

```
Empty Tx → Add Instruction → Add Signer → Add Blockhash → Ready Tx
```

**Gill's Functional Composition:**

While Gill doesn't expose a literal `pipe()` function in its public API, it embraces functional composition patterns throughout:

```typescript
// Example: Chaining with .send() pattern
const balance = await rpc
  .getAccountInfo(myAddress)
  .send()
  .then(info => info?.value?.lamports ?? 0)
  .then(lamports => lamportsToSol(lamports));

// More readable with async/await
const accountInfo = await rpc.getAccountInfo(myAddress).send();
const lamports = accountInfo?.value?.lamports ?? 0;
const sol = lamportsToSol(lamports);
```

**Transaction composition example:**

```typescript
import { createTransaction } from 'gill';
import { pipe } from '@solana/kit';  // Kit's pipe helper

// Composing a transaction using functional patterns
const transaction = pipe(
  createTransaction({
    version: 'legacy',
    feePayer: signer,
    instructions: [],
    latestBlockhash,
  }),
  // Add instructions
  tx => ({ ...tx, instructions: [...tx.instructions, instruction1] }),
  tx => ({ ...tx, instructions: [...tx.instructions, instruction2] }),
);
```

**Practical benefits of functional composition:**

1. **Readable** - Left-to-right flow matches mental model
2. **Composable** - Build complex operations from simple functions
3. **Testable** - Each function can be tested independently
4. **Reusable** - Functions become building blocks

**Example: Composing utility functions**

```typescript
// Utility functions
const formatAddress = (addr: Address) =>
  addr.toString().slice(0, 4) + '...' + addr.toString().slice(-4);

const addExplorerLink = (addr: string, cluster: string) =>
  `https://explorer.solana.com/address/${addr}?cluster=${cluster}`;

// Compose them
const displayAddress = (addr: Address, cluster: string) =>
  addExplorerLink(
    formatAddress(addr),
    cluster
  );

// Or with explicit steps (clearer)
const displayAddress = (addr: Address, cluster: string) => {
  const shortened = formatAddress(addr);
  const link = addExplorerLink(shortened, cluster);
  return link;
};
```

---

#### Part 4: Your First Gill Program

Let's create a complete program that connects to devnet and queries blockchain data.

##### Step 1: Project Setup

```bash
mkdir solana-gill-intro
cd solana-gill-intro
npm init -y
npm install gill typescript @types/node tsx
npx tsc --init
```

##### Step 2: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

##### Step 3: Create `src/index.ts`

```typescript
import { createSolanaClient, lamportsToSol, LAMPORTS_PER_SOL } from 'gill';
import { address } from '@solana/kit';

async function main() {
  console.log('🚀 Solana Gill Introduction\n');

  // Connect to devnet
  console.log('📡 Connecting to Solana devnet...\n');
  const { rpc } = createSolanaClient({ urlOrMoniker: 'devnet' });

  // Get cluster information
  console.log('📊 Cluster Information:');
  console.log('─'.repeat(60));

  const slot = await rpc.getSlot().send();
  console.log('  Current slot:', slot.toLocaleString());

  const version = await rpc.getVersion().send();
  console.log('  Solana version:', version['solana-core']);

  const { value: blockHeight } = await rpc.getBlockHeight().send();
  console.log('  Block height:', blockHeight.toLocaleString());

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  console.log('  Latest blockhash:', latestBlockhash.blockhash);
  console.log('  Last valid block height:', latestBlockhash.lastValidBlockHeight.toLocaleString());

  // Query an account
  console.log('\n💰 Account Query:');
  console.log('─'.repeat(60));

  // Replace with your devnet address from Lesson 1
  const myAddress = address('YOUR_DEVNET_ADDRESS_HERE');

  console.log('  Querying address:', myAddress);

  const accountInfo = await rpc.getAccountInfo(myAddress).send();

  if (accountInfo?.value) {
    const { lamports, owner, executable, rentEpoch } = accountInfo.value;

    console.log('  ✅ Account found!');
    console.log('  Balance:', lamportsToSol(lamports), 'SOL');
    console.log('  Balance (raw):', lamports.toLocaleString(), 'lamports');
    console.log('  Owner program:', owner);
    console.log('  Executable:', executable ? 'Yes (this is a program)' : 'No (regular account)');
    console.log('  Rent epoch:', rentEpoch);
  } else {
    console.log('  ❌ Account not found (may not exist on devnet)');
  }

  // Demonstrate lamports conversion
  console.log('\n🔢 Lamports Conversion Examples:');
  console.log('─'.repeat(60));
  console.log('  1 SOL =', LAMPORTS_PER_SOL.toLocaleString(), 'lamports');
  console.log('  0.5 SOL =', (LAMPORTS_PER_SOL / 2).toLocaleString(), 'lamports');
  console.log('  1,000,000 lamports =', lamportsToSol(1_000_000), 'SOL');
  console.log('  5,000 lamports =', lamportsToSol(5_000), 'SOL (typical tx fee)');

  // Demonstrate functional composition
  console.log('\n🔗 Functional Composition Example:');
  console.log('─'.repeat(60));

  // Compose multiple operations
  const getFormattedBalance = async (addr: Address) => {
    const info = await rpc.getAccountInfo(addr).send();
    const lamports = info?.value?.lamports ?? 0;
    const sol = lamportsToSol(lamports);
    return `${sol} SOL (${lamports.toLocaleString()} lamports)`;
  };

  const formattedBalance = await getFormattedBalance(myAddress);
  console.log('  Formatted balance:', formattedBalance);

  console.log('\n✅ Program completed successfully!');
}

// Error handling
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
```

##### Step 4: Update `package.json`

Add scripts to run your program:

```json
{
  "name": "solana-gill-intro",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "gill": "latest",
    "@solana/kit": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

##### Step 5: Run the Program

```bash
# Development mode (with hot reload)
npm run dev

# Or build and run
npm run build
npm start
```

**Expected Output:**

```
🚀 Solana Gill Introduction

📡 Connecting to Solana devnet...

📊 Cluster Information:
────────────────────────────────────────────────────────────
  Current slot: 289,123,456
  Solana version: 1.18.0
  Block height: 268,123,456
  Latest blockhash: 7aK9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1
  Last valid block height: 268,123,606

💰 Account Query:
────────────────────────────────────────────────────────────
  Querying address: 7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1
  ✅ Account found!
  Balance: 2 SOL
  Balance (raw): 2,000,000,000 lamports
  Owner program: 11111111111111111111111111111111
  Executable: No (regular account)
  Rent epoch: 0

🔢 Lamports Conversion Examples:
────────────────────────────────────────────────────────────
  1 SOL = 1,000,000,000 lamports
  0.5 SOL = 500,000,000 lamports
  1,000,000 lamports = 0.001 SOL
  5,000 lamports = 0.000005 SOL (typical tx fee)

🔗 Functional Composition Example:
────────────────────────────────────────────────────────────
  Formatted balance: 2 SOL (2,000,000,000 lamports)

✅ Program completed successfully!
```

---

#### Part 5: Common RPC Methods Reference

Here are the most commonly used RPC methods in Gill:

| Method | Purpose | Return Type | Example |
|--------|---------|-------------|---------|
| `getAccountInfo()` | Get account data | `AccountInfo \| null` | `await rpc.getAccountInfo(addr).send()` |
| `getBalance()` | Get account balance | `number` | `await rpc.getBalance(addr).send()` |
| `getSlot()` | Get current slot | `number` | `await rpc.getSlot().send()` |
| `getBlockHeight()` | Get block height | `{ value: number }` | `await rpc.getBlockHeight().send()` |
| `getLatestBlockhash()` | Get recent blockhash | `{ value: Blockhash }` | `await rpc.getLatestBlockhash().send()` |
| `getTransaction()` | Get transaction details | `Transaction \| null` | `await rpc.getTransaction(sig).send()` |
| `getSignatureStatuses()` | Check tx status | `SignatureStatus[]` | `await rpc.getSignatureStatuses([sig]).send()` |
| `getVersion()` | Get cluster version | `Version` | `await rpc.getVersion().send()` |
| `getTokenAccountsByOwner()` | Get token accounts | `TokenAccount[]` | `await rpc.getTokenAccountsByOwner(...).send()` |

**Detailed Examples:**

**1. Getting Account Info:**
```typescript
const accountInfo = await rpc.getAccountInfo(myAddress).send();

if (accountInfo?.value) {
  console.log('Lamports:', accountInfo.value.lamports);
  console.log('Owner:', accountInfo.value.owner);
  console.log('Data size:', accountInfo.value.data.length, 'bytes');
  console.log('Executable:', accountInfo.value.executable);
}
```

**2. Checking Transaction Status:**
```typescript
const { value: statuses } = await rpc
  .getSignatureStatuses([transactionSignature])
  .send();

const status = statuses[0];
if (status?.confirmationStatus === 'confirmed') {
  console.log('Transaction confirmed!');
} else if (status?.err) {
  console.log('Transaction failed:', status.err);
}
```

**3. Getting Multiple Accounts (Batch):**
```typescript
const addresses = [address1, address2, address3];
const accounts = await rpc.getMultipleAccounts(addresses).send();

accounts.value.forEach((account, index) => {
  if (account) {
    console.log(`Account ${index}:`, account.lamports, 'lamports');
  }
});
```

---

#### Lab Exercise 2: Build a Balance Checker CLI

Create a command-line program that accepts Solana addresses and displays their balances.

**Requirements:**

1. Accept one or more Solana addresses as command-line arguments
2. Validate each address format
3. Query account information for each address
4. Display results in a formatted table
5. Handle errors gracefully (invalid addresses, accounts not found)

**Starter Code:**

```typescript
// src/balance-checker.ts
import { createSolanaClient, lamportsToSol, checkedAddress } from 'gill';

interface AccountResult {
  address: string;
  balance: number | null;
  error?: string;
}

async function checkBalance(addressString: string): Promise<AccountResult> {
  try {
    // Validate address
    const addr = checkedAddress(addressString);

    // TODO: Create Solana client
    // TODO: Query account info
    // TODO: Return balance or null if not found

    return {
      address: addressString,
      balance: null,  // Replace with actual balance
    };
  } catch (error) {
    return {
      address: addressString,
      balance: null,
      error: error.message,
    };
  }
}

async function main() {
  // Get addresses from command line
  const addresses = process.argv.slice(2);

  if (addresses.length === 0) {
    console.error('Usage: npm run check <address1> [address2] [address3]...');
    console.error('Example: npm run check 7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1');
    process.exit(1);
  }

  console.log('🔍 Checking balances on devnet...\n');

  // TODO: Check all addresses
  // TODO: Display results in a formatted table
}

main().catch(console.error);
```

**Expected Output:**

```
🔍 Checking balances on devnet...

┌─────────────────────────────────────────────┬────────────┬─────────────────┐
│ Address                                     │ SOL        │ Status          │
├─────────────────────────────────────────────┼────────────┼─────────────────┤
│ 7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX...   │ 2.000000   │ ✅ Found        │
│ 8aH3rK6LpYr4sG4xL2qO3nP9uS4vW5xY6zZ...   │ 0.000000   │ ✅ Found (empty)│
│ invalid-address                             │ -          │ ❌ Invalid      │
└─────────────────────────────────────────────┴────────────┴─────────────────┘
```

**Challenge Extensions:**

1. **Add color output** - Use a library like `chalk` for colored text
2. **Support cluster switching** - Accept `--cluster devnet|mainnet` flag
3. **Show additional info** - Display account owner, executable status
4. **Export to CSV** - Add `--export results.csv` option
5. **Watch mode** - Poll accounts every N seconds and show balance changes

**Hints:**

- Use `console.table()` for formatted output
- Use `Promise.all()` to check multiple addresses in parallel
- Use `toFixed(6)` to format SOL amounts consistently

---

#### Key Concepts Summary

✅ **Gill** - Modern Solana JavaScript library built on @solana/kit with improved DX
✅ **Web3.js comparison** - Gill offers smaller bundles, better TypeScript, functional patterns
✅ **Tree-shaking** - Build optimization that removes unused code from final bundle
✅ **createSolanaClient()** - Initialize connection to Solana cluster (returns rpc, rpcSubscriptions)
✅ **RPC methods** - Functions for querying blockchain data (all require `.send()` to execute)
✅ **Type safety** - TypeScript provides compile-time error checking throughout
✅ **Functional composition** - Chaining operations for cleaner, more maintainable code
✅ **Pipe pattern** - Functional programming pattern for composing transactions (via @solana/kit)
✅ **lamportsToSol()** - Convert between lamports (smallest unit) and SOL
✅ **`.send()` pattern** - Lazy evaluation enabling composability and testability

---

### Lesson 3: Solana Fundamentals for Web Developers

#### Introduction

Understanding Solana's core architecture is essential for building effective web applications. Unlike Ethereum's account-based model with smart contract storage, Solana uses a unique account model where **all data lives in accounts**.

In this lesson, you'll learn how Solana organizes data, processes transactions, and manages state from a frontend developer's perspective.

---

#### Part 1: Solana's Account Model

##### Everything is an Account

On Solana, **accounts are the fundamental unit of storage**. Think of Solana as a massive key-value database where:
- **Keys** = Account addresses (32-byte public keys)
- **Values** = Account data structures

**Key Insight:** Solana separates **code** from **data**:
- **Programs** (smart contracts) contain executable code
- **Data accounts** store state and user information
- Programs can modify data in accounts they own

This is similar to how operating systems separate executables (`.exe`, `.app`) from data files (`.json`, `.db`).

##### Account Structure

Every account contains exactly 5 fields:

```typescript
interface AccountInfo {
  address: string;      // 32-byte public key (shown as base58 string)
  lamports: bigint;     // Balance in lamports (native token)
  data: Uint8Array;     // Arbitrary data (0 bytes to 10MB)
  owner: string;        // Program that owns this account
  executable: boolean;  // True if this account is a program
}
```

**Visual Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                    Solana Account                        │
├─────────────────────────────────────────────────────────┤
│ Address:     7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX... │
│ Lamports:    2,000,000,000 (2 SOL)                      │
│ Data:        [0x01, 0x02, 0x03, ...] (variable length)  │
│ Owner:       11111111111111111111111111111111 (System)  │
│ Executable:  false                                       │
└─────────────────────────────────────────────────────────┘
```

##### Account Types

**1. System Accounts (Wallets)**

Your typical wallet account:
- **Owner**: System Program (`11111111111111111111111111111111`)
- **Data**: Empty (0 bytes)
- **Purpose**: Hold SOL, pay transaction fees
- **Executable**: false

**2. Program Accounts**

Contain executable code:
- **Owner**: Loader programs (BPF Loader, BPF Loader 2, etc.)
- **Data**: Compiled program bytecode (BPF format)
- **Purpose**: Execute on-chain logic
- **Executable**: true

**3. Data Accounts**

Store application state:
- **Owner**: The program that manages this data
- **Data**: Application-specific (user profiles, game state, etc.)
- **Purpose**: Persistent storage
- **Executable**: false

**4. Token Accounts**

Special data accounts for SPL tokens:
- **Owner**: Token Program (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
- **Data**: Structured data (mint address, owner, amount)
- **Purpose**: Hold fungible or non-fungible tokens
- **Executable**: false

##### Account Ownership Rules

**Critical Rule:** Only the owner program can modify an account's data or deduct its lamports.

```
┌──────────────┐                    ┌──────────────┐
│   Program A  │ ──── owns ────>    │  Account X   │
│              │                    │  Owner: A    │
└──────────────┘                    └──────────────┘
        │                                  ▲
        │                                  │
        └───── can modify data ────────────┘
        └───── can deduct lamports ────────┘

┌──────────────┐
│   Program B  │ ──── CANNOT modify ────> Account X
└──────────────┘      (will fail)
```

**Example in code:**

```typescript
// Query account and check ownership
const accountInfo = await rpc.getAccountInfo(myAddress).send();

if (accountInfo?.value) {
  const owner = accountInfo.value.owner;
  console.log('Account owner:', owner);

  // Identify account type by owner
  if (owner === '11111111111111111111111111111111') {
    console.log('Type: System Account (wallet)');
  } else if (owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
    console.log('Type: Token Account');
  } else {
    console.log('Type: Program Data Account');
  }
}
```

##### Rent and Rent Exemption

Accounts must maintain a minimum balance to remain on-chain. This is called **rent exemption**.

**Historical Context:**
- Originally, accounts paid "rent" periodically (deducted from balance)
- Since 2021, all accounts must be **rent-exempt** at creation
- Rent-exempt threshold = 2 years worth of theoretical rent

**Calculating Rent:**

```typescript
// Rent is calculated based on data size
// Formula: lamports = (dataSize + 128) * lamports_per_byte_year * 2

// Example: Account with 165 bytes of data
// Rent-exempt minimum ≈ 0.00203928 SOL (2,039,280 lamports)
```

**Practical implications:**
- Small accounts (0-200 bytes) need ~0.001-0.002 SOL minimum
- Larger accounts (10KB) need ~0.07 SOL
- You get rent back when you close accounts!

**Closing accounts to recover rent:**

```typescript
// When you close an account:
// 1. Transfer the data and lamports to a destination account
// 2. Set the account's data length to 0
// 3. The lamports are freed for reuse

// This is common for:
// - Temporary escrow accounts
// - Completed auction accounts
// - Old game state that's no longer needed
```

---

#### Part 2: Transactions and Instructions

##### Transaction Anatomy

A **transaction** is a bundle of operations sent to the blockchain. Think of it like a database transaction - it's **atomic** (all or nothing).

**Transaction Structure:**

```
┌─────────────────────────────────────────────────────────┐
│                       Transaction                        │
├─────────────────────────────────────────────────────────┤
│ Signatures:  [signature1, signature2, ...]              │
│              (64 bytes each, one per required signer)    │
├─────────────────────────────────────────────────────────┤
│ Message:                                                 │
│   ├─ Header:                                             │
│   │    • Number of required signatures                   │
│   │    • Number of readonly signed accounts              │
│   │    • Number of readonly unsigned accounts            │
│   ├─ Account Keys: [addr1, addr2, addr3, ...]           │
│   │    (All accounts used in instructions)               │
│   ├─ Recent Blockhash: 7aK9qH5GqXq...                   │
│   │    (Prevents replay, expires ~60-90 seconds)         │
│   └─ Instructions: [instr1, instr2, ...]                │
│        (Actual operations to execute)                    │
└─────────────────────────────────────────────────────────┘
```

##### Instructions

An **instruction** is a single operation within a transaction. Each instruction specifies:

1. Which **program** to execute
2. Which **accounts** the program needs
3. What **data/arguments** to pass

**Instruction Structure:**

```typescript
interface Instruction {
  programId: Address;          // Which program to call
  accounts: Array<{            // Which accounts to use
    address: Address;
    isSigner: boolean;         // Must this account sign the transaction?
    isWritable: boolean;       // Will this account be modified?
  }>;
  data: Uint8Array;           // Instruction-specific data (arguments)
}
```

**Real-world analogy:**

Think of a transaction like a form with multiple sections:
- **Transaction** = The entire form (must be completed all at once)
- **Instructions** = Individual sections (name, address, payment, etc.)
- **Signatures** = Your signature at the bottom (proves authorization)
- **Blockhash** = Timestamp (form expires if too old)

##### Transaction Atomicity

**Critical concept:** If **any** instruction fails, the **entire** transaction fails. No changes persist.

```
Transaction: [Instruction A, Instruction B, Instruction C]

Scenario 1: All succeed
  A ✅ → B ✅ → C ✅ → Transaction confirmed ✅
  All changes are saved to the blockchain

Scenario 2: One fails
  A ✅ → B ❌ → C not executed → Transaction FAILED ❌
  All changes from A are REVERTED
  Blockchain state remains unchanged
```

**Practical example:**

```typescript
// This transaction will:
// 1. Transfer SOL to Bob
// 2. Create a data account for tracking the transfer

const transaction = createTransaction({
  version: 'legacy',
  feePayer: myKeypair,
  latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
  instructions: [
    // Instruction 1: Transfer 1 SOL
    SystemProgram.transfer({
      fromPubkey: myAddress,
      toPubkey: bobAddress,
      lamports: 1_000_000_000, // 1 SOL
    }),

    // Instruction 2: Create tracking account
    SystemProgram.createAccount({
      fromPubkey: myAddress,
      newAccountPubkey: trackingAccount,
      lamports: 2_000_000,  // Rent-exempt minimum
      space: 100,
      programId: trackingProgram,
    }),
  ],
});

// What happens if Instruction 2 fails?
// → Transfer (Instruction 1) is REVERTED
// → No SOL is sent to Bob
// → No tracking account is created
// → It's as if the transaction never happened
```

**Why atomicity matters:**

- **Consistency**: Database remains in a valid state
- **Safety**: Partial failures don't corrupt data
- **Predictability**: Either everything happens or nothing happens

##### Transaction Lifecycle

```
1. CLIENT: Build transaction message
           (instructions, accounts, blockhash)
           ↓
2. CLIENT: Sign with required keypairs
           (creates 64-byte Ed25519 signatures)
           ↓
3. CLIENT: Send to RPC endpoint
           (serialized transaction bytes)
           ↓
4. NETWORK: Validate signatures
           (verify cryptographic signatures)
           ↓
5. NETWORK: Leader (current validator) processes
           (executes instructions sequentially)
           ↓
6. NETWORK: Execute each instruction
           (call programs, modify accounts)
           ↓
7. NETWORK: Confirm in block
           (add to ledger, propagate to validators)
           ↓
8. NETWORK: Finalize
           (2/3+ of stake has confirmed)
           ↓
9. CLIENT: Receive confirmation
           (transaction signature returned)
```

**Confirmation Levels:**

| Level | Description | Use Case |
|-------|-------------|----------|
| **processed** | Executed by leader | Not recommended (can be rolled back) |
| **confirmed** | Confirmed by cluster | Most use cases (sufficient for UIs) |
| **finalized** | Finalized by supermajority | Critical operations (exchanges, etc.) |

**Blockhash Expiration:**

Transactions include a **recent blockhash** to prevent replays. Blockhashes expire after ~60-90 seconds (~150 blocks at 400ms/block).

```typescript
// Get a fresh blockhash
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

console.log('Blockhash:', latestBlockhash.blockhash);
console.log('Expires at block:', latestBlockhash.lastValidBlockHeight);

// Current block height
const { value: currentHeight } = await rpc.getBlockHeight().send();

// Time remaining (approximate)
const blocksRemaining = Number(latestBlockhash.lastValidBlockHeight - currentHeight);
const secondsRemaining = blocksRemaining * 0.4; // ~400ms per block

console.log(`Transaction valid for ~${Math.floor(secondsRemaining)} seconds`);

// Output:
// Transaction valid for ~60 seconds
```

**Best practice:** Always fetch blockhash immediately before signing:

```typescript
// ❌ BAD: Blockhash might expire
const blockhash = await rpc.getLatestBlockhash().send();
await doSomethingTimeConsuming();  // 2 minutes pass...
const tx = createTransaction({ latestBlockhash: blockhash.value, ... });

// ✅ GOOD: Fresh blockhash
const tx = createTransaction({
  latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
  ...
});
```

---

#### Part 3: Program Derived Addresses (PDAs)

##### What are PDAs?

**Program Derived Addresses** are special account addresses **derived deterministically** from a program ID and optional seeds. They have **no corresponding private key**.

**Why PDAs matter:**

1. **Deterministic** - Same inputs always produce same address (no need to store!)
2. **Program-controlled** - Only the program can "sign" for this account
3. **Predictable** - Frontends can derive addresses without blockchain queries

**Real-world analogy:**

- **Regular address** = Your house address (someone holds the physical key)
- **PDA** = A P.O. Box at the post office (no key exists, only postal workers can access it using your ID + password)

##### How PDAs Work

PDAs are derived using a **one-way hash function** that intentionally creates an address **off the Ed25519 elliptic curve** (meaning no corresponding private key exists).

**Derivation process:**

```typescript
// Conceptual example (actual libraries handle this)
import { getProgramDerivedAddress } from '@solana/kit';

const [pda, bump] = await getProgramDerivedAddress({
  programAddress: myProgramAddress,
  seeds: [
    'user-profile',          // Seed 1: UTF-8 string
    userWalletAddress,       // Seed 2: user's public key
  ],
});

console.log('PDA:', pda);
console.log('Bump:', bump);  // Number 0-255 (usually 255)
```

**Visual Diagram:**

```
Inputs:
  Program ID: ProgramABC123...
  Seeds: ["vault", userAddress]
                │
                ↓
         SHA-256 Hash
                │
                ↓
       Try bump = 255
                │
    Hash(Program ID, Seeds, 255)
                │
         Is result on Ed25519 curve?
                │
         ┌──────┴──────┐
         │             │
        Yes           No
         │             │
    Try 254       PDA Found! ✅
         │         (address, bump=255)
         ↓
       Repeat...

Result: A valid Solana address with no private key
```

**Key characteristics:**

1. **Deterministic** - Same inputs always produce same PDA
2. **No private key** - Cannot be compromised (no key to steal!)
3. **Canonical bump** - Always use the first valid bump (highest value, usually 255)
4. **Program authority** - Only the deriving program can "sign" for this address

##### PDA Use Cases

**1. User-specific data accounts**

```typescript
// Each user gets a unique profile account
// Derive PDA for user's profile
const [profilePDA] = await getProgramDerivedAddress({
  programAddress: socialMediaProgram,
  seeds: ['user-profile', userWalletAddress],
});

// Frontend can derive this without querying blockchain!
// Result: Each user has their own deterministic profile address
```

**2. Token vaults (program-controlled wallets)**

```typescript
// Program-controlled token storage
const [vaultPDA] = await getProgramDerivedAddress({
  programAddress: escrowProgram,
  seeds: ['token-vault'],
});

// Only escrowProgram can transfer tokens from this vault
// Result: Secure token storage controlled by program logic
```

**3. Escrow accounts**

```typescript
// Unique escrow for each trade
const [escrowPDA] = await getProgramDerivedAddress({
  programAddress: escrowProgram,
  seeds: ['escrow', tradeId],
});

// Result: Deterministic address for each escrow instance
```

**4. Game state accounts**

```typescript
// Unique game state for each match
const [gameStatePDA] = await getProgramDerivedAddress({
  programAddress: chessProgram,
  seeds: ['game', gameId, player1Address, player2Address],
});

// Result: Each game gets its own account
```

##### Important for Web Developers

You'll use PDAs extensively when building Solana UIs:

```typescript
// Example: Fetch user's game stats
async function fetchPlayerStats(playerWallet: Address) {
  // 1. Derive PDA (no blockchain query needed!)
  const [statsPDA] = await getProgramDerivedAddress({
    programAddress: gameProgram,
    seeds: ['player-stats', playerWallet],
  });

  // 2. Fetch account data
  const accountInfo = await rpc.getAccountInfo(statsPDA).send();

  // 3. Decode and display
  if (accountInfo?.value) {
    const stats = decodePlayerStats(accountInfo.value.data);
    return stats;  // { wins: 10, losses: 3, ... }
  }

  return null;  // Player hasn't played yet
}

// In your React component:
const stats = await fetchPlayerStats(wallet.publicKey);
console.log('Wins:', stats.wins);
console.log('Losses:', stats.losses);
```

**Benefits for frontend:**

- ✅ **No database needed** - Blockchain is the database
- ✅ **Instant derivation** - No waiting for blockchain queries
- ✅ **Type-safe** - TypeScript knows the structure
- ✅ **Decentralized** - Works with any RPC endpoint

---

#### Part 4: Compute Units and Fees

##### Transaction Fees

Every transaction on Solana costs a **base fee** of **5,000 lamports per signature** (0.000005 SOL).

```typescript
// Calculate transaction fee
const signers = 2;  // 2 required signatures
const baseFee = signers * 5_000;  // 10,000 lamports

console.log('Base fee:', baseFee, 'lamports');
console.log('In SOL:', lamportsToSol(baseFee));  // 0.00001 SOL

// At $100/SOL: $0.001 per transaction (extremely cheap!)
```

**Fee distribution:**

- 50% **burned** (removed from supply forever) 🔥
- 50% paid to **validator** who processed transaction 💰

**Why burn half?**
- Creates **deflationary pressure** on SOL token
- Rewards validators for processing transactions
- Prevents spam (fees accumulate for attackers)

##### Compute Units

Solana measures transaction **computational complexity** in **Compute Units (CUs)**.

**Limits:**

- **Default per instruction**: 200,000 CU
- **Maximum per transaction**: 1,400,000 CU
- **Simple transactions**: ~10,000 - 50,000 CU
- **Complex transactions**: 200,000 - 400,000 CU

**Why it matters:**

Complex transactions (many accounts, heavy computation, nested program calls) may exceed defaults. You can request more:

```typescript
import { getSetComputeUnitLimitInstruction } from 'gill/programs';

const transaction = createTransaction({
  version: 'legacy',
  feePayer: signer,
  latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
  instructions: [
    // Request higher compute limit (add as first instruction)
    getSetComputeUnitLimitInstruction({ units: 400_000 }),

    // Your actual instructions
    ...yourInstructions,
  ],
});

// Now this transaction can use up to 400,000 CU
```

**When to increase compute units:**

- ✅ Complex DeFi operations (swap + stake in one transaction)
- ✅ NFT minting with metadata
- ✅ Multi-step game logic
- ✅ Cross-program invocations

##### Priority Fees

To get your transaction processed **faster**, add a **priority fee**:

```typescript
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from 'gill/programs';

const transaction = createTransaction({
  version: 'legacy',
  feePayer: signer,
  latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
  instructions: [
    // Set compute limit
    getSetComputeUnitLimitInstruction({ units: 300_000 }),

    // Set priority fee (micro-lamports per CU)
    getSetComputeUnitPriceInstruction({ microLamports: 1_000 }),

    // Your instructions
    ...yourInstructions,
  ],
});

// Calculate total fee:
// Base fee: 5,000 lamports (1 signature)
// Priority fee: (300,000 CU × 1,000 micro-lamports) / 1,000,000
//             = 300 lamports
// Total: 5,300 lamports (0.0000053 SOL)
```

**Priority fee strategies:**

| Scenario | Micro-lamports/CU | Use Case |
|----------|-------------------|----------|
| **Low priority** | 100 - 500 | Non-urgent, background operations |
| **Normal** | 1,000 - 5,000 | Standard user transactions |
| **High** | 10,000 - 50,000 | Time-sensitive (arbitrage, NFT drops) |
| **Critical** | 100,000+ | Must execute ASAP (liquidations) |

**Best practice:** Use RPC provider APIs to get **recommended priority fees** dynamically:

```typescript
// Helius Priority Fee API example
const response = await fetch('https://mainnet.helius-rpc.com/?api-key=YOUR_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getPriorityFeeEstimate',
    params: [{ accountKeys: [myProgramAddress] }],
  }),
});

const { result } = await response.json();
const recommendedFee = result.priorityFeeEstimate;

console.log('Recommended priority fee:', recommendedFee, 'micro-lamports/CU');
```

**Providers with priority fee APIs:**

- [Helius Priority Fee API](https://docs.helius.dev/solana-rpc-nodes/priority-fee-api)
- [QuickNode Priority Fee API](https://www.quicknode.com/docs/solana/qn_estimatePriorityFees)
- [Triton Priority Fee API](https://docs.triton.one/rpc-pool/api-reference/priority-fee-estimates)

---

#### Lab Exercise 3: Solana Explorer CLI Tool

Build a command-line tool that displays comprehensive account information.

**Features to implement:**

1. Accept a Solana address as input
2. Query and display:
   - Balance (SOL and lamports)
   - Account owner (with type identification)
   - Executable status
   - Rent epoch
   - Data size
   - Account type (System, Token, Program, Data)
3. Handle errors gracefully (invalid address, account not found)
4. Format output beautifully

**Starter Code:**

```typescript
// src/explorer.ts
import { createSolanaClient, lamportsToSol, checkedAddress } from 'gill';

async function exploreAccount(addressString: string) {
  try {
    const addr = checkedAddress(addressString);
    const { rpc } = createSolanaClient({ urlOrMoniker: 'devnet' });

    console.log('🔍 Solana Account Explorer');
    console.log('═'.repeat(60));
    console.log('Address:', addressString);
    console.log('─'.repeat(60));

    const accountInfo = await rpc.getAccountInfo(addr).send();

    if (!accountInfo?.value) {
      console.log('❌ Account not found on devnet');
      console.log('\nThis account may:');
      console.log('  • Not exist yet');
      console.log('  • Exist on a different cluster (mainnet/testnet)');
      console.log('  • Have been closed');
      return;
    }

    const { lamports, owner, executable, rentEpoch, data } = accountInfo.value;

    // TODO: Display all account information
    // TODO: Identify account type by owner
    // TODO: Format balance nicely
    // TODO: Show rent status
    // TODO: Add explorer link

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check:');
    console.log('  • Address format is valid (base58, 32-44 chars)');
    console.log('  • Network connection is working');
  }
}

const address = process.argv[2];

if (!address) {
  console.error('Usage: npm run explore <solana-address>');
  console.error('\nExample:');
  console.error('  npm run explore 7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1');
  process.exit(1);
}

exploreAccount(address).catch(console.error);
```

**Expected Output:**

```
🔍 Solana Account Explorer
════════════════════════════════════════════════════════════
Address: 7xJ9qH5GqXq3qF3wK1P2vN8fR4dS5tU6wV7yX8zZ9aA1
────────────────────────────────────────────────────────────

💰 Balance Information
  SOL:               2.000000 ◎
  Lamports:          2,000,000,000
  Rent Status:       ✅ Rent-exempt

📋 Account Details
  Owner:             11111111111111111111111111111111
  Account Type:      System Account (Wallet)
  Executable:        No
  Data Size:         0 bytes
  Rent Epoch:        0

🔗 Explorer Links
  Devnet:  https://explorer.solana.com/address/7xJ9qH...?cluster=devnet
  Mainnet: https://explorer.solana.com/address/7xJ9qH...

════════════════════════════════════════════════════════════
```

**Challenge Extensions:**

1. **Add color output** - Install and use `chalk` for colored terminal text
2. **Show transaction history** - Fetch recent signatures with `getSignaturesForAddress()`
3. **Decode token accounts** - Parse SPL token account data and show token info
4. **Support cluster switching** - Add `--cluster mainnet|devnet|testnet` flag
5. **Export JSON** - Add `--json` flag for machine-readable output
6. **Interactive mode** - Allow entering multiple addresses without restarting

**Hints:**

```typescript
// Identify account type by owner
const SYSTEM_PROGRAM = '11111111111111111111111111111111';
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

if (owner === SYSTEM_PROGRAM) {
  accountType = 'System Account (Wallet)';
} else if (owner === TOKEN_PROGRAM) {
  accountType = 'Token Account';
} else if (executable) {
  accountType = 'Program (Executable)';
} else {
  accountType = 'Program Data Account';
}

// Format address for display
const formatAddress = (addr: string) =>
  `${addr.slice(0, 4)}...${addr.slice(-4)}`;

// Create explorer link
const explorerLink = (addr: string, cluster: string) =>
  `https://explorer.solana.com/address/${addr}?cluster=${cluster}`;
```

---

#### Key Concepts Summary

✅ **Accounts** - Fundamental storage units on Solana (address, lamports, data, owner, executable)
✅ **Account ownership** - Only owner programs can modify account data or deduct lamports
✅ **Rent exemption** - Minimum balance (based on data size) required to keep accounts on-chain
✅ **Transactions** - Atomic bundles of instructions (all succeed or all fail)
✅ **Instructions** - Individual operations within a transaction (program ID + accounts + data)
✅ **Atomicity** - If any instruction fails, entire transaction is reverted
✅ **Blockhash** - Timestamp mechanism preventing transaction replay (expires ~60-90 seconds)
✅ **PDAs** - Deterministic addresses with no private key (program-controlled)
✅ **Compute units** - Measure of transaction computational complexity
✅ **Priority fees** - Optional fees to speed up transaction processing

---

## Practical Assignment

### Build a Solana Account Explorer Web App

Create a web application that allows users to explore Solana accounts on devnet.

#### Requirements

**Core Functionality:**

1. **Connection Management**
   - Connect to Solana devnet using Gill
   - Display connection status
   - Show current RPC endpoint

2. **Address Input**
   - Accept Solana address input (text field)
   - Validate address format before querying
   - Show helpful error messages for invalid addresses
   - Support pasting from clipboard

3. **Account Information Display**
   - Balance in SOL (formatted with decimals)
   - Balance in lamports (formatted with commas)
   - Account owner (program ID)
   - Account type (System Account, Token Account, Program, or Data Account)
   - Executable status (Yes/No or icon)
   - Rent epoch
   - Data size in bytes
   - Link to Solana Explorer

4. **Error Handling**
   - Invalid address format → Clear error message
   - Account not found → Indicate account doesn't exist
   - Network errors → Retry option or fallback message
   - Rate limiting → Show friendly message

5. **Loading States**
   - Show loading indicator while querying
   - Disable input during query
   - Show progress for long operations

#### Bonus Features (Optional)

6. **Transaction History**
   - Fetch and display 5 most recent transactions
   - Show transaction signatures with links
   - Display transaction status (confirmed/finalized)

7. **Cluster Switching**
   - Allow switching between devnet/mainnet/testnet
   - Update UI to indicate current cluster
   - Persist selection in localStorage

8. **Multiple Address Support**
   - Support querying multiple addresses
   - Display results in a table or list
   - Allow saving favorite addresses

9. **Export Functionality**
   - Export account info to JSON
   - Copy data to clipboard
   - Generate shareable link

10. **Responsive Design**
    - Mobile-friendly layout
    - Clean, modern UI (use Tailwind CSS or similar)
    - Dark mode support

#### Implementation Guide

##### Option 1: React + Vite (Recommended)

**Project Setup:**

```bash
# Create project with Vite
npm create vite@latest solana-explorer -- --template react-ts
cd solana-explorer
npm install
npm install gill

# Start dev server
npm run dev
```

**Folder Structure:**

```
src/
├── App.tsx              # Main component
├── components/
│   ├── AddressInput.tsx
│   ├── AccountInfo.tsx
│   ├── ConnectionStatus.tsx
│   └── ErrorDisplay.tsx
├── hooks/
│   └── useSolanaAccount.ts
├── utils/
│   └── format.ts
└── types.ts
```

**Sample Component:**

```typescript
// src/App.tsx
import { useState } from 'react';
import { createSolanaClient, lamportsToSol, checkedAddress } from 'gill';
import type { Address } from '@solana/kit';

interface AccountData {
  address: string;
  balance: bigint;
  balanceSol: string;
  owner: Address;
  executable: boolean;
  rentEpoch: bigint;
  dataSize: number;
  accountType: string;
}

function App() {
  const [addressInput, setAddressInput] = useState('');
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { rpc } = createSolanaClient({ urlOrMoniker: 'devnet' });

  const handleSearch = async () => {
    setError('');
    setAccountData(null);
    setLoading(true);

    try {
      // Validate address
      const addr = checkedAddress(addressInput.trim());

      // Query account
      const accountInfo = await rpc.getAccountInfo(addr).send();

      if (!accountInfo?.value) {
        setError('Account not found on devnet');
        return;
      }

      const { lamports, owner, executable, rentEpoch, data } = accountInfo.value;

      // Determine account type
      let accountType = 'Data Account';
      if (executable) {
        accountType = 'Program';
      } else if (owner === '11111111111111111111111111111111') {
        accountType = 'System Account';
      } else if (owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
        accountType = 'Token Account';
      }

      setAccountData({
        address: addressInput,
        balance: lamports,
        balanceSol: lamportsToSol(lamports).toString(),
        owner,
        executable,
        rentEpoch,
        dataSize: data.length,
        accountType,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Solana Account Explorer</h1>
      <p>Explore accounts on Solana Devnet</p>

      <div style={{ marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Enter Solana address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !addressInput}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            background: '#14F195',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !addressInput ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
        }}>
          {error}
        </div>
      )}

      {accountData && (
        <div style={{
          marginTop: '2rem',
          background: '#f5f5f5',
          padding: '2rem',
          borderRadius: '12px',
        }}>
          <h2>Account Information</h2>

          <div style={{ marginTop: '1rem' }}>
            <strong>Address:</strong>
            <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {accountData.address}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Balance:</strong>
            <div>{accountData.balanceSol} SOL</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Balance (lamports):</strong>
            <div>{accountData.balance.toLocaleString()}</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Account Type:</strong>
            <div>{accountData.accountType}</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Owner:</strong>
            <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {accountData.owner}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Executable:</strong>
            <div>{accountData.executable ? 'Yes' : 'No'}</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Data Size:</strong>
            <div>{accountData.dataSize.toLocaleString()} bytes</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Rent Epoch:</strong>
            <div>{accountData.rentEpoch.toString()}</div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a
              href={`https://explorer.solana.com/address/${accountData.address}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#14F195' }}
            >
              View on Solana Explorer →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
```

##### Option 2: Next.js (For Advanced Features)

```bash
npx create-next-app@latest solana-explorer --typescript
cd solana-explorer
npm install gill
npm run dev
```

##### Option 3: CLI Tool (Alternative to Web App)

See Lab Exercise 3 for detailed CLI implementation.

---

#### Testing Your Application

**Test Cases:**

1. **System Account (Wallet)**
   ```
   Use your own devnet wallet address from Lesson 1
   Expected: System Account, has SOL balance
   ```

2. **Non-existent Account**
   ```
   Use a randomly generated valid address
   Expected: "Account not found" message
   ```

3. **Invalid Address Format**
   ```
   Input: "invalid-address-123"
   Expected: Validation error before querying
   ```

4. **Program Account**
   ```
   Use: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA (Token Program)
   Expected: Program type, executable = true
   ```

5. **Edge Cases**
   ```
   • Empty input
   • Address with whitespace
   • Very long invalid string
   • Network timeout (disconnect internet)
   ```

---

#### Submission Requirements

**Deliverables:**

- [ ] Working application (web or CLI)
- [ ] Source code (well-commented)
- [ ] README.md with:
  - Setup instructions
  - How to run
  - Features implemented
  - Technologies used
  - Screenshots
- [ ] Handles all error cases gracefully
- [ ] TypeScript with no type errors
- [ ] Clean, formatted code

**README.md Template:**

```markdown
# Solana Account Explorer

A web application for exploring Solana accounts on devnet.

## Features

- Query any Solana address on devnet
- Display comprehensive account information
- Validate addresses before querying
- Error handling for edge cases
- [List your bonus features]

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage

1. Enter a Solana address in the search box
2. Click "Search"
3. View detailed account information

## Technologies

- React + TypeScript
- Gill (Solana client library)
- Vite (build tool)
- [Other libraries you used]

## Example Addresses

- System Account: [your devnet wallet]
- Token Program: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

## Screenshots

[Add screenshots here]
\`\`\`

---

## Additional Resources

### Required Reading

- [Gill Library Documentation](https://gillsdk.com)
  - Getting started guide
  - API reference
  - Example projects

- [Solana Core Concepts: Accounts](https://solana.com/docs/core/accounts)
  - Account structure and types
  - Ownership model
  - Rent exemption

- [Solana Core Concepts: Transactions](https://solana.com/docs/core/transactions)
  - Transaction anatomy
  - Instructions and atomicity
  - Blockhash expiration

- [Solana Core Concepts: PDAs](https://solana.com/docs/core/pda)
  - What PDAs are and why they exist
  - Derivation process
  - Use cases

- [Anza Wallet Adapter Documentation](https://github.com/anza-xyz/wallet-adapter)
  - APP.md - Integration guide for applications
  - BUILD.md - Building from source
  - WALLET.md - Wallet developer guide

### Supplementary Materials

- [Solana Installation Guide](https://solana.com/docs/intro/installation)
  - One-line installer for all tools
  - Platform-specific instructions
  - Troubleshooting

- [Solana Transaction Fees](https://solana.com/docs/core/fees)
  - Base fees and priority fees
  - Compute units
  - Fee optimization

- [Solana Cookbook](https://solanacookbook.com/)
  - Practical recipes for common tasks
  - Code examples across multiple languages
  - Best practices

- [Wallet Adapter Demo](https://anza-xyz.github.io/wallet-adapter/example/)
  - Live example application
  - Test wallet integration
  - See UI components in action

- [Turborepo Documentation](https://turbo.build/repo/docs)
  - Understanding monorepo architecture
  - Build pipeline optimization
  - Caching strategies

### Video Tutorials (Optional)

- [Solana Bytes: Accounts](https://www.youtube.com/watch?v=1DRBpUpcX3w) (YouTube)
- [Solana Bytes: Transactions](https://www.youtube.com/watch?v=3jRYQWPhSLk) (YouTube)
- [Wallet Adapter Overview](https://www.youtube.com/results?search_query=solana+wallet+adapter+tutorial)

---

## Common Issues and Solutions

### Issue: "Cannot find module 'gill'"

**Solution:** Ensure gill is properly installed:

```bash
npm install gill --save
# or
pnpm add gill
```

If using TypeScript, ensure `node_modules` is in your module resolution path.

---

### Issue: RPC rate limiting

**Symptoms:**
- Requests fail with 429 error
- "Too many requests" message
- Intermittent timeouts

**Solutions:**

1. **Use localhost for development:**
   ```bash
   # Terminal 1: Start local validator
   solana-test-validator

   # Terminal 2: In your code
   createSolanaClient({ urlOrMoniker: 'localnet' })
   ```

2. **Add request throttling:**
   ```typescript
   // Simple throttle: wait between requests
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

3. **Use a dedicated RPC provider:**
   - [Helius](https://helius.dev) - Free tier: 100 req/sec
   - [QuickNode](https://quicknode.com) - Free tier available
   - [Alchemy](https://alchemy.com) - Generous free tier

---

### Issue: pnpm command not found

**Symptoms:**
```
command not found: pnpm
```

**Solution:**

```bash
# Enable pnpm via Corepack (built into Node 16+)
corepack enable
corepack prepare pnpm@9.1.0 --activate

# Verify
pnpm --version
```

---

### Issue: wallet-adapter build fails

**Symptoms:**
- TypeScript errors during build
- "Cannot find module" errors
- Out of memory errors

**Solutions:**

1. **Check Node version:**
   ```bash
   node --version  # Should be 18+ or 20+
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

3. **Increase memory:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```

---

### Issue: "Blockhash not found" or "Transaction expired"

**Symptoms:**
- Transaction fails after delay
- "Blockhash not found" error

**Cause:** Blockhash expired (older than ~60-90 seconds)

**Solution:** Fetch fresh blockhash immediately before signing:

```typescript
// ❌ BAD: Blockhash might expire
const { value: blockhash } = await rpc.getLatestBlockhash().send();
await doSomethingTimeConsuming();  // 2 minutes pass
const tx = createTransaction({ latestBlockhash: blockhash, ... });

// ✅ GOOD: Fresh blockhash
const tx = createTransaction({
  latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
  ...
});
```

---

### Issue: CORS errors in browser

**Symptoms:**
```
Access to fetch at 'https://api.devnet.solana.com' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solutions:**

1. **Use a CORS-enabled RPC endpoint** (most dedicated providers support this)

2. **Use a proxy in development:**
   ```javascript
   // vite.config.ts
   export default {
     server: {
       proxy: {
         '/rpc': {
           target: 'https://api.devnet.solana.com',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/rpc/, '')
         }
       }
     }
   }
   ```

3. **Use a dedicated RPC provider** (Helius, QuickNode, etc. - have CORS configured)

---

### Issue: "Invalid address format"

**Symptoms:**
- Address validation fails
- Error creating address object

**Common causes:**

1. **Extra whitespace:**
   ```typescript
   const cleaned = addressInput.trim();
   const addr = checkedAddress(cleaned);
   ```

2. **Wrong format (hex instead of base58):**
   ```
   ❌ 0x7a89b3f... (hex - Ethereum style)
   ✅ 7xJ9qH5Gq... (base58 - Solana style)
   ```

3. **Truncated address:**
   ```
   Solana addresses are 32-44 characters (base58 encoded)
   If shorter, it's truncated for display
   ```

---

## Week 1 Quiz Questions

Test your understanding with these questions:

1. **What advantages does gill offer over Web3.js?**
   <details>
   <summary>Answer</summary>

   - Smaller bundle sizes through tree-shaking
   - TypeScript-first with full type safety
   - Modern JavaScript patterns and API design
   - Modular architecture (import only what you need)
   - Built on next-gen @solana/kit foundation
   - Quality-of-life improvements like `createTransaction()`
   - Better developer experience with cleaner APIs
   - One-to-one compatibility with @solana/kit

   </details>

2. **Explain the difference between a Solana account and a wallet**
   <details>
   <summary>Answer</summary>

   **Account:** A data structure on Solana containing address, lamports, data, owner, and executable flag. Accounts store all on-chain information (balances, program code, user data, etc.).

   **Wallet:** A software/hardware tool that manages keypairs (private/public keys) and signs transactions. A wallet controls one or more accounts but is not stored on the blockchain itself.

   **Analogy:** Account = bank account (stored at the bank), Wallet = ATM card/app to access it (you hold the keys)

   </details>

3. **What is the purpose of the `.send()` method in Gill?**
   <details>
   <summary>Answer</summary>

   The `.send()` method executes RPC requests. Gill uses **lazy evaluation** - calling an RPC method like `rpc.getSlot()` creates a request object but doesn't execute it until `.send()` is called.

   **Benefits:**
   - **Composability** - Pass requests around as values
   - **Testability** - Build requests without network calls
   - **Consistency** - All RPC methods use same pattern
   - **Deferred execution** - Control exactly when network request happens

   </details>

4. **How do you convert lamports to SOL? Provide the formula.**
   <details>
   <summary>Answer</summary>

   **Formula:** `SOL = lamports / 1,000,000,000`

   **In code:**
   ```typescript
   import { lamportsToSol, LAMPORTS_PER_SOL } from 'gill';

   // Option 1: Using utility function (recommended)
   const sol = lamportsToSol(2_000_000_000);  // 2

   // Option 2: Manual calculation
   const sol = 2_000_000_000 / LAMPORTS_PER_SOL;  // 2
   ```

   **Reverse (SOL to lamports):** `lamports = SOL * 1,000,000,000`
   ```typescript
   const lamports = 2 * LAMPORTS_PER_SOL;  // 2,000,000,000
   ```

   </details>

5. **What information does `getAccountInfo()` return?**
   <details>
   <summary>Answer</summary>

   Returns an object containing:

   ```typescript
   {
     value: {
       lamports: bigint;        // Account balance in lamports
       owner: Address;          // Program that owns this account
       data: Uint8Array;        // Account data bytes
       executable: boolean;     // True if account is a program
       rentEpoch: bigint;      // Epoch when rent is due (historical)
     } | null  // null if account doesn't exist
   }
   ```

   If account doesn't exist, returns `{ value: null }`

   </details>

6. **What is atomicity in Solana transactions?**
   <details>
   <summary>Answer</summary>

   **Atomicity** means transactions are "all or nothing":

   - If **all** instructions succeed → transaction confirmed ✅
   - If **any** instruction fails → **entire** transaction reverted ❌

   No partial state changes persist. This ensures **consistency** - the blockchain never ends up in an invalid state due to partial execution.

   **Example:** Transaction with 3 instructions - if instruction #2 fails, changes from instruction #1 are reverted and instruction #3 doesn't execute. The blockchain state remains unchanged as if the transaction never happened.

   </details>

7. **How long is a blockhash valid?**
   <details>
   <summary>Answer</summary>

   **~60-90 seconds** (approximately 150 blocks at 400ms per block)

   Blockhashes are used to prevent transaction replay attacks. Once expired, transactions using that blockhash will be rejected by the network.

   **Best practice:** Fetch a fresh blockhash immediately before signing and sending transactions. Don't build transactions far in advance.

   **Check expiration:**
   ```typescript
   const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
   console.log('Expires at block:', latestBlockhash.lastValidBlockHeight);
   ```

   </details>

8. **What are the 5 fields in every Solana account?**
   <details>
   <summary>Answer</summary>

   1. **Address** - Unique 32-byte public key (shown as base58 string)
   2. **Lamports** - Balance in smallest unit (bigint)
   3. **Data** - Arbitrary byte array (0 bytes to 10MB max)
   4. **Owner** - Program ID that controls this account
   5. **Executable** - Boolean indicating if account contains program code

   </details>

9. **What is a Program Derived Address (PDA)?**
   <details>
   <summary>Answer</summary>

   A **Program Derived Address** is:

   - An address **without a corresponding private key**
   - Derived **deterministically** from a program ID and seeds
   - Intentionally falls **off the Ed25519 elliptic curve** (no valid keypair exists)
   - Only the deriving program can "sign" for this address

   **Key characteristics:**
   - Deterministic (same inputs always produce same PDA)
   - No private key (cannot be compromised)
   - Program-controlled (only that program can authorize operations)

   **Use cases:**
   - User-specific data accounts (`["user-profile", userWallet]`)
   - Program-controlled vaults (`["token-vault", programId]`)
   - Escrow accounts (`["escrow", tradeId]`)

   **Example:**
   ```typescript
   const [profilePDA] = await getProgramDerivedAddress({
     programAddress: myProgram,
     seeds: ['user-profile', userWallet],
   });
   // Frontend can derive this without blockchain query!
   ```

   </details>

10. **What is the base transaction fee on Solana?**
    <details>
    <summary>Answer</summary>

    **5,000 lamports per signature** (0.000005 SOL)

    **Distribution:**
    - 50% burned (removed from supply) 🔥
    - 50% paid to validator who processed the transaction 💰

    **Example calculation:**
    - Transaction with 1 signature = 5,000 lamports
    - Transaction with 2 signatures = 10,000 lamports (0.00001 SOL)

    **Additional costs:**
    - **Priority fees** (optional) - Speed up processing
    - **Rent** (one-time) - For creating new accounts

    At $100/SOL, a typical transaction costs ~$0.0005 (half a cent)

    </details>

---

## Looking Ahead

**Next Week: Wallet Integration and Building Solana Web Applications**

In Week 2, you'll learn to build full-stack Solana applications with wallet integration:

- Integrating wallet-adapter into React applications
- Building wallet connection UI components
- Handling multiple wallet types (Phantom, Solflare, Backpack, etc.)
- Implementing wallet-based authentication
- Signing and sending transactions from the browser
- Building a complete Solana dApp from scratch
- Best practices for wallet UX and error handling

**Prerequisites for next week:**

1. ✅ Complete this week's assignments (environment setup, wallet-ui exploration, Gill program)
2. 📱 Install at least one browser wallet extension:
   - [Phantom](https://phantom.app/) (recommended for beginners)
   - [Solflare](https://solflare.com/)
   - [Backpack](https://backpack.app/)
3. 💰 Fund your wallet with devnet SOL using the wallet's built-in faucet
4. ✨ Familiarize yourself with wallet interfaces (connect, disconnect, sign, send SOL)
5. 🔍 Explore the wallet-adapter example we ran in Lesson 1

**Preparation task:** Create a new wallet in Phantom, switch it to devnet, request an airdrop, and successfully send 0.1 SOL to a friend's wallet. Bring any questions about the wallet experience to next week's session!

---

## Feedback and Support

**Questions?**
- Review the Required Reading materials above
- Re-watch any referenced video tutorials
- Explore the wallet-adapter codebase we cloned
- Post questions in the course discussion forum
- Attend office hours (schedule TBA)

**Found an error in this module?**
- Submit an issue with the `content-bug` label
- Include the section reference and suggested correction
- Screenshots are helpful for clarity

**Completed the assignment?**
- Submit via the course platform
- Include README with setup instructions
- Ensure code runs without errors
- Add screenshots of working application

**Want to go deeper?**
- Explore other packages in the wallet-adapter monorepo
- Try building a custom wallet adapter
- Read the Solana source code on GitHub
- Join the Solana Discord community

---

**Course Maintenance Note:** This module was last updated for Solana 1.18, Anchor 0.32, Gill 1.x, and wallet-adapter 0.19+. Toolchain versions and APIs may change - consult the official documentation for the latest information.

**Acknowledgments:** This curriculum is built on the excellent work of the Solana Foundation, Anza (formerly Solana Labs), and the broader Solana developer community. Special thanks to all contributors to the wallet-adapter, gill, and Solana documentation projects.
