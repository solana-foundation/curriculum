# Week 4: RPC Operations with Framework-Kit

## Overview

This week provides a comprehensive exploration of framework-kit's RPC capabilities. Topics include querying blockchain data, working with token accounts, and implementing real-time subscriptions. Practical examples demonstrate efficient data fetching patterns using `@solana/client` and `@solana/react-hooks`.

## Learning Objectives

Learning outcomes for this week include:

1. Master framework-kit's RPC client for data queries
2. Implement efficient token account operations
3. Set up WebSocket subscriptions with Kit watchers for real-time updates
4. Optimize RPC usage for performance
5. Handle RPC errors and implement fallback strategies

## Lessons

### Lesson 1: Core RPC Methods with Framework-Kit

**Topics Covered:**

- Framework-kit RPC client architecture
- Essential RPC methods for dApp development
- Understanding commitment levels
- Batch operations and performance
- Error handling patterns

**Lab Exercise: RPC Explorer Implementation**

Build an RPC Explorer component that:

- Creates a Solana client using `createClient()` configured for devnet
- Manages state for address input, data results, and loading status
- Implements address exploration functionality that:
  - Fetches account info with `jsonParsed` encoding and `confirmed` commitment
  - Retrieves account balance separately
  - Gets recent transaction signatures (limit to 5)
  - Determines if address is a program (executable)
  - Compiles comprehensive data object with:
    - Existence status
    - Balance in lamports
    - Owner address
    - Executable status
    - Rent epoch
    - Data size
    - Recent transaction count
- Handles errors gracefully with try-catch
- Displays results in a formatted layout:
  - Input field with explore button
  - Loading states
  - Error messages when applicable
  - Detailed account information in definition list format
  - Balance converted to SOL with 4 decimal places

**Key Concepts:**

- RPC method chaining
- Commitment levels impact
- Response parsing
- Error types and handling

---

### Lesson 2: Token Operations with Framework-Kit

**Topics Covered:**

- SPL Token program basics
- Querying token accounts efficiently
- Parsing token account data
- Working with associated token accounts
- Token metadata integration

**Lab Exercise: Token Portfolio Implementation**

Create a token portfolio system with these components:

1. **`useTokenAccounts` Hook**

   - Create Solana client using `createClient()` for devnet
   - Use React Query with appropriate query key
   - Implement parallel fetching for both token programs:
     - Standard SPL Token Program accounts
     - Token-2022 Program accounts
   - Apply filters for efficiency:
     - Data size filter (165 bytes for standard token accounts)
     - Memcmp filter at offset 32 for owner matching
   - Parse and combine results from both programs
   - Transform account data to extract:
     - Public key
     - Mint address
     - Owner address
     - Token amount (raw)
     - Decimals
     - UI-friendly amount
   - Enable query only when wallet address exists

2. **`TokenPortfolio` Component**
   - Use the custom hook to fetch token accounts
   - Handle loading states appropriately
   - Display token portfolio with:
     - Section heading
     - Empty state for no tokens
     - Grid layout for token cards
     - Each token card showing:
       - Truncated mint address
       - Token balance
       - Optional price component integration

**Key Concepts:**

- Program account filtering
- Data size filters for efficiency
- Memcmp filters for ownership
- Parsing token account data
- Handling multiple token programs

---

### Lesson 3: WebSocket Subscriptions

**Topics Covered:**

- Real-time data with WebSocket RPC
- Account change notifications
- Slot updates and block production
- Managing subscription lifecycle
- Reconnection strategies

**Lab Exercise: Real-time WebSocket Subscriptions**

Implement real-time monitoring components:

1. **RealtimeBalance Component**

   - Create client using `createClient()` with WebSocket endpoint configuration
   - Manage state for balance, last update time, and subscription reference
   - Implement initial balance fetch on mount
   - Set up WebSocket subscription that:
     - Subscribes to account notifications with confirmed commitment
     - Handles incoming balance updates
     - Updates UI with new balance and timestamp
     - Implements error handling with automatic reconnection (5-second delay)
     - Logs subscription lifecycle events
   - Clean up subscription on unmount
   - Display UI with:
     - Live balance in SOL (9 decimal places)
     - Last update timestamp
     - Visual indicator for active connection (pulsing dot)
     - Loading state while fetching

2. **SlotMonitor Component**
   - Create client using `createClient()` for slot monitoring
   - Subscribe to slot notifications
   - Update current slot on each notification
   - Handle subscription cleanup
   - Display current slot with loading state

**Key Implementation Details:**

- Use `useRef` for subscription management
- Implement proper cleanup in `useEffect` return
- Handle connection errors gracefully
- Show visual feedback for live updates
- Format numbers appropriately for display

**Key Concepts:**

- WebSocket connection management
- Subscription patterns
- Handling disconnections
- Real-time UI updates
- Resource cleanup

---

## Practical Assignment

### Build a Comprehensive Blockchain Explorer

Create a mini blockchain explorer that demonstrates advanced RPC usage:

1. **Account Explorer**

   - Search any address
   - Show detailed account information
   - Display token holdings
   - List recent transactions

2. **Real-time Monitor**

   - Live balance updates
   - Transaction notifications
   - Slot/block tracking
   - Network health indicators

3. **Token Analytics**

   - Token portfolio view
   - Price integration (mock data is fine)
   - Transfer history
   - Token metadata display

4. **Performance Dashboard**
   - RPC call metrics
   - Response time tracking
   - Error rate monitoring
   - Caching statistics

**Requirements:**

- Use framework-kit for all RPC operations
- Implement proper error handling
- Add loading and empty states
- Cache data appropriately
- Handle rate limiting gracefully

**Bonus Features:**

- Export data to CSV
- Multi-address monitoring
- Custom RPC endpoint support
- Historical data charts

---

## Additional Resources

### Required Reading

- [Framework-Kit Repository](https://github.com/solana-foundation/framework-kit)
- [@solana/kit RPC Documentation](https://solana.com/docs/clients/kit)
- [Solana RPC API Reference](https://docs.solana.com/api/http)
- [WebSocket API Guide](https://docs.solana.com/api/websocket)

### Supplementary Materials

- [RPC Best Practices](https://rpcfast.com/blog/solana-rpc-node-full-guide)
- [Token Account Structure](https://spl.solana.com/token#account-data)

### Practice Exercises

1. Implement RPC request batching
2. Add multi-cluster support
3. Create a token snapshot tool
4. Build a transaction analyzer

---

## Common Issues and Solutions

### Issue: RPC rate limiting

**Solution:**

- Implement request queuing with concurrency limits
- Use a `Map`-based cache for frequent requests
- Set up a queue library (like `p-queue`) with controlled concurrency
- Cache responses with appropriate TTL
- Implement request deduplication

### Issue: WebSocket connection drops

**Solution:**

- Implement exponential backoff for reconnection
- Track retry count and increase delay progressively
- Cap maximum reconnection delay (e.g., 30 seconds)
- Clear subscription before reconnecting
- Log reconnection attempts for debugging

### Issue: Large account data

**Solution:**

- Use `dataSlice` to fetch only required portions of account data
- Apply specific filters to reduce response size
- Implement pagination for large result sets
- Use offset and length parameters strategically
- Consider `memcmp` filters for precise data matching

---

## Week 4 Quiz Questions

1. What are the benefits of using `jsonParsed` encoding?
2. How do `memcmp` filters improve RPC performance?
3. When should you use different commitment levels?
4. What's the difference between HTTP and WebSocket RPC?
5. How can you optimize token account queries?

---

## Hands-On Challenge

### RPC Performance Optimizer

Build a tool that:

- Monitors RPC performance across multiple endpoints
- Automatically switches to fastest endpoint
- Implements intelligent caching
- Provides usage analytics
- Exports performance reports

**Advanced Requirements:**

- Predictive prefetching
- Request deduplication
- Fallback strategies
- Cost optimization (for paid RPCs)

---

## Looking Ahead

Next week explores advanced transaction construction with Kit. Topics include:

- Complex transaction construction with transaction message APIs
- Multi-instruction transactions
- Priority fees and compute budget
- Transaction confirmation strategies

Review the @solana/kit documentation on transaction building to prepare for next week's advanced patterns.
