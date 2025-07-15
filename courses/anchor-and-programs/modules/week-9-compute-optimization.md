# Week 9: Compute Unit Optimization and Performance Profiling

## Learning Objectives

- Master Solana's compute unit system and optimization strategies
- Implement zero-copy patterns for efficient data handling
- Optimize program performance through profiling and measurement
- Understand transaction size limits and batch operation patterns
- Build performance monitoring and alerting systems

## Topics Covered

- Compute unit fundamentals: allocation, consumption, and limits
- Performance profiling tools and measurement techniques
- Zero-copy deserialization patterns for large data structures
- Transaction size optimization and batch processing strategies
- Memory management and allocation patterns
- Instruction-level optimization techniques
- Stack vs heap usage optimization
- Performance monitoring and continuous optimization

## Hands-on Exercises

1. **Performance Benchmarking**: Profile and optimize a compute-heavy program
2. **Zero-Copy Implementation**: Convert regular accounts to zero-copy patterns
3. **Batch Operations**: Implement efficient batch processing systems
4. **Memory Optimization**: Optimize memory usage and allocation patterns
5. **Monitoring Setup**: Build performance monitoring dashboards

## Reading Assignment

- [Solana Compute Optimization Guide](https://solana.com/developers/guides/advanced/how-to-optimize-compute)
- [Transaction Size Limits](https://www.rareskills.io/post/solana-multiple-transactions)

## Homework

- Build a batch processing system for high-throughput operations
- Document performance optimization techniques and their trade-offs

## Compute Unit Fundamentals

### Understanding Compute Limits

```rust
// Default compute unit limit: 200,000 units per transaction
// Maximum with compute budget: 1,400,000 units

// Monitor compute usage in tests
use solana_program::log::sol_log_compute_units;

pub fn expensive_operation(ctx: Context<ExpensiveOp>) -> Result<()> {
    sol_log_compute_units(); // Log current usage

    // Expensive operations here
    for i in 0..1000 {
        // Heavy computation
    }

    sol_log_compute_units(); // Log usage after operation
    Ok(())
}
```

### Compute Budget Instructions

```javascript
// Set custom compute budget
const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
  units: 400000,
});

const transaction = new Transaction()
  .add(computeBudgetIx)
  .add(programInstruction);
```

## Zero-Copy Optimization Patterns

### Basic Zero-Copy Account

```rust
use anchor_lang::__private::CLOSED_ACCOUNT_DISCRIMINATOR;
use anchor_lang::account;
use anchor_lang::prelude::*;

#[account(zero_copy)]
pub struct LargeDataAccount {
    pub data: [u64; 1000], // Large array stored efficiently
    pub metadata: [u8; 256],
}

// Zero-copy access in instructions
#[derive(Accounts)]
pub struct ProcessLargeData<'info> {
    #[account(mut)]
    pub large_data: AccountLoader<'info, LargeDataAccount>,
}

pub fn process_large_data(ctx: Context<ProcessLargeData>) -> Result<()> {
    let mut data = ctx.accounts.large_data.load_mut()?;

    // Direct memory access - no deserialization cost
    data.data[0] = 42;
    data.metadata[0] = 1;

    Ok(())
}
```

### Zero-Copy Collections

```rust
#[account(zero_copy)]
pub struct ItemCollection {
    pub count: u64,
    pub items: [Item; 100], // Fixed-size array for zero-copy
}

#[zero_copy]
pub struct Item {
    pub id: u64,
    pub value: u64,
    pub active: bool,
}
```

## Performance Optimization Techniques

### Instruction-Level Optimizations

#### Minimize Account Validations

```rust
// Expensive: Multiple validations
#[derive(Accounts)]
pub struct ExpensiveValidation<'info> {
    #[account(
        mut,
        constraint = account.authority == authority.key(),
        constraint = account.status == Status::Active,
        constraint = account.balance >= minimum_balance,
    )]
    pub account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

// Optimized: Single constraint with custom logic
#[derive(Accounts)]
pub struct OptimizedValidation<'info> {
    #[account(
        mut,
        constraint = validate_account(&account, &authority, minimum_balance)?
    )]
    pub account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

fn validate_account(
    account: &UserAccount,
    authority: &Pubkey,
    min_balance: u64
) -> Result<bool> {
    require!(account.authority == *authority, ErrorCode::InvalidAuthority);
    require!(account.status == Status::Active, ErrorCode::InactiveAccount);
    require!(account.balance >= min_balance, ErrorCode::InsufficientBalance);
    Ok(true)
}
```

#### Efficient Data Structures

```rust
// Memory-efficient enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
#[repr(u8)] // Explicit byte representation
pub enum Status {
    Inactive = 0,
    Active = 1,
    Suspended = 2,
}

// Packed structs for better memory layout
#[derive(AnchorSerialize, AnchorDeserialize)]
#[repr(packed)]
pub struct CompactAccount {
    pub status: Status,     // 1 byte
    pub value: u32,         // 4 bytes
    pub timestamp: i64,     // 8 bytes
    // Total: 13 bytes instead of potentially 16+ with padding
}
```

### Batch Processing Patterns

#### Efficient Batch Operations

```rust
#[derive(Accounts)]
pub struct BatchProcess<'info> {
    #[account(mut)]
    pub processor: Account<'info, BatchProcessor>,
    pub authority: Signer<'info>,
    /// CHECK: Validated in instruction logic
    pub remaining_accounts: Vec<AccountInfo<'info>>,
}

pub fn batch_process(
    ctx: Context<BatchProcess>,
    operations: Vec<Operation>
) -> Result<()> {
    // Process multiple operations in single transaction
    for (i, operation) in operations.iter().enumerate() {
        // Validate account at index i
        let account = &ctx.remaining_accounts[i];

        // Process operation efficiently
        process_single_operation(account, operation)?;

        // Check compute budget periodically
        if i % 10 == 0 {
            sol_log_compute_units();
        }
    }

    Ok(())
}
```

### Memory Management

#### Stack vs Heap Optimization

```rust
// Prefer stack allocation for small, fixed-size data
const MAX_ITEMS: usize = 10;

pub fn stack_optimized(items: [u64; MAX_ITEMS]) -> Result<()> {
    // Stack allocation - faster access
    let mut results = [0u64; MAX_ITEMS];

    for i in 0..MAX_ITEMS {
        results[i] = items[i] * 2;
    }

    Ok(())
}

// Use heap allocation sparingly
pub fn heap_when_necessary(items: Vec<u64>) -> Result<()> {
    // Only when size is dynamic or very large
    let results: Vec<u64> = items.iter().map(|&x| x * 2).collect();
    Ok(())
}
```

## Performance Monitoring

### Benchmarking Framework

```javascript
// Performance test suite
describe("Performance Benchmarks", () => {
  const iterations = 100;

  it("should process batch operations efficiently", async () => {
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      await program.methods
        .batchProcess(testOperations)
        .accounts({
          /* accounts */
        })
        .rpc();
    }

    const endTime = Date.now();
    const avgTime = (endTime - startTime) / iterations;

    console.log(`Average execution time: ${avgTime}ms`);
    expect(avgTime).toBeLessThan(100); // Performance threshold
  });
});
```

### Compute Unit Tracking

```rust
use solana_program::log::sol_log_compute_units;

pub fn monitored_function(ctx: Context<MonitoredOp>) -> Result<()> {
    sol_log_compute_units(); // Baseline

    expensive_operation_1()?;
    sol_log_compute_units(); // After op 1

    expensive_operation_2()?;
    sol_log_compute_units(); // After op 2

    Ok(())
}
```

## Transaction Size Optimization

### Instruction Data Minimization

```rust
// Large instruction data - avoid
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct LargeInstruction {
    pub data: [u8; 1024], // Too large for single transaction
}

// Optimized: Use multiple smaller instructions
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct OptimizedInstruction {
    pub chunk_index: u8,
    pub data: [u8; 200], // Smaller chunks
    pub is_final: bool,
}
```

### Account Minimization

```rust
// Use remaining_accounts for dynamic account lists
#[derive(Accounts)]
pub struct OptimizedMultiAccount<'info> {
    pub authority: Signer<'info>,
    /// CHECK: Validated in instruction logic
    pub remaining_accounts: Vec<AccountInfo<'info>>,
}
```

## Advanced Optimization Techniques

### Lookup Tables

```javascript
// Address lookup tables for account compression
const lookupTable = await connection.getAddressLookupTable(tableAddress);

const instruction = await program.methods
  .optimizedInstruction()
  .accounts({
    /* accounts */
  })
  .instruction();

const message = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions: [instruction],
}).compileToV0Message([lookupTable.value]);
```

### Parallel Processing

```rust
// Design for parallel execution when possible
pub fn parallel_friendly_operation(
    ctx: Context<ParallelOp>
) -> Result<()> {
    // Operations that don't conflict with other transactions
    // Can be processed in parallel by validators
    Ok(())
}
```

## Resources

- [Compute Budget Documentation](https://docs.solana.com/developing/programming-model/runtime#compute-budget)
- [Transaction Optimization Guide](https://solana.com/developers/guides/advanced/how-to-optimize-compute)
