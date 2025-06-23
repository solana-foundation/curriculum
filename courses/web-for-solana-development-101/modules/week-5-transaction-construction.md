# Week 5: Advanced Transaction Construction with Gill

## Overview

This week focuses on mastering gill's functional approach to transaction construction. Topics include building complex transactions using the pipe pattern, handling priority fees, implementing retry mechanisms, and creating robust transaction confirmation flows.

## Learning Objectives

Learning outcomes for this week include:

1. Master gill's pipe-based transaction construction
2. Build multi-instruction transactions
3. Implement priority fees and compute budget optimization
4. Create robust retry and confirmation mechanisms
5. Handle partial signing and offline transactions

## Lessons

### Lesson 1: Transaction Construction with Pipe Pattern

**Topics Covered:**
- Understanding gill's functional composition
- Transaction message creation and configuration
- Adding instructions with pipe
- Transaction versioning (legacy vs v0)
- Lookup tables for v0 transactions

**Lab Exercise: Transaction Builder with Pipe Pattern**

Create a transaction builder component that:
- Manages state for recipient, amount, and transaction status
- Creates a gill Solana client for devnet
- Implements transaction building function that:
  - Updates status through building phases
  - Fetches latest blockhash for transaction lifetime
  - Constructs transfer instruction with:
    - System program ID
    - Proper account keys (sender as signer/writable, recipient as writable)
    - Encoded data with transfer discriminator and amount in lamports
  - Uses gill's pipe pattern to:
    - Create v0 transaction message
    - Set fee payer signer
    - Set transaction lifetime with blockhash
    - Append transfer instruction
    - Support adding multiple instructions
  - Signs and sends transaction
  - Waits for confirmation at 'confirmed' level
  - Handles errors appropriately
- Provides UI with:
  - Input fields for recipient and amount
  - Send button with status-based text
  - Disabled states during processing
  - Status indicator component

**Key Concepts:**
- Pipe function composition
- Transaction message structure
- Instruction format
- Signer management
- Version selection

### Lesson 2: Multi-Instruction Transactions and Compute Budget

**Topics Covered:**
- Building complex multi-instruction transactions
- Compute unit optimization
- Priority fees implementation
- Transaction size limits
- Instruction ordering importance

**Lab Exercise: Complex Multi-Instruction Transactions**

Build a complex transaction builder that:

**Component Interface:**
- Accepts array of operations with type and data
- Supports transfer, tokenTransfer, and memo operations

**Transaction Building Logic:**
- Creates gill client and fetches latest blockhash
- Estimates compute units based on operation count
- Constructs compute budget instructions:
  - Sets compute unit limit (max 1.4M)
  - Sets priority fee in microlamports
- Maps operations to appropriate instructions
- Uses pipe pattern to build transaction:
  - Creates v0 transaction message
  - Sets fee payer and lifetime
  - Adds compute budget instructions first
  - Appends operation instructions in order
- Simulates transaction before sending:
  - Checks for simulation errors
  - Logs compute units consumed
- Signs and sends final transaction

**UI Components:**
- Display operations with visual indicators
- Show compute unit estimates per operation
- Calculate total estimated compute units
- Display priority fee calculation
- Execute button to trigger transaction
- Proper styling with cards and sections

**Key Concepts:**
- Compute budget management
- Priority fee strategies
- Instruction ordering
- Transaction simulation
- Error handling

### Lesson 3: Transaction Confirmation and Retry Strategies

**Topics Covered:**
- Confirmation strategies and commitment levels
- Implementing retry logic
- Handling dropped transactions
- WebSocket vs polling confirmation
- Transaction expiration handling

**Lab Exercise: Transaction Confirmation and Retry System**

**TransactionConfirmer Class Implementation:**
- Create a class that accepts a gill Solana client
- Implement confirmWithRetry method that:
  - Accepts signature and confirmation options
  - Uses configurable parameters (commitment, retries, delay, timeout)
  - Tracks elapsed time and attempt count
  - Implements retry loop with:
    - Timeout checking
    - Transaction confirmation attempts
    - Error result handling
    - Transaction details fetching
    - Delay between retries
    - Proper error logging
  - Returns confirmation status with slot and error info

- Implement confirmWithWebSocket method that:
  - Returns a Promise for async handling
  - Sets up timeout for WebSocket connection
  - Subscribes to signature notifications
  - Handles notification callbacks:
    - Clears timeout on response
    - Unsubscribes from notifications
    - Resolves with confirmation status
  - Manages error scenarios
  - Cleans up resources properly

**TransactionSender Component:**
- Manages transaction status states
- Implements sendAndConfirm function that:
  - Updates status through phases
  - Sends transaction and captures signature
  - Creates confirmer instance
  - Uses retry confirmation with custom options
  - Updates UI based on results
  - Handles errors gracefully
- Provides UI with:
  - Send & Confirm button
  - Disabled state during processing
  - Status display component integration

**Key Concepts:**
- Confirmation strategies
- Retry patterns
- Timeout handling
- WebSocket vs HTTP polling
- Error recovery

## Practical Assignment

### Build a Transaction Management System

Create a comprehensive transaction management interface that includes:

1. **Transaction Builder**
   - Visual instruction builder
   - Drag-and-drop instruction ordering
   - Compute unit estimation
   - Priority fee calculator

2. **Batch Transaction Tool**
   - Execute multiple operations in one transaction
   - Optimize instruction ordering
   - Handle size limits gracefully
   - Progress tracking

3. **Smart Confirmation System**
   - Adaptive retry logic
   - Multiple confirmation strategies
   - Transaction status tracking
   - Error recovery options

4. **Transaction Templates**
   - Save common transaction patterns
   - Quick-send templates
   - Parameter substitution
   - Share templates

**Requirements:**
- Use gill's pipe pattern throughout
- Implement comprehensive error handling
- Add transaction simulation before sending
- Include detailed logging
- Support offline transaction creation

**Evaluation Criteria:**
- Code architecture and reusability
- Error handling robustness
- User experience quality
- Performance optimization
- Testing coverage

## Additional Resources

### Required Reading
- [Gill Transaction Documentation](https://github.com/solana-foundation/gill#transactions)
- [Transaction Confirmation Best Practices](https://solana.com/docs/core/transactions/confirmation)
- [Compute Budget Documentation](https://docs.solana.com/developing/programming-model/runtime#compute-budget)

### Supplementary Materials
- [Priority Fees Explained](https://www.helius.dev/blog/priority-fees-understanding-solanas-transaction-fees)
- [Versioned Transactions Guide](https://solana.com/docs/core/transactions/versions)
- Video: [Transaction Optimization Techniques](https://www.youtube.com/watch?v=example)

### Practice Exercises
1. Build a transaction fee estimator
2. Create a transaction debugger
3. Implement transaction batching
4. Add transaction scheduling

## Common Issues and Solutions

### Issue: Transaction too large
**Solution:** 
- Create and use address lookup tables for v0 transactions
- Reduce account references by using lookup tables
- Split large transactions into multiple smaller ones
- Consider instruction data optimization

### Issue: Compute units exceeded
**Solution:** 
- Analyze compute unit usage per instruction
- Split instructions into chunks under compute limit
- Optimize instruction order for efficiency
- Consider using separate transactions
- Set appropriate compute unit limits

### Issue: Transaction dropped
**Solution:** 
- Fetch fresh blockhash for retry attempts
- Rebuild transaction with new blockhash
- Implement exponential backoff for retries
- Monitor transaction expiration
- Use durable nonces for critical transactions

## Week 5 Quiz Questions

1. How does the pipe pattern improve transaction building?
2. When should you use v0 vs legacy transactions?
3. What factors determine optimal priority fees?
4. How do different confirmation strategies compare?
5. What are the benefits of transaction simulation?

## Hands-On Challenge

### Transaction Optimization Challenge

Build a tool that:
- Analyzes transaction compute usage
- Suggests optimization strategies
- Implements automatic batching
- Provides cost estimates
- Generates performance reports

**Advanced Features:**
- AI-powered instruction ordering
- Dynamic priority fee adjustment
- Predictive confirmation times
- Multi-cluster support

## Looking Ahead

Next week begins integration with Anchor programs. Topics include:
- Understanding Anchor IDLs
- Type generation from IDLs
- Calling program methods
- Handling program accounts

Prerequisites include reviewing Anchor documentation and having a basic understanding of how Anchor programs work.