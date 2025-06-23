# Week 3: Wallet Interactions and Signing

## Overview

This week explores wallet interactions beyond basic connection. Topics include message signing for authentication, transaction signing patterns, and building secure approval flows. The wallet-ui examples demonstrate real-world signing scenarios.

## Learning Objectives

Learning outcomes for this week include:

1. Implement message signing for authentication ("Sign in with Solana")
2. Build transaction preview and approval interfaces
3. Handle different types of signing requests
4. Manage wallet state with React Query
5. Implement secure signing patterns and error handling

## Lessons

### Lesson 1: Message Signing and Authentication

**Topics Covered:**
- Message signing fundamentals
- Building "Sign in with Solana" authentication
- Signature verification on frontend
- Nonce usage for security
- JWT integration patterns

**Lab Exercise: Sign In With Solana Implementation**

Create a SignInWithSolana component that:
- Uses wallet-ui hooks to access public key and sign message functionality
- Manages authentication state and loading state
- Constructs a secure message for signing that includes:
  - Application name
  - Wallet public key
  - Timestamp to prevent replay attacks
  - Random nonce for additional security
- Encodes the message properly for signing
- Handles the signature request and response
- Stores authentication token in localStorage with:
  - Public key
  - Base64-encoded signature
  - Timestamp
- Displays authentication status with truncated address
- Provides appropriate UI feedback during signing process
- Handles errors gracefully with console logging

**Key Concepts:**
- Message structure for signing
- Nonce and timestamp for security
- Signature encoding and storage
- Frontend vs backend verification

### Lesson 2: Transaction Signing and Preview

**Topics Covered:**
- Transaction signing vs sending
- Building transaction preview UI
- Displaying transaction effects
- Fee estimation and display
- Simulation before signing

**Lab Exercise: Transaction Preview Component**

Build a TransactionPreview component that:
- Accepts props for transaction instructions and approval/rejection callbacks
- Uses wallet-ui hooks to access client and public key
- Manages simulation state and loading state
- Automatically simulates transaction when instructions change
- Implements transaction simulation that:
  - Fetches latest blockhash
  - Constructs transaction message using gill's pipe pattern
  - Sets fee payer and lifetime
  - Appends all provided instructions
  - Executes RPC simulation call
- Displays simulation results including:
  - Estimated fee in lamports
  - List of instruction program IDs (truncated)
  - Error messages if simulation fails
- Provides approve/reject buttons with:
  - Cancel button for rejection
  - Approve button (disabled on simulation error)
  - Appropriate styling and hover states
- Handles loading states gracefully
- Logs simulation errors to console

**Key Concepts:**
- Transaction simulation importance
- Fee estimation techniques
- User-friendly error display
- Approval/rejection flows

### Lesson 3: Wallet State Management

**Topics Covered:**
- React Query for wallet data
- Caching strategies for blockchain data
- Real-time balance updates
- Transaction history tracking
- Optimistic updates

**Lab Exercise: Wallet State Management with React Query**

Implement wallet data hooks and dashboard:

1. **useWalletBalance Hook**
   - Use React Query with wallet-ui hooks
   - Set query key including public key for proper caching
   - Fetch balance using RPC client
   - Transform response to include both lamports and SOL values
   - Enable query only when wallet is connected
   - Set up automatic refetch interval (e.g., every 10 seconds)

2. **useTransactionHistory Hook**
   - Create query for fetching recent transactions
   - Use getSignaturesForAddress RPC method
   - Limit results to recent transactions (e.g., 10)
   - Return empty array as fallback
   - Enable only when wallet is connected

3. **WalletDashboard Component**
   - Use both custom hooks to fetch data
   - Display balance in SOL with proper decimal formatting
   - Show transaction count
   - Create grid layout for metrics
   - Build transaction list with proper mapping
   - Handle loading and empty states
   - Apply appropriate styling for cards and sections

**Key Concepts:**
- Query key strategies
- Automatic refetching
- Loading and error states
- Data transformation

## Practical Assignment

### Build a Secure Transaction Approval System

Create a complete transaction approval flow that includes:

1. **Message Signing Authentication**
   - Implement "Sign in with Solana"
   - Include session management
   - Add logout functionality

2. **Transaction Builder Interface**
   - Allow users to create simple transfers
   - Add recipient validation
   - Include amount input with SOL/lamport conversion

3. **Transaction Preview Modal**
   - Show simulation results
   - Display fees and effects
   - Include approval/rejection buttons
   - Add loading states

4. **Transaction Status Tracking**
   - Show pending transactions
   - Update on confirmation
   - Display success/failure states
   - Include transaction links

**Requirements:**
- Use wallet-ui patterns
- Implement proper error boundaries
- Add comprehensive loading states
- Include mobile responsiveness
- Cache data with React Query

**Evaluation Criteria:**
- Code organization and reusability
- Error handling completeness
- User experience quality
- Security considerations
- Performance optimization

## Additional Resources

### Required Reading
- [Solana Message Signing](https://docs.phantom.app/solana/signing-a-message)
- [Transaction Confirmation Strategies](https://solana.com/docs/core/transactions/confirmation)
- [React Query Documentation](https://tanstack.com/query/latest)

### Supplementary Materials
- [Building Secure Web3 Authentication](https://www.quicknode.com/guides/ethereum-development/dapps/how-to-build-a-web3-login)
- [Transaction UX Best Practices](https://solana.com/developers/guides/advanced/introduction-to-durable-nonces)
- Video: [Wallet Security Deep Dive](https://www.youtube.com/watch?v=example)

### Practice Exercises
1. Add transaction history pagination
2. Implement transaction filtering by type
3. Create a transaction template system
4. Build batch transaction support

## Common Issues and Solutions

### Issue: Signature verification failing
**Solution:** 
- Ensure consistent message encoding using TextEncoder
- Use the same encoding method on both frontend and backend
- Verify message format matches exactly between signing and verification
- Check for any character encoding issues

### Issue: Transaction simulation errors not user-friendly
**Solution:** 
- Create error translation function to parse error messages
- Check for common error patterns like "insufficient funds"
- Return user-friendly messages for known errors
- Provide fallback for unknown errors
- Consider creating an error code mapping object

### Issue: Stale data after transaction
**Solution:** 
- Use React Query's invalidateQueries after successful transactions
- Invalidate specific query keys like 'balance' and 'transactions'
- Consider using optimistic updates for better UX
- Set up proper query dependencies

## Week 3 Quiz Questions

1. Why is message signing important for Web3 authentication?
2. What's the difference between signing and sending a transaction?
3. How can you prevent replay attacks in message signing?
4. Explain the benefits of transaction simulation
5. What caching strategies work best for blockchain data?

## Hands-On Challenge

### Speed Transaction Builder

Create a transaction builder with these features:
- Build and send a transaction in under 5 clicks
- Include intelligent fee estimation
- Add transaction templates for common operations
- Implement keyboard shortcuts
- Show real-time balance impact

**Bonus Features:**
- Multi-signature support
- Transaction scheduling
- Batch operations
- Export transaction for offline signing

## Looking Ahead

Next week covers gill's RPC methods in depth, including:
- Advanced RPC operations
- Token account queries
- WebSocket subscriptions
- Performance optimization techniques

Prerequisites for next week include reviewing the gill documentation on RPC methods.