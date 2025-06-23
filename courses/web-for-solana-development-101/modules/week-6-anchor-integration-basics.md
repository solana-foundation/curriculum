# Week 6: Anchor Integration Basics

## Overview

This week introduces integrating Anchor programs in web applications. Topics include working with Anchor IDLs, generating TypeScript types, and building type-safe interactions with on-chain programs using the `@coral-xyz/anchor` client library alongside gill.

## Learning Objectives

Learning outcomes for this week include:

1. Understand Anchor IDL structure and purpose
2. Set up Anchor client with gill and wallet-ui
3. Generate and use TypeScript types from IDLs
4. Call program instructions with type safety
5. Handle program errors gracefully

## Lessons

### Lesson 1: Understanding Anchor IDLs

**Topics Covered:**
- What is an IDL and why it matters
- IDL structure: instructions, accounts, types, errors
- IDL generation from Anchor programs
- Version management and updates
- Using IDLs for client generation

**Lab Exercise: Anchor Setup and IDL Exploration**

**1. IDL Type Definition Structure:**
- Define TypeScript type for your program IDL including:
  - Version and name metadata
  - Instructions array with:
    - Instruction names
    - Account requirements (mutability, signer status)
    - Argument definitions with types
  - Account type definitions with:
    - Struct fields and their types
    - Field names matching on-chain structure

**2. useAnchorProgram Hook Implementation:**
- Use wallet-ui hooks to get wallet functions
- Create gill Solana client for RPC connection
- Implement useMemo for program instance that:
  - Returns null if no wallet connected
  - Creates Connection from gill client URL
  - Constructs wallet object with signing functions
  - Initializes AnchorProvider with connection and wallet
  - Sets provider globally with setProvider
  - Creates and returns Program instance with IDL and address

**3. IDLExplorer Component:**
- Build visual IDL explorer that displays:
  - Program metadata (name, version, address)
  - Instructions list with:
    - Instruction names
    - Argument and account counts
    - Visual hierarchy indicators
  - Account types with:
    - Type names
    - Field counts
  - Proper styling with cards and sections
  - Handle missing data gracefully

**Key Concepts:**
- IDL as contract ABI
- Type generation benefits
- Provider setup with wallet
- Program instantiation
- Version compatibility

### Lesson 2: Calling Program Instructions

**Topics Covered:**
- Using program methods namespace
- Account resolution patterns
- Passing instruction arguments
- Transaction options and configuration
- Handling responses

**Lab Exercise: Program Interaction Implementation**

**Component Setup:**
- Use custom Anchor program hook
- Manage loading and data states
- Create input interface for user data

**Initialize Account Function:**
- Check program availability before proceeding
- Set loading state appropriately
- Generate PDA using:
  - Seed array with 'data-account' and user public key
  - Program ID for derivation
- Call program instruction using:
  - Methods namespace with instruction name
  - Pass required arguments
  - Provide accounts object with all required accounts
  - Execute with .rpc() method
- After transaction:
  - Log transaction signature
  - Fetch created account data
  - Return transaction and account info
- Handle errors with:
  - Anchor error parsing
  - User-friendly error messages
  - Proper cleanup in finally block

**Update Data Function:**
- Derive PDA same as initialization
- Use program methods with RPC options:
  - skipPreflight configuration
  - Commitment level
  - Max retry attempts
- Handle errors with dedicated error handler

**Build Transaction Alternative:**
- Show how to build without sending:
  - Use .instruction() to get raw instruction
  - Use .transaction() to get full transaction
- Useful for offline signing or batching

**Error Handling Helper:**
- Parse Anchor-specific errors:
  - Check for error code and message
  - Log error details and logs
- Handle RPC and unknown errors
- Provide appropriate error context

**UI Components:**
- Data input field
- Initialize and Update buttons
- Loading states and disabled conditions
- Error display component integration

**Key Concepts:**
- Methods namespace usage
- Account resolution
- PDA generation
- Error handling
- Transaction options

### Lesson 3: Type Safety and Error Handling

**Topics Covered:**
- Leveraging TypeScript with IDL types
- Custom error handling
- Program event parsing
- Type guards and validation
- Development vs production patterns

**Lab Exercise: Type-Safe Program Client**

**Type Extraction Setup:**
- Extract types from IDL using Anchor utilities:
  - IdlTypes for general program types
  - IdlAccounts for account type definitions
  - IdlEvents for event type definitions
- Create specific type aliases for your program

**TypeSafeProgramClient Class:**

1. **Constructor and Setup:**
   - Accept typed Program instance
   - Store as private property

2. **createUserProfile Method:**
   - Define parameters with proper types
   - Return typed promise with signature and profile
   - Implementation details:
     - TypeScript automatically validates method arguments
     - Accounts object is type-checked for completeness
     - Fetch returns properly typed account data

3. **getAllProfiles Method:**
   - Return typed array of pubkey/account pairs
   - Use account.all() with filters:
     - Memcmp filter at discriminator offset
     - Encode filter bytes properly

4. **Event Subscription:**
   - Accept typed callback function
   - Use addEventListener with:
     - Event name from IDL
     - Handler receiving event and slot
     - Proper event type inference

5. **Error Parsing:**
   - Return structured error object or null
   - Extract error code and message
   - Provide fallback for unknown errors

6. **PDA Derivation Helper:**
   - Private method for consistent PDA generation
   - Use appropriate seeds
   - Return typed PublicKey

**Usage Component Implementation:**
- Manage profiles state with proper typing
- Set up event subscription in useEffect:
  - Create client instance
  - Subscribe to events
  - Handle cleanup on unmount
- Implement profile fetching:
  - Use type-safe client methods
  - Update state with fetched data
- Render profiles with typed components

**Key Concepts:**
- IDL type extraction
- Type-safe method calls
- Event typing
- Error type definitions
- Client wrapper patterns

## Practical Assignment

### Build an Anchor Program Dashboard

Create a comprehensive dashboard for interacting with an Anchor program:

1. **IDL Explorer**
   - Display program metadata
   - List all instructions with arguments
   - Show account structures
   - Display error definitions

2. **Instruction Builder**
   - Dynamic form based on IDL
   - Account resolution helpers
   - Argument validation
   - Transaction preview

3. **Account Explorer**
   - Fetch and display program accounts
   - Filter by type or owner
   - Real-time updates
   - Export functionality

4. **Event Monitor**
   - Subscribe to program events
   - Event history display
   - Filter and search events
   - Event statistics

**Requirements:**
- Full TypeScript type safety
- Comprehensive error handling
- Loading and empty states
- Mobile responsive design
- Export data functionality

**Bonus Features:**
- IDL version comparison
- Multi-program support
- Transaction history
- Account change subscriptions

## Additional Resources

### Required Reading
- [Anchor Book - TypeScript Client](https://www.anchor-lang.com/docs/typescript-client)
- [IDL Specification](https://www.anchor-lang.com/docs/idl-specification)
- [Anchor Errors Reference](https://docs.rs/anchor-lang/latest/anchor_lang/error/enum.ErrorCode.html)

### Supplementary Materials
- [Building Type-Safe Solana Apps](https://www.quicknode.com/guides/solana-development/anchor/typescript-sdk)
- [Anchor Client Best Practices](https://book.anchor-lang.com/anchor_in_depth/milestone_project_tic-tac-toe.html)
- Video: [Deep Dive into Anchor IDLs](https://www.youtube.com/watch?v=example)

### Practice Exercises
1. Build an IDL validator
2. Create a program method tester
3. Implement account migration tool
4. Build an event replay system

## Common Issues and Solutions

### Issue: Provider not initialized
**Solution:** 
- Check wallet connection before creating provider
- Verify publicKey exists on wallet object
- Throw descriptive error if wallet not connected
- Consider showing user-friendly connection prompt

### Issue: Account doesn't exist
**Solution:** 
- Use getAccountInfo to check account existence
- Handle null response appropriately
- Prompt user to initialize account if needed
- Consider implementing automatic initialization flow

### Issue: Type errors with IDL
**Solution:** 
- Use Anchor CLI to parse and generate types
- Specify input IDL file path
- Set output directory for generated types
- Import generated types in your application
- Keep types synchronized with program updates

## Week 6 Quiz Questions

1. What information does an Anchor IDL contain?
2. How does type generation improve development?
3. What's the difference between `.rpc()` and `.transaction()`?
4. How do you handle custom program errors?
5. What are the benefits of PDA derivation patterns?

## Hands-On Challenge

### IDL-Driven UI Generator

Build a tool that:
- Takes any Anchor IDL as input
- Generates UI components for each instruction
- Includes proper form validation
- Handles all account resolution
- Provides transaction simulation

**Advanced Requirements:**
- Support complex argument types
- Auto-detect PDA patterns
- Generate TypeScript interfaces
- Export React components

## Looking Ahead

Next week dives deeper into advanced Anchor patterns. Topics include:
- Complex account fetching and filtering
- PDA management strategies
- Program composability
- Testing with Anchor

Prerequisites include reviewing the Anchor documentation on account fetching and PDAs.