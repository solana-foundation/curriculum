# Week 6: Anchor Integration Basics

## Overview

This week introduces integrating Anchor programs in web applications. Topics include working with Anchor IDLs, generating TypeScript types, and building type-safe interactions with on-chain programs using the Anchor 1.x TypeScript client (`@anchor-lang/core`, renamed from `@coral-xyz/anchor`) alongside kit plugin clients.

## Learning Objectives

Learning outcomes for this week include:

1. Understand Anchor IDL structure and purpose
2. Set up Anchor client with kit plugin clients
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

1. **IDL Type Definition Structure:**

   - Define TypeScript type for your program IDL including:
     - Version and name metadata
     - Instructions array with:
       - Instruction names
       - Account requirements (mutability, signer status)
       - Argument definitions with types
     - Account type definitions with:
       - Struct fields and their types
       - Field names matching on-chain structure

2. **useAnchorProgram Hook Implementation:**

   Choose the integration path based on the program's client tooling:

   **Preferred — Codama-generated Kit client (no AnchorProvider):**
   - Generate a Codama client from the program IDL (Codama-first codegen)
   - Consume it with the app's kit plugin client — instructions (`get{Name}InstructionAsync()`), account fetchers (`fetch{Account}()`), and PDA helpers (`find{Name}Pda()`) compose directly with `useClient<AppClient>()`
   - Returns null-safe hooks when no wallet is connected

   Example of the full flow with a kit plugin client:

   ```ts
   import { useClient } from '@solana/react';
   import type { AppClient } from '@/app/providers';
   import {
     getInitializeInstructionAsync,
     findDataAccountPda,
     fetchDataAccount,
   } from '@project/clients'; // Codama-generated

   const client = useClient<AppClient>();

   const [dataAccount] = await findDataAccountPda({
     owner, // PDA seed fields come from the IDL, passed as named fields
   });
   const instruction = await getInitializeInstructionAsync({
     dataAccount,
     owner,
     value,
   });
   // The kit wallet client plans, signs, and sends — no legacy provider needed
   const signature = await client.sendTransaction([instruction]);
   const account = await fetchDataAccount(client.rpc, dataAccount);
   ```

   **Alternative — `@anchor-lang/core` (Anchor 1.x TypeScript client):**
   - Anchor 1.x renamed the TS package from `@coral-xyz/anchor` to `@anchor-lang/core`; install `@anchor-lang/core`
   - The 1.x client (exports `Program`, `Idl`, `BN` at the package root) is designed to work alongside Kit code — do not reach for the legacy `AnchorProvider` + web3.js `Connection` wiring from 0.3x-era `@coral-xyz/anchor` examples
   - Boundary note: `@solana/web3-compat` converts instructions/addresses and offers a Kit-backed `Connection`, but provides no kit-wallet-to-`AnchorProvider` bridge — mixing legacy `AnchorProvider` with the kit wallet client is not supported
   - Construct the IDL-typed program instance from the IDL and program address, memoized with `useMemo`, build instructions from it, and send them through the same kit wallet client shown above (`client.sendTransaction([...])`)
   - Returns null when no wallet is connected

3. **IDLExplorer Component:**
   - Build visual IDL explorer that displays:
     - Program metadata (name, version, address)
     - Instructions list with:
       - Instruction names
       - Argument and account counts
       - Visual hierarchy indicators
     - Account types with:
       - Type names
       - Field counts
   - Use proper styling and handle missing data gracefully

**Key Concepts:**

- IDL as contract ABI
- Type generation benefits
- Codama clients vs the Anchor/web3.js compat boundary
- Program instantiation
- Version compatibility

---

### Lesson 2: Calling Program Instructions

**Topics Covered:**

- Calling instructions through Codama-generated Kit clients (`get{Name}InstructionAsync()`, `find{Name}Pda()`, `fetch{Account}()`)
- Calling instructions through `@anchor-lang/core` program instances (IDL-typed)
- Account resolution and PDA derivation patterns
- Sending and confirming transactions with the kit wallet client
- Handling responses and program errors

**Lab Exercise: Program Interaction Implementation**

**Component Setup:**

- Use the program client hook from Lesson 1 (Codama client preferred, `@anchor-lang/core` alternative)
- Manage loading and data states
- Create input interface for user data

**Initialize Account Function:**

- Check program client availability before proceeding
- Set loading state appropriately
- Derive the PDA using the generated helper (named seed fields from the IDL):
  - `findDataAccountPda({ owner: ownerAddress })` (Codama) or the equivalent PDA derivation from the program instance
- Build and send the instruction with the kit wallet client:
  - `getInitializeInstructionAsync({ dataAccount, owner, value }, { programAddress })` (Codama)
  - `await client.sendTransaction([instruction])`
- After transaction:
  - Log transaction signature
  - Fetch created account data with `fetchDataAccount(client.rpc, dataAccount)` (Codama — fetchers take the RPC client first) or the program instance getter
- Handle errors with:
  - Codama/Anchor error parsing (`isProgramError` / coded errors)
  - User-friendly messages
  - Cleanup in `finally` block

**Update Data Function:**

- Derive the PDA the same as initialization
- Build the update instruction and send with the kit wallet client, configuring priority fees/commitment via the RPC plugin rather than legacy RPC options
- Handle errors with a dedicated error handler

**Build Transaction Alternative:**

- Build the instruction object standalone for offline signing or batching
- Compose multiple program instructions into one `client.sendTransaction([...])` call

**Error Handling Helper:**

- Parse program-specific errors:
  - Extract error code and message (Codama `{PROGRAM}_ERROR__{NAME}` constants / Anchor error codes)
  - Log and return structured error object
- Handle unknown errors with fallback messaging

**UI Components:**

- Data input field
- Initialize and Update buttons
- Loading states and disabled conditions
- Integrated error display component

**Key Concepts:**

- Codama instruction builders vs `@anchor-lang/core` program instances
- Account resolution and PDA generation
- Transaction sending via kit wallet clients
- Error handling patterns

---

### Lesson 3: Type Safety and Error Handling

**Topics Covered:**

- Leveraging TypeScript with IDL types
- Custom error handling
- Program event parsing
- Type guards and validation
- Development vs production patterns

**Lab Exercise: Type-Safe Program Client**

1. **Type Extraction Setup:**

- Derive types from the generated client:
  - Codama: decoded account and args types from the generated client's codecs
  - `@anchor-lang/core`: IDL types exported at the package root
- Create program-specific type aliases

2. **TypeSafeProgramClient Class:**

- **Constructor:**
  - Accept a typed program client (Codama Kit client or `@anchor-lang/core` program instance)
- **createUserProfile():**
  - Strongly typed parameters and return value
  - Use TypeScript for argument/account validation
- **getAllProfiles():**
  - Return array of typed profile accounts
  - Use generated `fetchAll{Account}()` fetchers with a discriminator/memcmp filter
- **subscribeToEvents():**
- Register a typed event/account listener via the kit RPC plugin subscriptions
- **parseError():**
  - Extract known program errors (`isProgramError` / coded error constants) or fallback
- **derivePDA():**
  - Reusable PDA helper returning a Kit `Address`

3. **Usage Component:**

- Maintain typed state
- Subscribe to events in `useEffect`
- Fetch and display account data
- Ensure cleanup on unmount

**Key Concepts:**

- Type extraction from generated clients
- Client wrapper pattern
- Type-safe instruction execution
- Event typing and subscription
- Strongly typed error objects

---

## Practical Assignment

### Build an Anchor Program Dashboard

1. **IDL Explorer**

   - Display metadata, instruction arguments, account types, errors

2. **Instruction Builder**

   - Dynamic form via IDL
   - Validate args/accounts
   - Preview transaction

3. **Account Explorer**

   - Query program accounts
   - Filter by type/owner
   - Export and live update

4. **Event Monitor**
   - Event listener
   - Filter/search interface
   - Summary stats

**Requirements:**

- Full TypeScript safety
- Robust error handling
- Responsive UI and empty states
- Data export options

**Bonus Features:**

- Compare IDL versions
- Support multiple programs
- View transaction history
- Subscribe to account changes

---

## Additional Resources

### Required Reading

- [Anchor Book - TypeScript Client](https://www.anchor-lang.com/docs/clients/typescript)
- [IDL Specification](https://docs.rs/anchor-lang-idl-spec)
- [Anchor Errors Reference](https://docs.rs/anchor-lang)

### Practice Exercises

1. Build an IDL validator
2. Create a method tester
3. Implement an account migration tool
4. Build an event replay dashboard

---

## Common Issues and Solutions

### Issue: Provider not initialized

**Solution:**

- Ensure wallet is connected
- Check for valid `publicKey`
- Display error or prompt user
- Lazy load provider only after wallet exists

### Issue: Account doesn’t exist

**Solution:**

- Use `getAccountInfo` before reading
- Return fallback or prompt init
- Auto-create account when appropriate

### Issue: Type errors with IDL

**Solution:**

- Regenerate IDL types with Anchor CLI
- Import generated types
- Sync types with latest on-chain code

---

## Week 6 Quiz Questions

1. What information does an Anchor IDL contain?
2. How does type generation improve developer experience?
3. What’s the difference between sending an instruction directly and building a standalone transaction?
4. How should custom program errors be handled?
5. Why is PDA derivation consistency important?

---

## Hands-On Challenge

### IDL-Driven UI Generator

Build a tool that:

- Accepts any Anchor IDL
- Generates dynamic forms for instructions
- Validates all accounts and arguments
- Simulates transactions
- Supports full account resolution

**Advanced Features:**

- Detect common PDA seeds
- Generate React/TypeScript components
- Support nested types
- Export project scaffolds

---

## Looking Ahead

Next week dives deeper into advanced Anchor patterns. Topics include:

- Complex account fetching and filtering
- PDA management strategies
- Program composability
- Testing with Anchor

**Prerequisite:** Review Anchor docs on account fetching and PDAs.
