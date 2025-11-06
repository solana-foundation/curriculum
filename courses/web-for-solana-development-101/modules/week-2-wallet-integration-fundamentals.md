# Week 2: Wallet Integration Fundamentals

## Overview

This week covers integrating Solana wallets into web applications using the `wallet-ui` library and modern wallet adapter patterns. Topics include building robust wallet connection interfaces, handling multiple wallet types, and implementing wallet-based authentication.

## Learning Objectives

Learning outcomes for this week include:

1. Set up wallet providers using `@wallet-ui/react`
2. Build custom wallet connection UI components
3. Handle wallet connection states and errors gracefully
4. Support multiple wallet adapters (Phantom, Solflare, Backpack)
5. Implement auto-connect and wallet persistence features

---

## Lessons

### Lesson 1: Setting Up Wallet Providers

#### Introduction

Wallet integration is fundamental to Solana web applications. Unlike traditional web apps where users authenticate with email and password, blockchain applications rely on cryptographic wallets to identify users and authorize transactions. The Solana wallet adapter provides a standardized way to integrate multiple wallet types into a single React application.

In this lesson, you'll learn about the wallet adapter architecture, set up provider components that manage wallet state, configure cluster connections, and understand how React Context enables wallet functionality throughout your application.

**Note on Terminology:** Throughout this course, when we refer to `wallet-ui` or `@wallet-ui/react`, we're referring to the Solana Wallet Adapter packages (`@solana/wallet-adapter-react` and `@solana/wallet-adapter-react-ui`). The wallet adapter provides the UI components and React integration for wallet management.

#### Topics Covered

- Understanding the wallet adapter architecture
- Configuring `WalletUi` provider
- Cluster management with wallet-ui
- Storage patterns for wallet preferences
- Provider composition in React

---

#### Part 1: Understanding Wallet Adapter Architecture

##### The Wallet Adapter Ecosystem

The Solana wallet adapter is a modular TypeScript system that provides:

1. **Standardized wallet interfaces** - Common API across 37+ wallet implementations
2. **React integration** - Context providers and hooks for wallet state management
3. **UI components** - Pre-built buttons and modals for wallet interaction
4. **Automatic wallet discovery** - Detects installed wallets without explicit configuration

##### Core Packages

**@solana/wallet-adapter-base**
- Defines the `WalletAdapter` interface
- Provides error types (`WalletError`, `WalletNotConnectedError`, etc.)
- Includes `WalletReadyState` enum for wallet detection

**@solana/wallet-adapter-react**
- Exports `ConnectionProvider`, `WalletProvider` for state management
- Provides hooks: `useWallet()`, `useConnection()`, `useAnchorWallet()`
- Handles wallet lifecycle (connection, disconnection, errors)

**@solana/wallet-adapter-react-ui**
- Pre-built components: `WalletMultiButton`, `WalletDisconnectButton`
- Modal system for wallet selection
- Customizable CSS styles

**@solana/wallet-adapter-wallets**
- Meta-package bundling all individual wallet adapters
- Supports tree-shaking for optimal bundle size
- Alternative to importing individual wallet packages

##### Wallet Ready States

Every wallet adapter reports its availability through `WalletReadyState`:

| State | Description | Example |
|-------|-------------|---------|
| `Installed` | Wallet extension is installed and ready | Phantom installed in Chrome |
| `NotDetected` | Wallet not installed in browser | User doesn't have Solflare |
| `Loadable` | Wallet can be loaded (usually mobile) | Wallet Connect on mobile |
| `Unsupported` | Wallet doesn't support this environment | Hardware wallet on mobile |

**Code Example:**

```typescript
import { WalletReadyState } from '@solana/wallet-adapter-base';

// Check if wallet is ready to use
if (wallet.readyState === WalletReadyState.Installed) {
  // Wallet is available
  await wallet.connect();
} else if (wallet.readyState === WalletReadyState.NotDetected) {
  // Show installation instructions
  window.open(wallet.url, '_blank');
}
```

##### The Provider Hierarchy

Wallet adapter uses three nested React Context providers:

```
ConnectionProvider (RPC connection)
  └─ WalletProvider (wallet state management)
      └─ WalletModalProvider (UI modal state)
          └─ Your App Components
```

**Why this order matters:**
- `ConnectionProvider` establishes blockchain connection (needed by wallet operations)
- `WalletProvider` manages wallet state (depends on connection for transactions)
- `WalletModalProvider` handles UI state (depends on wallet provider for available wallets)

---

#### Part 2: Installing Dependencies

##### Required Packages

Install the wallet adapter packages and Solana web3.js:

```bash
npm install \
  @solana/web3.js \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets
```

**Package Purposes:**

- `@solana/web3.js` - Core Solana blockchain interaction library
- `@solana/wallet-adapter-base` - Base interfaces and types
- `@solana/wallet-adapter-react` - React hooks and providers
- `@solana/wallet-adapter-react-ui` - Pre-built UI components
- `@solana/wallet-adapter-wallets` - Bundled wallet adapters

##### Individual Wallet Adapters (Optional)

Instead of the wallets meta-package, you can install specific wallet adapters:

```bash
npm install \
  @solana/wallet-adapter-phantom \
  @solana/wallet-adapter-solflare \
  @solana/wallet-adapter-coinbase
```

**When to use individual adapters:**
- You only support a few specific wallets
- You need maximum bundle size optimization
- You want explicit version control for each wallet

**When to use @solana/wallet-adapter-wallets:**
- You want to support many wallets easily
- Bundle size is not a primary concern (tree-shaking helps)
- You want automatic updates for all wallet adapters

##### TypeScript Support

TypeScript definitions are included. No additional `@types` packages needed for wallet adapter.

---

#### Part 3: Setting Up ConnectionProvider

##### Understanding Solana Clusters

Solana operates multiple independent networks:

| Cluster | Purpose | Endpoint | Tokens |
|---------|---------|----------|--------|
| **Devnet** | Development and testing | `https://api.devnet.solana.com` | Free (airdrop) |
| **Testnet** | Stress testing new features | `https://api.testnet.solana.com` | Free (airdrop) |
| **Mainnet Beta** | Production environment | `https://api.mainnet-beta.solana.com` | Real SOL |
| **Localhost** | Local validator | `http://127.0.0.1:8899` | Developer-controlled |

**For this course, we'll use Devnet** - it behaves like mainnet but uses free test tokens.

##### Creating the Connection Provider

**Basic Setup:**

```typescript
import React from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

export default function App() {
  // Use devnet for development
  const endpoint = clusterApiUrl('devnet');

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* Your app components */}
    </ConnectionProvider>
  );
}
```

##### Using useMemo for Performance

React Context providers re-render all children when their value changes. We should memoize the endpoint to prevent unnecessary re-renders:

```typescript
import React, { useMemo } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

export default function App() {
  // Configure network
  const network = WalletAdapterNetwork.Devnet;

  // Memoize endpoint - only recreate if network changes
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* Your app components */}
    </ConnectionProvider>
  );
}
```

**Why memoization matters:**
- Without memoization, `clusterApiUrl()` creates a new string on every render
- React Context treats new strings as different values
- All children re-render unnecessarily
- With `useMemo`, endpoint only changes when `network` changes

##### Custom RPC Endpoints

The public Solana endpoints have rate limits:
- 100 requests per 10 seconds per IP
- 40 requests per 10 seconds for a single RPC method
- 40 concurrent connections

**For production apps, use a private RPC provider:**

```typescript
const endpoint = useMemo(() => {
  if (process.env.NODE_ENV === 'production') {
    // Use private RPC service in production
    return 'https://your-project.helius-rpc.com';
  }
  // Use public endpoint in development
  return clusterApiUrl('devnet');
}, []);
```

**Popular RPC Providers:**
- **Helius** - Generous free tier, excellent DX
- **QuickNode** - Enterprise-grade infrastructure
- **Alchemy** - Multi-chain support
- **Triton** - Built by Solana Labs

##### Connection Configuration

Customize the connection with optional config:

```typescript
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

const config = {
  commitment: 'confirmed',    // Transaction confirmation level
  wsEndpoint: undefined,      // Custom WebSocket endpoint (optional)
  httpHeaders: undefined,     // Custom HTTP headers (optional)
  fetch: undefined,           // Custom fetch implementation (optional)
};

<ConnectionProvider endpoint={endpoint} config={config}>
  {children}
</ConnectionProvider>
```

**Commitment Levels (in order of finality):**

1. `'processed'` - Node's most recent block (may be skipped by cluster)
2. `'confirmed'` - Block voted on by supermajority (**recommended default**)
3. `'finalized'` - Block confirmed with maximum lockout (highest finality)

**When to use each:**
- **processed**: Real-time updates (may see reorgs)
- **confirmed**: Most use cases (good balance of speed and finality)
- **finalized**: When absolute finality is required (slower)

---

#### Part 4: Setting Up WalletProvider

##### Understanding WalletProvider

`WalletProvider` manages wallet adapter instances and provides wallet state to your application. It:

1. Tracks available wallet adapters
2. Manages connection/disconnection lifecycle
3. Persists user's wallet selection to localStorage
4. Handles auto-connect logic
5. Provides wallet state via React Context

##### Basic WalletProvider Setup

```typescript
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [network] // Recreate if network changes
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {/* Your app components */}
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

##### Wallet Auto-Detection

Wallets implementing the Wallet Standard or Solana Mobile Wallet Adapter Protocol are **automatically detected** without explicit configuration:

```typescript
// Empty wallets array still works!
const wallets = useMemo(() => [], []);

// Standard wallets (Phantom, Solflare, etc.) are auto-detected
// Mobile wallets are automatically available on mobile devices
<WalletProvider wallets={wallets} autoConnect>
  {children}
</WalletProvider>
```

**Auto-detected wallets include:**
- Phantom
- Solflare
- Backpack
- Glow
- Slope
- Sollet
- And any other wallet implementing the standard

**When to explicitly configure wallets:**
- You want to control the order wallets appear in UI
- You need specific wallet adapter configurations
- You're using legacy wallets not supporting the standard

##### Using the Wallets Meta-Package

Import all wallets at once with tree-shaking support:

```typescript
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new CoinbaseWalletAdapter(),
    new LedgerWalletAdapter(),
    new TorusWalletAdapter(),
  ],
  [network]
);
```

**Tree-shaking ensures unused wallet adapters aren't included in your bundle.**

##### WalletProvider Props

```typescript
interface WalletProviderProps {
  children: ReactNode;
  wallets: Adapter[];                    // Array of wallet adapter instances
  autoConnect?: boolean;                 // Auto-connect on mount (default: false)
  localStorageKey?: string;              // Storage key for wallet name (default: 'walletName')
  onError?: (error: WalletError) => void; // Error handler callback
}
```

**Example with all props:**

```typescript
const onError = useCallback((error: WalletError) => {
  console.error('Wallet error:', error);
  // Show user-friendly notification
  toast.error(error.message);
}, []);

<WalletProvider
  wallets={wallets}
  autoConnect={true}
  localStorageKey="myApp:wallet"
  onError={onError}
>
  {children}
</WalletProvider>
```

---

#### Part 5: Setting Up WalletModalProvider

##### Understanding WalletModalProvider

`WalletModalProvider` manages the visibility state of the wallet selection modal. It wraps the `WalletModal` component and provides controls to show/hide it from anywhere in your app.

##### Basic Setup

```typescript
import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import CSS styles
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

**Critical: Import the CSS stylesheet** or the modal won't display correctly:

```typescript
import '@solana/wallet-adapter-react-ui/styles.css';
```

##### WalletModalProvider Features

The modal automatically:
- Lists all available wallets
- Shows wallet icons and names
- Indicates wallet ready state (Installed, NotDetected, etc.)
- Provides wallet download links for uninstalled wallets
- Filters and sorts wallets by availability
- Handles wallet selection and connection

##### Customizing Modal Appearance

Override CSS variables in your stylesheet:

```css
/* Custom modal styling */
.wallet-adapter-modal {
  --wallet-adapter-modal-background: #1a1a1a;
  --wallet-adapter-modal-color: #ffffff;
  --wallet-adapter-button-background: #512da8;
  --wallet-adapter-button-hover-background: #6a3fb8;
}
```

##### Controlling Modal Visibility

Use the `useWalletModal()` hook to show/hide the modal programmatically:

```typescript
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

function CustomButton() {
  const { setVisible } = useWalletModal();

  return (
    <button onClick={() => setVisible(true)}>
      Choose Wallet
    </button>
  );
}
```

---

#### Part 6: Complete Provider Setup Example

##### Full Application Structure

**providers/SolanaProvider.tsx:**

```typescript
'use client'; // Required for Next.js 13+ App Router

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // Configure network (can be made dynamic with state/context)
  const network = WalletAdapterNetwork.Devnet;

  // Memoize RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC in production
    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      return process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }
    // Use public endpoint in development
    return clusterApiUrl(network);
  }, [network]);

  // Memoize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

##### Integrating with Next.js App Router

**app/layout.tsx:**

```typescript
import './globals.css';
import { SolanaProvider } from '@/components/providers/SolanaProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
```

##### Integrating with Vite/Create React App

**main.tsx or index.tsx:**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SolanaProvider } from './components/providers/SolanaProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </React.StrictMode>
);
```

---

#### Part 7: Cluster Management Patterns

##### Dynamic Cluster Switching

Allow users to switch between clusters (useful for testing):

**ClusterProvider.tsx:**

```typescript
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useLocalStorage } from '@solana/wallet-adapter-react';

interface ClusterContextState {
  cluster: WalletAdapterNetwork;
  setCluster: (cluster: WalletAdapterNetwork) => void;
}

const ClusterContext = createContext<ClusterContextState>({} as ClusterContextState);

export function useCluster(): ClusterContextState {
  return useContext(ClusterContext);
}

interface ClusterProviderProps {
  children: ReactNode;
}

export function ClusterProvider({ children }: ClusterProviderProps) {
  const [cluster, setCluster] = useLocalStorage<WalletAdapterNetwork>(
    'cluster',
    WalletAdapterNetwork.Devnet
  );

  const value = useMemo(
    () => ({ cluster, setCluster }),
    [cluster, setCluster]
  );

  return (
    <ClusterContext.Provider value={value}>
      {children}
    </ClusterContext.Provider>
  );
}
```

**Updated SolanaProvider with cluster switching:**

```typescript
import { ClusterProvider, useCluster } from './ClusterProvider';

function SolanaProviderInner({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();

  const endpoint = useMemo(() => clusterApiUrl(cluster), [cluster]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: cluster }),
    ],
    [cluster]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  return (
    <ClusterProvider>
      <SolanaProviderInner>
        {children}
      </SolanaProviderInner>
    </ClusterProvider>
  );
}
```

**Cluster selector component:**

```typescript
import { useCluster } from '@/components/providers/ClusterProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function ClusterSelector() {
  const { cluster, setCluster } = useCluster();

  return (
    <select
      value={cluster}
      onChange={(e) => setCluster(e.target.value as WalletAdapterNetwork)}
      className="px-4 py-2 rounded bg-gray-800 text-white"
    >
      <option value={WalletAdapterNetwork.Mainnet}>Mainnet Beta</option>
      <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
      <option value={WalletAdapterNetwork.Testnet}>Testnet</option>
    </select>
  );
}
```

---

#### Part 8: Storage Patterns for Wallet Preferences

##### useLocalStorage Hook

The wallet adapter includes a `useLocalStorage` hook for persisting preferences:

```typescript
import { useLocalStorage } from '@solana/wallet-adapter-react';

function MyComponent() {
  // Persists to localStorage with key 'autoConnect'
  const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', true);

  return (
    <label>
      <input
        type="checkbox"
        checked={autoConnect}
        onChange={(e) => setAutoConnect(e.target.checked)}
      />
      Auto-connect on page load
    </label>
  );
}
```

**How useLocalStorage works:**
1. Reads initial value from localStorage on mount (or uses default)
2. Syncs state changes to localStorage automatically
3. Handles JSON serialization/deserialization
4. SSR-safe (checks `typeof window !== 'undefined'`)
5. Removes item when set to `null`

##### Default Wallet Persistence

`WalletProvider` automatically persists the selected wallet name:

```typescript
// Default storage key: 'walletName'
// Stores the wallet adapter's name (e.g., "Phantom", "Solflare")

// Check in browser console:
localStorage.getItem('walletName'); // "Phantom"
```

**Customize the storage key:**

```typescript
<WalletProvider
  wallets={wallets}
  autoConnect
  localStorageKey="myApp:preferredWallet"
>
  {children}
</WalletProvider>
```

##### Storing Complex Preferences

Create a preferences system for wallet-related settings:

```typescript
interface WalletPreferences {
  autoConnect: boolean;
  showBalance: boolean;
  notifications: boolean;
  theme: 'light' | 'dark';
}

function useWalletPreferences() {
  const [preferences, setPreferences] = useLocalStorage<WalletPreferences>(
    'walletPreferences',
    {
      autoConnect: true,
      showBalance: true,
      notifications: true,
      theme: 'dark',
    }
  );

  const updatePreference = useCallback(
    <K extends keyof WalletPreferences>(
      key: K,
      value: WalletPreferences[K]
    ) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );

  return { preferences, updatePreference };
}
```

##### Clearing Storage on Disconnect

Good practice to clear preferences when user disconnects:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

function DisconnectButton() {
  const { disconnect } = useWallet();

  const handleDisconnect = useCallback(async () => {
    await disconnect();

    // Clear wallet-related data
    localStorage.removeItem('walletName');
    localStorage.removeItem('autoConnect');
    localStorage.removeItem('walletPreferences');
  }, [disconnect]);

  return (
    <button onClick={handleDisconnect}>
      Disconnect & Clear Data
    </button>
  );
}
```

---

#### Lab Exercise: Setting Up Wallet Providers

**Objective:** Implement an app providers component that:

- Imports necessary wallet-ui components and utilities
- Creates cluster storage for persisting user's cluster selection
- Configures wallet UI with all Solana clusters (devnet, localnet, testnet, mainnet)
- Sets up provider hierarchy with WalletUi wrapping other providers
- Enables auto-detection of installed wallets
- Integrates with React Query for data fetching

##### Starter Code

Create `src/components/providers/AppProviders.tsx`:

```typescript
'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@solana/wallet-adapter-react-ui/styles.css';

interface AppProvidersProps {
  children: ReactNode;
}

// TODO: Create QueryClient instance

// TODO: Implement useCluster hook for cluster management

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  // TODO: Get cluster from useCluster hook

  // TODO: Memoize endpoint based on cluster

  // TODO: Memoize wallets array (can be empty for auto-detection)

  return (
    // TODO: Wrap with QueryClientProvider
    // TODO: Wrap with ConnectionProvider (use endpoint)
    // TODO: Wrap with WalletProvider (use wallets, enable autoConnect)
    // TODO: Wrap with WalletModalProvider
    // TODO: Render children
    <></>
  );
};
```

##### Implementation Steps

1. **Install React Query** (for data fetching in future lessons):
   ```bash
   npm install @tanstack/react-query
   ```

2. **Create ClusterProvider** (from Part 7 examples above)

3. **Implement the provider hierarchy:**
   - QueryClientProvider (outermost)
   - ClusterProvider
   - ConnectionProvider
   - WalletProvider
   - WalletModalProvider (innermost)
   - Children

4. **Test your setup:**
   - Wrap your app with `AppProviders`
   - Use `useWallet()` hook in a component
   - Verify wallet connection works

##### Solution

<details>
<summary>Click to reveal solution</summary>

**components/providers/ClusterProvider.tsx:**

```typescript
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useLocalStorage } from '@solana/wallet-adapter-react';

interface ClusterContextState {
  cluster: WalletAdapterNetwork;
  setCluster: (cluster: WalletAdapterNetwork) => void;
}

const ClusterContext = createContext<ClusterContextState>({} as ClusterContextState);

export function useCluster(): ClusterContextState {
  return useContext(ClusterContext);
}

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [cluster, setCluster] = useLocalStorage<WalletAdapterNetwork>(
    'solana-cluster',
    WalletAdapterNetwork.Devnet
  );

  const value = useMemo(
    () => ({ cluster, setCluster }),
    [cluster, setCluster]
  );

  return (
    <ClusterContext.Provider value={value}>
      {children}
    </ClusterContext.Provider>
  );
}
```

**components/providers/AppProviders.tsx:**

```typescript
'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClusterProvider, useCluster } from './ClusterProvider';

import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function WalletContextProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();

  const endpoint = useMemo(() => clusterApiUrl(cluster), [cluster]);

  // Empty array enables auto-detection of standard wallets
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </ClusterProvider>
    </QueryClientProvider>
  );
};
```

</details>

##### Testing Checklist

- [ ] Providers are nested in correct order
- [ ] CSS stylesheet is imported
- [ ] Cluster persists to localStorage
- [ ] Auto-connect works on page reload
- [ ] No console errors when mounting providers
- [ ] `useWallet()` hook works in child components

---

#### Key Concepts

- Provider hierarchy and context
- Cluster configuration and switching
- Wallet auto-detection
- Storage abstraction for preferences

#### Common Pitfalls

1. **Missing CSS Import**
   - **Error:** Modal doesn't display or looks broken
   - **Solution:** Import `@solana/wallet-adapter-react-ui/styles.css`

2. **Wrong Provider Order**
   - **Error:** "useWallet must be used within WalletProvider"
   - **Solution:** Ensure WalletProvider wraps components using useWallet()

3. **Forgetting useMemo**
   - **Error:** Excessive re-renders, poor performance
   - **Solution:** Memoize endpoint and wallets array

4. **Using 'mainnet' instead of 'mainnet-beta'**
   - **Error:** Invalid cluster name
   - **Solution:** Use `WalletAdapterNetwork.Mainnet` or `'mainnet-beta'`

---

### Lesson 2: Building Wallet Connection UI

#### Introduction

With wallet providers configured, you're ready to build user-facing components for wallet connection. A great wallet connection experience is fast, intuitive, and handles errors gracefully. Users should be able to connect in 2-3 clicks, see clear connection status, and understand what's happening at each step.

In this lesson, you'll learn to use wallet adapter hooks, build custom connection UI components, create wallet selection modals, and handle all connection states professionally.

#### Topics Covered

- Using wallet-ui hooks: `useWallets`, `useWalletUi`
- Creating wallet selection modal
- Responsive wallet button design
- Handling connection loading states
- Accessibility considerations

---

#### Part 1: Understanding Wallet Adapter Hooks

##### useWallet() - Core Wallet State

The `useWallet()` hook provides everything you need to interact with connected wallets:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';

function MyComponent() {
  const {
    // State
    publicKey,           // PublicKey | null - Connected wallet's public key
    connected,           // boolean - Is wallet connected?
    connecting,          // boolean - Is connection in progress?
    disconnecting,       // boolean - Is disconnection in progress?
    wallet,              // Wallet | null - Selected wallet adapter
    wallets,             // Wallet[] - All available wallet adapters

    // Methods
    select,              // (walletName: string | null) => void
    connect,             // () => Promise<void>
    disconnect,          // () => Promise<void>
    sendTransaction,     // (tx, connection, options?) => Promise<signature>

    // Optional methods (feature-detect before using)
    signTransaction,     // <T>(transaction: T) => Promise<T>
    signAllTransactions, // <T>(transactions: T[]) => Promise<T[]>
    signMessage,         // (message: Uint8Array) => Promise<Uint8Array>
  } = useWallet();

  return (
    <div>
      {connected ? (
        <p>Connected: {publicKey?.toBase58()}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

##### Connection States

Your UI should handle all possible wallet states:

| State | Condition | Display |
|-------|-----------|---------|
| **No Wallet Selected** | `!wallet && !connected` | "Select Wallet" button |
| **Wallet Selected** | `wallet && !connected && !connecting` | "Connect" button |
| **Connecting** | `connecting` | "Connecting..." with spinner |
| **Connected** | `connected && publicKey` | Address with disconnect option |
| **Disconnecting** | `disconnecting` | "Disconnecting..." with spinner |
| **Error** | Caught exception | Error message with retry option |

##### useConnection() - Blockchain Interaction

Access the Solana RPC connection for querying blockchain data:

```typescript
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

function BalanceDisplay() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    // Get balance
    connection.getBalance(publicKey).then((bal) => {
      setBalance(bal / LAMPORTS_PER_SOL);
    });

    // Subscribe to balance changes (optional)
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      },
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [publicKey, connection]);

  if (!balance) return null;

  return <div>{balance.toFixed(4)} SOL</div>;
}
```

##### useWalletModal() - Modal Control

Control the wallet selection modal from any component:

```typescript
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

function ConnectButton() {
  const { setVisible } = useWalletModal();
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <button onClick={() => setVisible(true)}>
      Select Wallet
    </button>
  );
}
```

---

#### Part 2: Building a Custom Connect Button

##### Basic Connect Button

Start with a simple button showing connection status:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function ConnectButton() {
  const { publicKey, connect, disconnect, connecting, wallet } = useWallet();
  const { setVisible } = useWalletModal();

  // No wallet selected - show wallet selection
  if (!wallet) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn btn-primary"
      >
        Select Wallet
      </button>
    );
  }

  // Wallet selected but not connected
  if (!publicKey) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="btn btn-primary"
      >
        {connecting ? 'Connecting...' : 'Connect'}
      </button>
    );
  }

  // Connected - show address
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">
        {publicKey.toBase58().slice(0, 4)}...
        {publicKey.toBase58().slice(-4)}
      </span>
      <button onClick={disconnect} className="btn btn-secondary">
        Disconnect
      </button>
    </div>
  );
}
```

##### Enhanced Connect Button with States

Add loading indicators and error handling:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useCallback } from 'react';

export function EnhancedConnectButton() {
  const {
    publicKey,
    wallet,
    connect,
    disconnect,
    connecting,
    disconnecting
  } = useWallet();
  const { setVisible } = useWalletModal();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    setError(null);
    try {
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      console.error('Connection error:', err);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    setError(null);
    try {
      await disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnection failed');
      console.error('Disconnection error:', err);
    }
  }, [disconnect]);

  // Show error if present
  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={() => setError(null)}
          className="btn btn-secondary"
        >
          Dismiss
        </button>
      </div>
    );
  }

  // No wallet selected
  if (!wallet) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn btn-primary"
      >
        Select Wallet
      </button>
    );
  }

  // Wallet selected but not connected
  if (!publicKey) {
    return (
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="btn btn-primary disabled:opacity-50"
      >
        {connecting ? (
          <>
            <Spinner />
            Connecting...
          </>
        ) : (
          'Connect'
        )}
      </button>
    );
  }

  // Connected - show address with disconnect
  return (
    <div className="flex items-center gap-2">
      {wallet.adapter.icon && (
        <img
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
          className="w-6 h-6"
        />
      )}
      <span className="font-mono text-sm">
        {publicKey.toBase58().slice(0, 4)}...
        {publicKey.toBase58().slice(-4)}
      </span>
      <button
        onClick={handleDisconnect}
        disabled={disconnecting}
        className="btn btn-secondary disabled:opacity-50"
      >
        {disconnecting ? 'Disconnecting...' : 'Disconnect'}
      </button>
    </div>
  );
}

// Simple spinner component
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
```

##### Copy Address Functionality

Add a button to copy the wallet address:

```typescript
import { useState, useCallback } from 'react';

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [address]);

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-blue-500 hover:text-blue-600"
      title="Copy address"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

// Usage in ConnectButton
{publicKey && (
  <div className="flex items-center gap-2">
    <span className="font-mono text-sm">
      {publicKey.toBase58().slice(0, 4)}...
      {publicKey.toBase58().slice(-4)}
    </span>
    <CopyAddressButton address={publicKey.toBase58()} />
  </div>
)}
```

---

#### Part 3: Creating a Custom Wallet Selection Modal

##### Custom Modal Component

Build a modal that lists available wallets:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useCallback, useEffect, useState } from 'react';

interface WalletModalProps {
  visible: boolean;
  onClose: () => void;
}

export function WalletModal({ visible, onClose }: WalletModalProps) {
  const { wallets, select, connect } = useWallet();
  const [connecting, setConnecting] = useState(false);

  const handleSelectWallet = useCallback(async (walletName: string) => {
    try {
      setConnecting(true);
      select(walletName);
      await connect();
      onClose();
    } catch (err) {
      console.error('Failed to connect:', err);
    } finally {
      setConnecting(false);
    }
  }, [select, connect, onClose]);

  // Close modal on escape key
  useEffect(() => {
    if (!visible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  if (!visible) return null;

  // Sort wallets: installed first, then loadable, then not detected
  const sortedWallets = [...wallets].sort((a, b) => {
    const aReady = a.readyState === WalletReadyState.Installed ? 0 :
                   a.readyState === WalletReadyState.Loadable ? 1 : 2;
    const bReady = b.readyState === WalletReadyState.Installed ? 0 :
                   b.readyState === WalletReadyState.Loadable ? 1 : 2;
    return aReady - bReady;
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {sortedWallets.map((wallet) => {
            const isInstalled = wallet.readyState === WalletReadyState.Installed;
            const isLoadable = wallet.readyState === WalletReadyState.Loadable;
            const isAvailable = isInstalled || isLoadable;

            return (
              <button
                key={wallet.adapter.name}
                onClick={() => {
                  if (isAvailable) {
                    handleSelectWallet(wallet.adapter.name);
                  } else {
                    window.open(wallet.adapter.url, '_blank');
                  }
                }}
                disabled={connecting}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors disabled:opacity-50"
              >
                {wallet.adapter.icon && (
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    className="w-8 h-8"
                  />
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold">{wallet.adapter.name}</div>
                  {!isAvailable && (
                    <div className="text-xs text-gray-500">
                      Not installed - Click to install
                    </div>
                  )}
                </div>
                {isInstalled && (
                  <div className="text-xs text-green-500">Detected</div>
                )}
              </button>
            );
          })}
        </div>

        {connecting && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Connecting to wallet...
          </div>
        )}
      </div>
    </div>
  );
}
```

##### Using the Custom Modal

```typescript
import { useState } from 'react';
import { WalletModal } from './WalletModal';

function App() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setModalVisible(true)}>
        Connect Wallet
      </button>

      <WalletModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}
```

---

#### Part 4: Using Pre-Built UI Components

##### WalletMultiButton

The easiest way to add wallet connection:

```typescript
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My Solana App</h1>
      <WalletMultiButton />
    </header>
  );
}
```

**WalletMultiButton features:**
- Handles all connection states automatically
- Shows dropdown menu when connected (copy address, change wallet, disconnect)
- Displays wallet icon
- Mobile-responsive
- Customizable via CSS classes

##### Styling WalletMultiButton

Override default styles with CSS:

```css
/* Target the button */
.wallet-adapter-button {
  background-color: #512da8;
  border-radius: 8px;
  font-weight: 600;
}

.wallet-adapter-button:hover {
  background-color: #6a3fb8;
}

/* Dropdown menu */
.wallet-adapter-dropdown {
  background-color: #1a1a1a;
}

.wallet-adapter-dropdown-list-item:hover {
  background-color: #2a2a2a;
}
```

##### WalletDisconnectButton

Simple disconnect button:

```typescript
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

function Sidebar() {
  return (
    <aside>
      <WalletDisconnectButton />
    </aside>
  );
}
```

##### WalletConnectButton

Connect-only button (no disconnect functionality):

```typescript
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to My Solana App</h1>
      <WalletConnectButton />
    </div>
  );
}
```

---

#### Part 5: Responsive Design Patterns

##### Mobile-First Wallet Button

Adapt UI based on screen size:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function ResponsiveWalletButton() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn btn-primary w-full sm:w-auto"
      >
        {/* Full text on desktop, icon only on mobile */}
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Full address on desktop, truncated on mobile */}
      <span className="hidden md:inline font-mono text-sm">
        {publicKey.toBase58()}
      </span>
      <span className="md:hidden font-mono text-sm">
        {publicKey.toBase58().slice(0, 4)}...
        {publicKey.toBase58().slice(-4)}
      </span>
      <button
        onClick={disconnect}
        className="btn btn-secondary text-sm"
      >
        {/* Icon only on mobile */}
        <span className="hidden sm:inline">Disconnect</span>
        <span className="sm:hidden">✕</span>
      </button>
    </div>
  );
}
```

##### Dropdown Menu for Mobile

Show wallet info in a dropdown on small screens:

```typescript
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function MobileWalletMenu() {
  const { publicKey, wallet, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!publicKey) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {wallet?.adapter.icon && (
          <img
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
            className="w-6 h-6"
          />
        )}
        <span className="font-mono text-sm">
          {publicKey.toBase58().slice(0, 4)}...
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Wallet</div>
              <div className="text-sm font-semibold">{wallet?.adapter.name}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Address</div>
              <div className="text-xs font-mono break-all">
                {publicKey.toBase58()}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(publicKey.toBase58());
                setIsOpen(false);
              }}
              className="w-full btn btn-secondary text-sm"
            >
              Copy Address
            </button>

            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full btn btn-danger text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

#### Part 6: Accessibility Considerations

##### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
export function AccessibleConnectButton() {
  const { publicKey, connect, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setVisible(true);
          }
        }}
        aria-label="Open wallet selection modal"
        className="btn btn-primary"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <button
      onClick={disconnect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          disconnect();
        }
      }}
      aria-label={`Disconnect wallet ${publicKey.toBase58()}`}
      className="btn btn-secondary"
    >
      Disconnect
    </button>
  );
}
```

##### ARIA Labels and Roles

Add screen reader support:

```typescript
export function AccessibleWalletButton() {
  const { publicKey, wallet, connecting } = useWallet();

  return (
    <div role="region" aria-label="Wallet connection">
      {connecting && (
        <div
          role="status"
          aria-live="polite"
          className="text-sm text-gray-500"
        >
          Connecting to {wallet?.adapter.name}...
        </div>
      )}

      {publicKey && (
        <div
          role="status"
          aria-live="polite"
          className="text-sm"
        >
          <span className="sr-only">Wallet connected. Address:</span>
          <span aria-label={`Wallet address ${publicKey.toBase58()}`}>
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}
```

##### Focus Management

Manage focus when opening/closing modals:

```typescript
import { useEffect, useRef } from 'react';

export function AccessibleWalletModal({ visible, onClose }: WalletModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (visible) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus close button when modal opens
      closeButtonRef.current?.focus();
    } else {
      // Restore focus when modal closes
      previousFocusRef.current?.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 id="wallet-modal-title" className="text-xl font-bold">
            Connect Wallet
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close wallet selection modal"
          >
            ✕
          </button>
        </div>
        {/* Wallet list */}
      </div>
    </div>
  );
}
```

---

#### Lab Exercise: Building Wallet Connection UI

**Objective:** Create a WalletButton component that:

- Uses wallet-ui hooks to access wallet state and functions
- Displays different UI based on connection status:
  - When connected: Shows truncated public key with disconnect option
  - When disconnected: Shows "Connect Wallet" button
- Implements modal pattern for wallet selection
- Handles wallet connection through modal selection
- Applies appropriate styling for different states
- Manages modal visibility with local state

##### Starter Code

Create `src/components/WalletButton.tsx`:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

export function WalletButton() {
  // TODO: Destructure needed values from useWallet()
  // TODO: Get setVisible from useWalletModal()
  // TODO: Add local state for errors

  // TODO: Implement handleConnect with error handling

  // TODO: Implement handleDisconnect with error handling

  // TODO: Handle no wallet selected state

  // TODO: Handle wallet selected but not connected state

  // TODO: Handle connected state with address display

  return <div>TODO: Implement wallet button</div>;
}
```

##### Implementation Steps

1. Use `useWallet()` to get wallet state
2. Use `useWalletModal()` to control modal visibility
3. Implement three UI states:
   - No wallet: Show "Select Wallet" button
   - Wallet selected: Show "Connect" button
   - Connected: Show truncated address with disconnect button
4. Add loading indicators for connecting/disconnecting states
5. Add error handling with user-friendly messages
6. Style components with Tailwind CSS or your preferred method

##### Bonus Challenges

1. Add copy address functionality
2. Show wallet icon when connected
3. Add fade-in animations for state transitions
4. Implement keyboard navigation
5. Add ARIA labels for accessibility

##### Solution

<details>
<summary>Click to reveal solution</summary>

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useCallback } from 'react';

export function WalletButton() {
  const {
    publicKey,
    wallet,
    connect,
    disconnect,
    connecting,
    disconnecting
  } = useWallet();
  const { setVisible } = useWalletModal();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConnect = useCallback(async () => {
    setError(null);
    try {
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    setError(null);
    try {
      await disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnection failed');
    }
  }, [disconnect]);

  const handleCopy = useCallback(async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [publicKey]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        <button
          onClick={() => setError(null)}
          className="btn btn-sm btn-secondary"
        >
          Dismiss
        </button>
      </div>
    );
  }

  // No wallet selected
  if (!wallet) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn btn-primary"
      >
        Select Wallet
      </button>
    );
  }

  // Wallet selected but not connected
  if (!publicKey) {
    return (
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {connecting ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect'
        )}
      </button>
    );
  }

  // Connected - show address
  return (
    <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {wallet.adapter.icon && (
        <img
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
          className="w-6 h-6"
        />
      )}

      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{wallet.adapter.name}</span>
        <span className="font-mono text-sm">
          {publicKey.toBase58().slice(0, 4)}...
          {publicKey.toBase58().slice(-4)}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className="text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Copy address"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>

      <button
        onClick={handleDisconnect}
        disabled={disconnecting}
        className="btn btn-sm btn-secondary disabled:opacity-50"
      >
        {disconnecting ? 'Disconnecting...' : 'Disconnect'}
      </button>
    </div>
  );
}
```

</details>

---

#### Key Concepts

- Conditional rendering based on wallet state
- User-friendly address display
- Modal patterns for wallet selection
- Loading and error states

#### Common Pitfalls

1. **Not Handling All States**
   - **Error:** UI breaks in edge cases
   - **Solution:** Always handle: no wallet, wallet selected, connecting, connected, disconnecting, error

2. **Missing Loading Indicators**
   - **Error:** User doesn't know connection is in progress
   - **Solution:** Show spinners and disable buttons during async operations

3. **Poor Error Messages**
   - **Error:** Generic "Error occurred" doesn't help users
   - **Solution:** Display specific, actionable error messages

4. **Forgetting Mobile Users**
   - **Error:** UI works on desktop but breaks on mobile
   - **Solution:** Test on small screens, use responsive design patterns

---

### Lesson 3: Advanced Wallet Features

#### Introduction

Basic wallet connection is just the starting point. Professional Solana applications implement advanced features like auto-connect (remembering the user's wallet), handling wallet events (disconnect, account change), supporting multiple wallets simultaneously, and following security best practices.

In this lesson, you'll implement auto-connect functionality, persist wallet preferences across sessions, handle wallet events properly, and learn security considerations for wallet integration.

#### Topics Covered

- Auto-connect implementation
- Wallet persistence with localStorage
- Handling wallet events
- Multi-wallet support patterns
- Security considerations

---

#### Part 1: Auto-Connect Implementation

##### Understanding Auto-Connect

Auto-connect automatically reconnects to a user's previously used wallet when they return to your app. This improves UX by eliminating repeated wallet selection.

**How auto-connect works:**
1. User connects to a wallet
2. Wallet name is saved to localStorage
3. On next page load, app reads saved wallet name
4. App attempts to reconnect automatically

##### Built-in Auto-Connect

Enable auto-connect with the `autoConnect` prop:

```typescript
<WalletProvider wallets={wallets} autoConnect>
  {children}
</WalletProvider>
```

**What happens behind the scenes:**
1. `WalletProvider` checks localStorage for `walletName` key
2. If found, selects that wallet adapter
3. Waits for wallet ready state (`Installed` or `Loadable`)
4. Calls `adapter.autoConnect()` method
5. If successful, wallet is connected
6. If fails, user must connect manually

##### Dynamic Auto-Connect with Function

Control auto-connect logic with a function:

```typescript
import { useCallback } from 'react';
import { useLocalStorage } from '@solana/wallet-adapter-react';

function App() {
  const [shouldAutoConnect] = useLocalStorage('autoConnect', true);

  const autoConnect = useCallback(async () => {
    // Only auto-connect if user has enabled it
    return shouldAutoConnect;
  }, [shouldAutoConnect]);

  return (
    <WalletProvider wallets={wallets} autoConnect={autoConnect}>
      {children}
    </WalletProvider>
  );
}
```

##### Custom Auto-Connect Hook

Build a hook for more control over auto-connect:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useRef } from 'react';

export function useAutoConnect() {
  const { wallet, connect, connected, connecting } = useWallet();
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Only attempt once
    if (hasAttempted.current) return;

    // Skip if already connected or connecting
    if (connected || connecting) return;

    // Skip if no wallet selected
    if (!wallet) return;

    // Attempt auto-connect
    hasAttempted.current = true;

    connect().catch((err) => {
      console.log('Auto-connect failed:', err);
      // Reset flag to allow manual retry
      hasAttempted.current = false;
    });
  }, [wallet, connect, connected, connecting]);
}

// Usage in your app
function App() {
  useAutoConnect();

  return <div>Your app content</div>;
}
```

---

#### Part 2: Wallet Persistence Patterns

##### Persisting Wallet Selection

The default persistence stores the wallet name:

```typescript
// Automatic when user connects
localStorage.setItem('walletName', 'Phantom');

// Read in WalletProvider
const savedWalletName = localStorage.getItem('walletName');
```

**Custom storage key:**

```typescript
<WalletProvider
  wallets={wallets}
  autoConnect
  localStorageKey="myApp:preferredWallet"
>
  {children}
</WalletProvider>
```

##### Persisting User Preferences

Create a preferences system:

```typescript
import { useLocalStorage } from '@solana/wallet-adapter-react';

interface WalletPreferences {
  autoConnect: boolean;
  showBalance: boolean;
  notifications: boolean;
}

export function useWalletPreferences() {
  const [preferences, setPreferences] = useLocalStorage<WalletPreferences>(
    'walletPrefs',
    {
      autoConnect: true,
      showBalance: true,
      notifications: true,
    }
  );

  const updatePreference = <K extends keyof WalletPreferences>(
    key: K,
    value: WalletPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return { preferences, updatePreference };
}
```

**Preferences UI component:**

```typescript
import { useWalletPreferences } from '@/hooks/useWalletPreferences';

export function WalletSettings() {
  const { preferences, updatePreference } = useWalletPreferences();

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={preferences.autoConnect}
          onChange={(e) => updatePreference('autoConnect', e.target.checked)}
        />
        <span>Auto-connect on page load</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={preferences.showBalance}
          onChange={(e) => updatePreference('showBalance', e.target.checked)}
        />
        <span>Show wallet balance</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={preferences.notifications}
          onChange={(e) => updatePreference('notifications', e.target.checked)}
        />
        <span>Enable notifications</span>
      </label>
    </div>
  );
}
```

##### Persisting Recently Used Wallets

Track wallet connection history:

```typescript
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

interface WalletHistory {
  name: string;
  lastUsed: number;
}

export function useWalletHistory() {
  const { wallet, connected } = useWallet();
  const [history, setHistory] = useLocalStorage<WalletHistory[]>(
    'walletHistory',
    []
  );

  // Update history when wallet connects
  useEffect(() => {
    if (!connected || !wallet) return;

    setHistory((prev) => {
      // Remove existing entry for this wallet
      const filtered = prev.filter((item) => item.name !== wallet.adapter.name);

      // Add to front with current timestamp
      return [
        { name: wallet.adapter.name, lastUsed: Date.now() },
        ...filtered,
      ].slice(0, 5); // Keep only last 5
    });
  }, [connected, wallet, setHistory]);

  // Sort by most recently used
  const sortedHistory = [...history].sort((a, b) => b.lastUsed - a.lastUsed);

  return sortedHistory;
}
```

**Display recently used wallets:**

```typescript
import { useWalletHistory } from '@/hooks/useWalletHistory';
import { useWallet } from '@solana/wallet-adapter-react';

export function RecentWallets() {
  const history = useWalletHistory();
  const { select, connect, wallets } = useWallet();

  const handleSelectRecent = async (walletName: string) => {
    select(walletName);
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  if (history.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Recently Used</h3>
      <div className="space-y-1">
        {history.map((item) => {
          const wallet = wallets.find((w) => w.adapter.name === item.name);
          if (!wallet) return null;

          return (
            <button
              key={item.name}
              onClick={() => handleSelectRecent(item.name)}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {wallet.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-5 h-5"
                />
              )}
              <span className="text-sm">{wallet.adapter.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

#### Part 3: Handling Wallet Events

##### Wallet Adapter Events

Wallet adapters emit events for various lifecycle changes. While the wallet adapter handles most events internally, you can listen to them for custom logic:

**Available events:**
- `connect` - Wallet successfully connected
- `disconnect` - Wallet disconnected
- `error` - Error occurred
- `readyStateChange` - Wallet ready state changed
- `accountChange` - Active account changed (some wallets)

##### Listening to Events

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

export function useWalletEvents() {
  const { wallet } = useWallet();

  useEffect(() => {
    if (!wallet) return;

    const adapter = wallet.adapter;

    // Connect event
    const onConnect = () => {
      console.log('Wallet connected:', adapter.publicKey?.toBase58());
      // Show success notification
    };

    // Disconnect event
    const onDisconnect = () => {
      console.log('Wallet disconnected');
      // Show info notification
    };

    // Error event
    const onError = (error: Error) => {
      console.error('Wallet error:', error);
      // Show error notification
    };

    adapter.on('connect', onConnect);
    adapter.on('disconnect', onDisconnect);
    adapter.on('error', onError);

    return () => {
      adapter.off('connect', onConnect);
      adapter.off('disconnect', onDisconnect);
      adapter.off('error', onError);
    };
  }, [wallet]);
}
```

##### Account Change Detection

Some wallets emit `accountChange` events when the user switches accounts:

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function useAccountChange() {
  const { wallet, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!wallet || !publicKey) return;

    // Initial balance fetch
    connection.getBalance(publicKey).then((bal) => {
      setBalance(bal / LAMPORTS_PER_SOL);
    });

    // Listen for account changes
    const onAccountChange = (newPublicKey: any) => {
      console.log('Account changed:', newPublicKey?.toBase58());

      // Refetch balance for new account
      if (newPublicKey) {
        connection.getBalance(newPublicKey).then((bal) => {
          setBalance(bal / LAMPORTS_PER_SOL);
        });
      }
    };

    // Note: Not all wallets support this event
    if ('on' in wallet.adapter && typeof wallet.adapter.on === 'function') {
      wallet.adapter.on('accountChange', onAccountChange);
    }

    return () => {
      if ('off' in wallet.adapter && typeof wallet.adapter.off === 'function') {
        wallet.adapter.off('accountChange', onAccountChange);
      }
    };
  }, [wallet, publicKey, connection]);

  return balance;
}
```

##### Wallet Disconnect Detection

Detect when wallet is disconnected (user disconnects from wallet extension):

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useDisconnectRedirect() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home when wallet disconnects
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);
}

// Usage in a protected page
function ProtectedPage() {
  useDisconnectRedirect();

  return <div>Protected content</div>;
}
```

---

#### Part 4: Multi-Wallet Support Patterns

##### Supporting All Standard Wallets

The easiest approach - let wallet standard handle detection:

```typescript
const wallets = useMemo(() => [], []);

<WalletProvider wallets={wallets} autoConnect>
  {children}
</WalletProvider>
```

**Automatically detects:**
- Phantom
- Solflare
- Backpack
- Glow
- Slope
- And any other wallet implementing the standard

##### Explicit Multi-Wallet Configuration

Configure specific wallets with custom options:

```typescript
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new CoinbaseWalletAdapter(),
    new LedgerWalletAdapter(),
    new TorusWalletAdapter({
      params: {
        network: {
          host: 'devnet',
        },
      },
    }),
  ],
  [network]
);
```

##### Wallet Priority Ordering

Control the order wallets appear in UI:

```typescript
const wallets = useMemo(() => {
  // Primary wallets (shown first)
  const primary = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
  ];

  // Secondary wallets (shown after)
  const secondary = [
    new CoinbaseWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
  ];

  // Hardware wallets (shown last)
  const hardware = [
    new LedgerWalletAdapter(),
    new TrezorWalletAdapter(),
  ];

  return [...primary, ...secondary, ...hardware];
}, []);
```

##### Dynamic Wallet Loading

Load wallet adapters dynamically to reduce initial bundle size:

```typescript
import { useEffect, useState } from 'react';
import type { Adapter } from '@solana/wallet-adapter-base';

export function useDynamicWallets() {
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    async function loadWallets() {
      // Dynamically import wallet adapters
      const [
        { PhantomWalletAdapter },
        { SolflareWalletAdapter },
      ] = await Promise.all([
        import('@solana/wallet-adapter-phantom'),
        import('@solana/wallet-adapter-solflare'),
      ]);

      setWallets([
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ]);
    }

    loadWallets();
  }, []);

  return wallets;
}

// Usage
function App() {
  const wallets = useDynamicWallets();

  return (
    <WalletProvider wallets={wallets} autoConnect>
      {children}
    </WalletProvider>
  );
}
```

---

#### Part 5: Security Considerations

##### Never Store Private Keys

**Critical Rule: NEVER handle private keys in your application.**

The wallet adapter abstracts key management - your app should never:
- Ask for seed phrases
- Store private keys
- Export private keys
- Log private keys

```typescript
// ❌ NEVER DO THIS
const privateKey = wallet.getPrivateKey(); // WRONG - this doesn't exist
localStorage.setItem('privateKey', privateKey); // EXTREMELY DANGEROUS

// ✅ CORRECT - Use public keys only
const publicKey = wallet.publicKey;
localStorage.setItem('publicKey', publicKey.toBase58()); // Safe
```

##### Validate User Actions

Always require explicit user approval for sensitive operations:

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction } from '@solana/web3.js';

export function TransferSOL({ recipient, amount }: TransferProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [confirmed, setConfirmed] = useState(false);

  const handleTransfer = async () => {
    if (!publicKey) throw new Error('Wallet not connected');
    if (!confirmed) {
      alert('Please confirm this action');
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: amount,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    console.log('Transfer complete:', signature);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        I confirm I want to send {amount / LAMPORTS_PER_SOL} SOL
      </label>
      <button onClick={handleTransfer} disabled={!confirmed}>
        Send SOL
      </button>
    </div>
  );
}
```

##### Clear Sensitive Data on Disconnect

```typescript
export function useSecureDisconnect() {
  const { disconnect, publicKey } = useWallet();

  const secureDisconnect = useCallback(async () => {
    // Clear all stored data
    localStorage.removeItem('walletName');
    localStorage.removeItem('walletPrefs');
    sessionStorage.clear();

    // Clear any in-memory sensitive data
    // (if you're storing any)

    // Disconnect wallet
    await disconnect();

    console.log('Secure disconnect complete');
  }, [disconnect]);

  return secureDisconnect;
}
```

##### Rate Limiting Connections

Prevent auto-connect loops and abuse:

```typescript
import { useRef } from 'react';

export function useRateLimitedConnect() {
  const { connect } = useWallet();
  const lastAttemptRef = useRef<number>(0);
  const COOLDOWN_MS = 3000; // 3 seconds between attempts

  const rateLimitedConnect = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptRef.current;

    if (timeSinceLastAttempt < COOLDOWN_MS) {
      const waitTime = Math.ceil((COOLDOWN_MS - timeSinceLastAttempt) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before trying again`);
    }

    lastAttemptRef.current = now;
    await connect();
  }, [connect]);

  return rateLimitedConnect;
}
```

##### Verify Transaction Parameters

Always validate transaction data before signing:

```typescript
import { Transaction, TransactionInstruction } from '@solana/web3.js';

export function validateTransaction(transaction: Transaction) {
  // Check transaction has instructions
  if (transaction.instructions.length === 0) {
    throw new Error('Transaction has no instructions');
  }

  // Check for suspicious patterns
  const hasSystemProgram = transaction.instructions.some(
    (ix) => ix.programId.equals(SystemProgram.programId)
  );

  // Log transaction details for user review
  console.log('Transaction details:', {
    instructionCount: transaction.instructions.length,
    hasSystemProgram,
    feePayer: transaction.feePayer?.toBase58(),
  });

  return true;
}

// Usage
const handleSendTransaction = async (transaction: Transaction) => {
  // Validate before sending
  validateTransaction(transaction);

  const signature = await sendTransaction(transaction, connection);
  return signature;
};
```

##### HTTPS Only

**Always use HTTPS in production.** Wallet adapters may refuse to work over insecure connections.

```typescript
// In your deployment config
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  console.error('App must be served over HTTPS in production');
  // Redirect to HTTPS
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

---

#### Lab Exercise: Implementing Auto-Connect

**Objective:** Build a custom hook for auto-connect functionality that:

- Checks if user is already connected to avoid redundant attempts
- Retrieves saved wallet preference from localStorage
- Finds the saved wallet in available wallets list
- Verifies wallet is installed before attempting connection
- Automatically connects to previously used wallet on page load
- Saves wallet preference when user connects manually
- Uses proper React effect dependencies
- Handles edge cases gracefully

##### Starter Code

Create `src/hooks/useAutoConnect.ts`:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useRef } from 'react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

export function useAutoConnect() {
  const { wallet, connect, connected, connecting, wallets } = useWallet();

  // TODO: Track if we've attempted auto-connect

  // TODO: Implement auto-connect logic with useEffect

  // TODO: Handle edge cases:
  // - Only attempt once per session
  // - Skip if already connected/connecting
  // - Skip if no wallet selected
  // - Check wallet ready state before connecting
  // - Handle connection failures gracefully
}
```

##### Implementation Steps

1. Use `useRef` to track if auto-connect has been attempted
2. Check if wallet is already connected/connecting
3. Verify wallet is selected and ready
4. Attempt connection
5. Handle errors gracefully
6. Prevent multiple attempts

##### Testing Checklist

- [ ] Auto-connect works on page reload
- [ ] Doesn't attempt if no wallet saved
- [ ] Doesn't create infinite loops
- [ ] Handles connection failures
- [ ] Only attempts once per session
- [ ] Works with wallet selection changes

##### Solution

<details>
<summary>Click to reveal solution</summary>

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useRef } from 'react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

export function useAutoConnect() {
  const { wallet, connect, connected, connecting, select } = useWallet();
  const hasAttempted = useRef(false);
  const connectionAttemptRef = useRef<number>(0);
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    // Skip if already attempted
    if (hasAttempted.current) return;

    // Skip if already connected or connecting
    if (connected || connecting) {
      hasAttempted.current = true;
      return;
    }

    // Skip if no wallet selected
    if (!wallet) {
      // Try to restore wallet from localStorage
      const savedWalletName = localStorage.getItem('walletName');
      if (savedWalletName) {
        select(savedWalletName);
        // Don't mark as attempted - let it try after selection
        return;
      }
      hasAttempted.current = true;
      return;
    }

    // Check if wallet is ready
    const isWalletReady =
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable;

    if (!isWalletReady) {
      console.log('Wallet not ready:', wallet.adapter.name, wallet.readyState);
      hasAttempted.current = true;
      return;
    }

    // Check attempt limit
    if (connectionAttemptRef.current >= MAX_ATTEMPTS) {
      console.log('Max auto-connect attempts reached');
      hasAttempted.current = true;
      return;
    }

    // Attempt auto-connect
    hasAttempted.current = true;
    connectionAttemptRef.current += 1;

    console.log(`Auto-connect attempt ${connectionAttemptRef.current} for ${wallet.adapter.name}`);

    connect().catch((err) => {
      console.log('Auto-connect failed:', err.message);

      // Allow retry if under max attempts
      if (connectionAttemptRef.current < MAX_ATTEMPTS) {
        hasAttempted.current = false;
      }
    });
  }, [wallet, connect, connected, connecting, select]);

  // Save wallet name when connected
  useEffect(() => {
    if (connected && wallet) {
      localStorage.setItem('walletName', wallet.adapter.name);
    }
  }, [connected, wallet]);
}
```

**Enhanced version with preferences:**

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { useEffect, useRef } from 'react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

export function useEnhancedAutoConnect() {
  const { wallet, connect, connected, connecting, select } = useWallet();
  const [autoConnectEnabled] = useLocalStorage('autoConnect', true);
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Skip if auto-connect is disabled
    if (!autoConnectEnabled) {
      hasAttempted.current = true;
      return;
    }

    // Skip if already attempted
    if (hasAttempted.current) return;

    // Skip if already connected or connecting
    if (connected || connecting) {
      hasAttempted.current = true;
      return;
    }

    // Try to restore wallet from localStorage
    if (!wallet) {
      const savedWalletName = localStorage.getItem('walletName');
      if (savedWalletName) {
        select(savedWalletName);
        return;
      }
      hasAttempted.current = true;
      return;
    }

    // Check if wallet is ready
    if (wallet.readyState !== WalletReadyState.Installed &&
        wallet.readyState !== WalletReadyState.Loadable) {
      hasAttempted.current = true;
      return;
    }

    // Attempt connection
    hasAttempted.current = true;

    connect().catch((err) => {
      console.log('Auto-connect failed:', err.message);
      hasAttempted.current = false; // Allow retry
    });
  }, [wallet, connect, connected, connecting, select, autoConnectEnabled]);
}
```

</details>

---

#### Key Concepts

- Browser storage strategies
- Wallet ready states
- Event handling patterns
- Security best practices

#### Common Pitfalls

1. **Auto-Connect Loops**
   - **Error:** App repeatedly attempts connection
   - **Solution:** Use ref to track attempts, implement max retry limit

2. **Ignoring Ready State**
   - **Error:** Connecting before wallet is ready
   - **Solution:** Check `WalletReadyState` before attempting connection

3. **Not Clearing Storage on Disconnect**
   - **Error:** Stale data persists after disconnect
   - **Solution:** Clear localStorage when user explicitly disconnects

4. **Missing Error Handling**
   - **Error:** Silent failures confuse users
   - **Solution:** Log errors, show user-friendly messages, allow retry

---

## Practical Assignment

### Build a Complete Wallet Connection Experience

Create a wallet integration feature that includes:

1. **Custom Wallet Connection Button**
   - Shows connected state with truncated address
   - Displays wallet icon when connected
   - Smooth transitions between states

2. **Wallet Selection Modal**
   - Lists all detected wallets
   - Shows installation prompts for missing wallets
   - Includes wallet icons and descriptions
   - Mobile-responsive design

3. **Auto-Connect Feature**
   - Remembers user's wallet choice
   - Attempts auto-connect on page load
   - Handles errors gracefully

4. **Wallet Info Display**
   - Shows full public key with copy button
   - Displays SOL balance
   - Shows connected cluster
   - Includes disconnect option

**Requirements:**

- Use wallet-ui patterns from examples
- Implement proper error handling
- Add loading states for all async operations
- Ensure mobile responsiveness
- Include accessibility features (ARIA labels, keyboard navigation)

**Implementation Guidelines:**

1. **WalletProvider Component**
   - Configure wallet-ui with appropriate settings
   - Add error boundary for graceful error handling
   - Implement auto-connect functionality
   - Set up proper provider hierarchy

2. **WalletConnect Component**
   - Build intuitive connection UI
   - Handle all connection states (disconnected, connecting, connected, error)
   - Add smooth animations for state transitions
   - Ensure responsive design for all screen sizes

3. **WalletInfo Component**
   - Display complete wallet information (address, balance, cluster)
   - Implement copy-to-clipboard for public key
   - Show real-time SOL balance
   - Add disconnect functionality
   - Include visual indicators for connection status

### Starter Template

**Project Structure:**
```
src/
├── components/
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   └── ClusterProvider.tsx
│   ├── wallet/
│   │   ├── WalletButton.tsx
│   │   ├── WalletModal.tsx
│   │   └── WalletInfo.tsx
│   └── ui/
│       └── Spinner.tsx
├── hooks/
│   ├── useAutoConnect.ts
│   ├── useWalletPreferences.ts
│   └── useWalletHistory.ts
└── App.tsx
```

### Implementation Steps

1. **Set up providers** (from Lesson 1 lab)
2. **Build WalletButton** (from Lesson 2 lab)
3. **Create custom WalletModal** (from Lesson 2 examples)
4. **Implement auto-connect** (from Lesson 3 lab)
5. **Build WalletInfo component:**

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useCluster } from '@/components/providers/ClusterProvider';

export function WalletInfo() {
  const { publicKey, wallet, disconnect } = useWallet();
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    connection.getBalance(publicKey).then((bal) => {
      setBalance(bal / LAMPORTS_PER_SOL);
    });

    // Subscribe to balance updates
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      },
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [publicKey, connection]);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!publicKey || !wallet) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      {/* Implementation here - see full solution */}
    </div>
  );
}
```

### Testing Checklist

- [ ] Connect to wallet successfully
- [ ] Auto-connect works on page reload
- [ ] Can switch between different wallets
- [ ] Balance updates when receiving SOL
- [ ] Copy address works
- [ ] Disconnect clears stored data
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Error states display properly
- [ ] Loading states show during async operations

### Evaluation Criteria

**Functionality (40%)**
- All features work as specified
- Error handling is comprehensive
- Edge cases are handled

**User Experience (30%)**
- Intuitive interface
- Clear feedback for all actions
- Smooth transitions
- Mobile-friendly

**Code Quality (20%)**
- Clean, readable code
- Proper TypeScript types
- Reusable components
- Good separation of concerns

**Accessibility (10%)**
- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management

---

## Additional Resources

### Required Reading

- [Wallet Adapter Documentation](https://github.com/anza-xyz/wallet-adapter)
- [Wallet Standard](https://github.com/wallet-standard/wallet-standard)

### Practice Exercises

1. Add wallet switching without disconnecting
2. Implement a "recently used wallets" section
3. Create wallet connection analytics
4. Build a mini wallet dashboard

### Recommended Libraries

- **@tanstack/react-query** - Data fetching and caching
- **zustand** - Lightweight state management
- **framer-motion** - Animations for transitions
- **sonner** - Toast notifications for wallet events

---

## Common Issues and Solutions

### Issue: Wallet not detected

**Solution:**
- Check wallet ready state before attempting connection
- If wallet is not detected, provide installation link
- Open wallet download page in new tab
- Show helpful message to user about installing wallet

**Code Example:**

```typescript
import { WalletReadyState } from '@solana/wallet-adapter-base';

const handleConnect = async (wallet: Wallet) => {
  if (wallet.readyState === WalletReadyState.NotDetected) {
    // Wallet not installed
    const confirmed = window.confirm(
      `${wallet.adapter.name} is not installed. Would you like to install it?`
    );
    if (confirmed) {
      window.open(wallet.adapter.url, '_blank');
    }
    return;
  }

  // Wallet is installed, proceed with connection
  await connect();
};
```

### Issue: Auto-connect loops

**Solution:**
- Implement connection attempt tracking with state
- Add guards to prevent multiple connection attempts
- Use debouncing techniques for connection logic
- Track connection history to avoid infinite loops

**Code Example:**

```typescript
const attemptCountRef = useRef(0);
const MAX_ATTEMPTS = 3;

useEffect(() => {
  if (attemptCountRef.current >= MAX_ATTEMPTS) {
    console.log('Max auto-connect attempts reached');
    return;
  }

  // Attempt logic here
  attemptCountRef.current += 1;
}, []);
```

### Issue: Wallet disconnects on page refresh

**Solution:**
- Implement proper persistence and re-connection logic

**Code Example:**

```typescript
// Enable auto-connect
<WalletProvider wallets={wallets} autoConnect>
  {children}
</WalletProvider>

// Or implement custom auto-connect hook (see Lesson 3)
```

### Issue: React Strict Mode double-mounting

**Problem:** In development with React Strict Mode, wallet disconnects on refresh

**Solution:**

```typescript
// Option 1: Disable Strict Mode in development (not recommended)
// <React.StrictMode> → Remove

// Option 2: Handle cleanup properly in your hooks
useEffect(() => {
  // Your effect logic

  return () => {
    // Cleanup that accounts for double-mounting
  };
}, [deps]);

// Option 3: Use flags to prevent double-execution
const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  // Your logic
}, []);
```

### Issue: CSS styles not loading

**Problem:** Wallet modal doesn't display correctly

**Solution:**

```typescript
// Import CSS at app entry point
import '@solana/wallet-adapter-react-ui/styles.css';

// Or in your CSS/SCSS file
@import '@solana/wallet-adapter-react-ui/styles.css';
```

### Issue: "useWallet must be used within WalletProvider"

**Problem:** Hook used outside provider context

**Solution:**

```typescript
// ❌ WRONG
function App() {
  const { publicKey } = useWallet(); // Error!

  return (
    <WalletProvider wallets={[]}>
      <div>{publicKey?.toBase58()}</div>
    </WalletProvider>
  );
}

// ✅ CORRECT
function WalletInfo() {
  const { publicKey } = useWallet(); // Works!
  return <div>{publicKey?.toBase58()}</div>;
}

function App() {
  return (
    <WalletProvider wallets={[]}>
      <WalletInfo />
    </WalletProvider>
  );
}
```

---

## Week 2 Quiz Questions

### 1. What is the purpose of the wallet adapter pattern?

<details>
<summary>Click to reveal answer</summary>

The wallet adapter pattern provides a **standardized interface** for integrating multiple wallet types into a single application without writing wallet-specific code for each one.

**Key purposes:**

1. **Abstraction** - Hide wallet-specific implementation details behind a common API
2. **Extensibility** - Add new wallet support without changing existing code
3. **Consistency** - All wallets work through the same interface (connect, disconnect, signTransaction, etc.)
4. **Maintenance** - Wallet updates are handled by individual adapters, not your app code
5. **User Choice** - Let users choose their preferred wallet without forcing a specific one

**Example:**

```typescript
// Without adapter pattern - need wallet-specific code
if (walletType === 'phantom') {
  await window.phantom.solana.connect();
} else if (walletType === 'solflare') {
  await window.solflare.connect();
}
// ... etc for each wallet

// With adapter pattern - same code for all wallets
await wallet.adapter.connect();
```

The pattern is based on the **Adapter design pattern** from software engineering, which allows incompatible interfaces to work together.
</details>

---

### 2. How do you handle multiple wallet types in a single interface?

<details>
<summary>Click to reveal answer</summary>

Handle multiple wallet types by:

**1. Configure wallet adapters in WalletProvider:**

```typescript
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
  ],
  []
);

<WalletProvider wallets={wallets}>
  {children}
</WalletProvider>
```

**2. Use the `useWallet()` hook to access all wallets:**

```typescript
const { wallet, wallets, select, connect } = useWallet();

// List all available wallets
wallets.map((w) => (
  <button onClick={() => {
    select(w.adapter.name);
    connect();
  }}>
    {w.adapter.name}
  </button>
))
```

**3. Check ready state before allowing connection:**

```typescript
const isAvailable =
  wallet.readyState === WalletReadyState.Installed ||
  wallet.readyState === WalletReadyState.Loadable;

if (!isAvailable) {
  // Show "Install" button instead
  window.open(wallet.adapter.url, '_blank');
}
```

**4. Let Wallet Standard handle automatic detection:**

```typescript
// Empty array enables auto-detection
const wallets = useMemo(() => [], []);
```

This detects all wallets implementing the Wallet Standard automatically without explicit configuration.

**Best practices:**
- Sort wallets by availability (installed first)
- Show clear indicators for wallet status
- Provide installation links for missing wallets
- Remember user's last-used wallet
</details>

---

### 3. Explain the wallet ready states and their meanings

<details>
<summary>Click to reveal answer</summary>

Wallet adapters report their availability through `WalletReadyState` enum:

**1. `WalletReadyState.Installed`**
- **Meaning:** Wallet extension is installed and ready to use
- **Example:** User has Phantom extension installed in their browser
- **Action:** Can connect immediately

```typescript
if (wallet.readyState === WalletReadyState.Installed) {
  // Show "Connect" button
  await wallet.adapter.connect();
}
```

**2. `WalletReadyState.NotDetected`**
- **Meaning:** Wallet is not installed in the current environment
- **Example:** User doesn't have Solflare extension
- **Action:** Show installation prompt

```typescript
if (wallet.readyState === WalletReadyState.NotDetected) {
  // Show "Install" button
  window.open(wallet.adapter.url, '_blank');
}
```

**3. `WalletReadyState.Loadable`**
- **Meaning:** Wallet can be loaded on demand (usually on mobile)
- **Example:** Wallet Connect, mobile wallet adapters
- **Action:** Can attempt connection (may open app)

```typescript
if (wallet.readyState === WalletReadyState.Loadable) {
  // Can connect - may trigger app redirect on mobile
  await wallet.adapter.connect();
}
```

**4. `WalletReadyState.Unsupported`**
- **Meaning:** Wallet doesn't work in current environment
- **Example:** Hardware wallet on mobile device
- **Action:** Show "Not Supported" message

```typescript
if (wallet.readyState === WalletReadyState.Unsupported) {
  // Disable connection
  return <div>This wallet is not supported on mobile</div>;
}
```

**UI Implementation:**

```typescript
function WalletButton({ wallet }: { wallet: Wallet }) {
  switch (wallet.readyState) {
    case WalletReadyState.Installed:
      return <button onClick={connect}>Connect</button>;

    case WalletReadyState.NotDetected:
      return (
        <button onClick={() => window.open(wallet.adapter.url, '_blank')}>
          Install
        </button>
      );

    case WalletReadyState.Loadable:
      return <button onClick={connect}>Connect (Mobile)</button>;

    case WalletReadyState.Unsupported:
      return <div>Not Supported</div>;
  }
}
```
</details>

---

### 4. What security considerations apply to auto-connect features?

<details>
<summary>Click to reveal answer</summary>

**Security considerations for auto-connect:**

**1. Never Store Private Keys**
- Auto-connect should ONLY save the wallet name (e.g., "Phantom")
- Never save seed phrases, private keys, or sensitive credentials
- Wallet adapters handle key management securely

```typescript
// ✅ Safe to store
localStorage.setItem('walletName', 'Phantom');

// ❌ NEVER store these
localStorage.setItem('privateKey', ...); // DANGEROUS!
localStorage.setItem('seedPhrase', ...); // DANGEROUS!
```

**2. Rate Limiting**
- Prevent infinite auto-connect loops
- Limit connection attempts to prevent abuse
- Add cooldown periods between attempts

```typescript
const MAX_ATTEMPTS = 3;
const attemptCount = useRef(0);

if (attemptCount.current >= MAX_ATTEMPTS) {
  console.log('Max attempts reached');
  return;
}
```

**3. User Consent**
- Make auto-connect opt-in, not forced
- Provide UI toggle to disable auto-connect
- Clear indication when auto-connecting

```typescript
const [autoConnectEnabled, setAutoConnectEnabled] =
  useLocalStorage('autoConnect', false); // Default: false

// Show toggle in settings
<label>
  <input
    type="checkbox"
    checked={autoConnectEnabled}
    onChange={(e) => setAutoConnectEnabled(e.target.checked)}
  />
  Enable auto-connect
</label>
```

**4. Clear Data on Explicit Disconnect**
- When user manually disconnects, clear auto-connect data
- Don't auto-reconnect after explicit user action
- Respect user intent

```typescript
const handleDisconnect = async () => {
  await disconnect();

  // Clear auto-connect data
  localStorage.removeItem('walletName');
  localStorage.removeItem('autoConnect');
};
```

**5. Validate Wallet Before Connecting**
- Check wallet ready state before auto-connect
- Verify wallet is still installed
- Handle missing wallets gracefully

```typescript
const isWalletReady =
  wallet.readyState === WalletReadyState.Installed ||
  wallet.readyState === WalletReadyState.Loadable;

if (!isWalletReady) {
  console.log('Wallet no longer available');
  localStorage.removeItem('walletName');
  return;
}
```

**6. HTTPS Only**
- Always use HTTPS in production
- Wallet adapters may refuse insecure connections
- Prevents man-in-the-middle attacks

**7. Session Timeouts**
- Consider implementing session timeouts
- Require re-authentication after inactivity
- Clear sensitive session data

```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

useEffect(() => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity);
    if (elapsed > SESSION_TIMEOUT) {
      disconnect();
      localStorage.removeItem('walletName');
    }
  }
}, []);
```

**8. Transparent Logging**
- Log auto-connect attempts for debugging
- Help users understand what's happening
- Don't hide connection activity

```typescript
console.log('Attempting auto-connect to', savedWalletName);
```
</details>

---

### 5. How can you improve wallet connection UX for mobile users?

<details>
<summary>Click to reveal answer</summary>

**Mobile wallet UX improvements:**

**1. Responsive Button Design**

```typescript
export function MobileWalletButton() {
  const { publicKey } = useWallet();

  return (
    <button className="w-full sm:w-auto p-4 sm:p-2">
      {/* Full text on desktop, icon on mobile */}
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </button>
  );
}
```

**2. Bottom Sheet for Wallet Selection**

```typescript
// Use bottom sheet instead of centered modal on mobile
<div className="
  fixed
  bottom-0 sm:bottom-auto
  sm:top-1/2 sm:left-1/2
  sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
  w-full sm:w-96
  rounded-t-xl sm:rounded-xl
">
  {/* Wallet list */}
</div>
```

**3. Larger Touch Targets**

```typescript
// Minimum 44px height for touch targets
<button className="h-14 sm:h-10 px-6 text-lg sm:text-base">
  {wallet.adapter.name}
</button>
```

**4. Mobile Wallet Deep Links**

```typescript
// Detect mobile and use deep links
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile && wallet.adapter.name === 'Phantom') {
  // Open Phantom mobile app
  window.location.href = 'phantom://connect';
}
```

**5. Swipe to Close Modals**

```typescript
// Add swipe gesture for mobile
const handleTouchEnd = (e: TouchEvent) => {
  const swipeDistance = e.changedTouches[0].clientY - touchStart;
  if (swipeDistance > 100) {
    onClose(); // Close modal on swipe down
  }
};
```

**6. Loading States Optimized for Mobile**

```typescript
// Full-screen loading on mobile
{connecting && (
  <div className="
    fixed inset-0
    flex items-center justify-center
    bg-black/50 backdrop-blur-sm
    z-50
  ">
    <div className="text-white">
      <Spinner />
      <p className="mt-4">Connecting to {wallet?.adapter.name}...</p>
    </div>
  </div>
)}
```

**7. Persistent Connection Indicator**

```typescript
// Show connection status in a fixed position
<div className="
  fixed top-0 left-0 right-0
  bg-green-500 text-white text-center py-2
  text-sm z-40
">
  Connected to {wallet?.adapter.name}
</div>
```

**8. Simplified Mobile UI**

```typescript
function MobileWalletInfo() {
  return (
    <div className="p-4">
      {/* Show only essential info on mobile */}
      <div className="text-sm font-mono">
        {publicKey?.toBase58().slice(0, 4)}...
        {publicKey?.toBase58().slice(-4)}
      </div>
      <div className="text-lg font-bold">{balance} SOL</div>

      {/* Full address in expandable section */}
      <details>
        <summary>Full Address</summary>
        <p className="text-xs break-all">{publicKey?.toBase58()}</p>
      </details>
    </div>
  );
}
```

**9. Auto-Detect Mobile Wallets**

```typescript
// Prioritize mobile-optimized wallets on mobile
const wallets = useMemo(() => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return [
      // Mobile-first wallets
      new SolanaMobileWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];
  }

  return [
    // Desktop wallets
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new LedgerWalletAdapter(),
  ];
}, []);
```

**10. Haptic Feedback**

```typescript
// Add vibration feedback for mobile
const handleConnect = async () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Short vibration
  }
  await connect();
};
```

**11. Reduced Motion**

```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<div className={`transition-all ${prefersReducedMotion ? '' : 'duration-300'}`}>
  {/* Content */}
</div>
```

**12. Install Prompts for Mobile**

```typescript
// Show mobile-specific install instructions
if (wallet.readyState === WalletReadyState.NotDetected && isMobile) {
  return (
    <div className="text-center p-4">
      <p>Install {wallet.adapter.name} on your mobile device</p>
      <a
        href={`https://apps.apple.com/app/${wallet.adapter.name}`}
        className="btn mt-4"
      >
        Download from App Store
      </a>
    </div>
  );
}
```
</details>

---

## Hands-On Challenge

### Wallet Connection Speed Run

Build a wallet connection interface with these constraints:

- Must connect in under 3 clicks
- Should remember last used wallet
- Must work on mobile devices
- Include visual feedback for all states
- Handle errors gracefully

**Bonus Points:**

- Add wallet balance display
- Implement ENS/SNS domain resolution
- Create custom wallet icons
- Add connection animations

### Challenge Steps

1. **One-Click Connect (for returning users)**
   - Auto-connect on page load if wallet was previously used
   - Show "Connect" button that immediately opens last-used wallet

2. **Two-Click Connect (for new users)**
   - First click: Open wallet selection modal
   - Second click: Select and connect to wallet

3. **Three-Click Maximum (for wallet installation)**
   - First click: Open wallet selection modal
   - Second click: Click "Install" for missing wallet
   - Third click: Return and connect after installation

**Evaluation:**
- Count clicks from landing to connected state
- Test on desktop and mobile
- Verify auto-connect works
- Check error handling

---

## Looking Ahead

Next week covers message signing and transaction patterns, including:

- Message signing for authentication
- Transaction signing workflows
- Building transaction preview UIs
- Implementing approval patterns

Prerequisites for next week include having devnet SOL available for transaction exercises. Free devnet SOL is available from the [Solana Faucet](https://faucet.solana.com/).

---

## Summary

This week you learned to:

1. **Set up wallet providers** using the Solana wallet adapter architecture
2. **Build custom wallet UI** with hooks and components
3. **Implement auto-connect** for improved user experience
4. **Handle wallet events** and state management
5. **Follow security best practices** for wallet integration

**Key takeaways:**

- Use `ConnectionProvider` → `WalletProvider` → `WalletModalProvider` hierarchy
- Leverage `useWallet()` and `useConnection()` hooks for wallet interactions
- Handle all wallet ready states appropriately
- Implement auto-connect with localStorage persistence
- Never store private keys - only wallet names
- Provide great mobile UX with responsive design
- Add loading states and error handling for all async operations

You're now ready to build production-quality wallet connection experiences for Solana applications!
