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

## Lessons

### Lesson 1: Setting Up Wallet Providers

**Topics Covered:**

- Understanding the wallet adapter architecture  
- Configuring `WalletUi` provider  
- Cluster management with wallet-ui  
- Storage patterns for wallet preferences  
- Provider composition in React  

**Lab Exercise: Setting Up Wallet Providers**  
Implement an app providers component that:

- Imports necessary wallet-ui components and utilities
- Creates cluster storage for persisting user's cluster selection
- Configures wallet UI with all Solana clusters (devnet, localnet, testnet, mainnet)
- Sets up provider hierarchy with WalletUi wrapping other providers
- Enables auto-detection of installed wallets
- Integrates with React Query for data fetching

**Key Concepts:**

- Provider hierarchy and context  
- Cluster configuration and switching  
- Wallet auto-detection  
- Storage abstraction for preferences  

### Lesson 2: Building Wallet Connection UI

**Topics Covered:**

- Using wallet-ui hooks: `useWallets`, `useWalletUi`  
- Creating wallet selection modal  
- Responsive wallet button design  
- Handling connection loading states  
- Accessibility considerations  

**Lab Exercise: Building Wallet Connection UI**  
Create a WalletButton component that:

- Uses wallet-ui hooks to access wallet state and functions  
- Displays different UI based on connection status:  
  - When connected: Shows truncated public key with disconnect option  
  - When disconnected: Shows "Connect Wallet" button  
- Implements modal pattern for wallet selection  
- Handles wallet connection through modal selection  
- Applies appropriate styling for different states  
- Manages modal visibility with local state  

**Key Concepts:**

- Conditional rendering based on wallet state  
- User-friendly address display  
- Modal patterns for wallet selection  
- Loading and error states  

### Lesson 3: Advanced Wallet Features

**Topics Covered:**

- Auto-connect implementation  
- Wallet persistence with localStorage  
- Handling wallet events  
- Multi-wallet support patterns  
- Security considerations  

**Lab Exercise: Implementing Auto-Connect**  
Build a custom hook for auto-connect functionality that:

- Checks if user is already connected to avoid redundant attempts  
- Retrieves saved wallet preference from localStorage  
- Finds the saved wallet in available wallets list  
- Verifies wallet is installed before attempting connection  
- Automatically connects to previously used wallet on page load  
- Saves wallet preference when user connects manually  
- Uses proper React effect dependencies  
- Handles edge cases gracefully  

**Key Concepts:**

- Browser storage strategies  
- Wallet ready states  
- Event handling patterns  
- Security best practices  

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

## Additional Resources

### Required Reading

- [Wallet Adapter Documentation](https://github.com/anza-xyz/wallet-adapter)  
- [Wallet Standard](https://github.com/wallet-standard/wallet-standard)  

### Practice Exercises

1. Add wallet switching without disconnecting  
2. Implement a "recently used wallets" section  
3. Create wallet connection analytics  
4. Build a mini wallet dashboard  

## Common Issues and Solutions

### Issue: Wallet not detected

**Solution:**  
- Check wallet ready state before attempting connection  
- If wallet is not detected, provide installation link  
- Open wallet download page in new tab  
- Show helpful message to user about installing wallet  

### Issue: Auto-connect loops

**Solution:**  
- Implement connection attempt tracking with state  
- Add guards to prevent multiple connection attempts  
- Use debouncing techniques for connection logic  
- Track connection history to avoid infinite loops  

### Issue: Wallet disconnects on page refresh

**Solution:**  
- Implement proper persistence and re-connection logic  

## Week 2 Quiz Questions

1. What is the purpose of the wallet adapter pattern?  
2. How do you handle multiple wallet types in a single interface?  
3. Explain the wallet ready states and their meanings  
4. What security considerations apply to auto-connect features?  
5. How can you improve wallet connection UX for mobile users?  

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

## Looking Ahead

Next week covers message signing and transaction patterns, including:

- Message signing for authentication  
- Transaction signing workflows  
- Building transaction preview UIs  
- Implementing approval patterns  

Prerequisites for next week include having devnet SOL available for transaction exercises. Free devnet SOL is available from the [Solana Faucet](https://faucet.solana.com/).
