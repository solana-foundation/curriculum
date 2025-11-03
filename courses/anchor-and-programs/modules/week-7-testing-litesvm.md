# Week 7: Comprehensive Testing with Litesvm Framework

## Learning Objectives

- Master the Litesvm testing framework for 10x faster test execution
- Implement test-driven development workflows for Anchor programs
- Design comprehensive test suites covering all program functionality
- Use advanced testing patterns including time manipulation and state verification
- Build automated testing pipelines for continuous integration

## Topics Covered

- Litesvm framework setup and configuration
- Test-driven development (TDD) methodology for blockchain programs
- Unit testing vs integration testing strategies
- Time manipulation and clock control in tests
- Account state verification and assertion patterns
- Error testing and failure scenario coverage
- Mock data generation and test fixtures
- Test organization and modular design

## Hands-on Exercises

1. **Comprehensive Test Suite**: Build complete test coverage for a complex program
2. **TDD Practice**: Develop a new program using test-driven development
3. **Time Manipulation**: Test time-sensitive functionality with clock controls
4. **Error Scenario Testing**: Implement tests for all possible error conditions
5. **Test Organization**: Structure tests into logical modules and create reusable utilities

## Reading Assignment

- [Litesvm Documentation](https://www.anchor-lang.com/docs/testing/litesvm)
- [Anchor Testing Framework](https://www.anchor-lang.com/docs/testing)
- [Test-Driven Development Best Practices](https://www.freecodecamp.org/news/test-driven-development-what-it-is-and-what-it-is-not-41fa6bca02a2/)

## Homework

- Convert existing programs to use Litesvm testing framework
- Build a comprehensive test suite with good coverage for a medium-complexity program
- Implement error testing for all custom error types
- Create test utilities and reusable helper functions
- Document testing patterns and common test scenarios
- Practice test-driven development by writing tests before implementing features

## Litesvm Framework Setup

### Installation and Configuration

<!-- UPDATE: version alignment – updated dependency versions to Anchor 0.31.1 and Solana SDK 2.1.0 for October 2025 baseline -->

```toml
# Cargo.toml
[dev-dependencies]
litesvm = "0.2"
anchor-lang = { version = "0.31.1", features = ["dev"] }
solana-sdk = "2.1"
tokio = { version = "1.0", features = ["macros"] }
```

### Basic Test Structure

```rust
use anchor_lang::prelude::*;
use litesvm::LiteSVM;
use solana_sdk::{
    signature::Keypair,
    signer::Signer,
    transaction::Transaction,
};

#[tokio::test]
async fn test_program_initialization() {
    let mut svm = LiteSVM::new();

    // Deploy your program
    let program_keypair = Keypair::new();
    svm.add_program_from_file(program_keypair.pubkey(), "target/deploy/your_program.so");

    // Your test logic here
    let payer = Keypair::new();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();

    // Test program interactions
    assert!(test_passed);
}
```

## Testing Patterns

### State Verification

```rust
use anchor_lang::AccountDeserialize;

#[tokio::test]
async fn test_account_state() {
    let mut svm = LiteSVM::new();
    let program_keypair = Keypair::new();
    svm.add_program_from_file(program_keypair.pubkey(), "target/deploy/your_program.so");

    // Initialize test account
    let user_account = Keypair::new();

    // Execute program instruction
    // ... instruction execution code ...

    // Verify account state
    let account_data = svm.get_account(&user_account.pubkey()).unwrap();
    let user_state = UserAccount::try_deserialize(&mut account_data.data.as_slice()).unwrap();

    assert_eq!(user_state.owner, expected_owner);
    assert_eq!(user_state.balance, expected_balance);
}
```

### Error Testing

```rust
#[tokio::test]
async fn test_expected_failures() {
    let mut svm = LiteSVM::new();
    let program_keypair = Keypair::new();
    svm.add_program_from_file(program_keypair.pubkey(), "target/deploy/your_program.so");

    // Test unauthorized access
    let unauthorized_user = Keypair::new();
    let result = execute_restricted_instruction(&mut svm, &unauthorized_user);

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("Unauthorized"));
}
```

### Time Manipulation

```rust
#[tokio::test]
async fn test_time_sensitive_operations() {
    let mut svm = LiteSVM::new();
    let program_keypair = Keypair::new();
    svm.add_program_from_file(program_keypair.pubkey(), "target/deploy/your_program.so");

    // Set specific timestamp for testing
    let test_timestamp = 1000000000i64;
    svm.set_clock(Clock {
        slot: 100,
        epoch_start_timestamp: test_timestamp,
        epoch: 1,
        leader_schedule_epoch: 1,
        unix_timestamp: test_timestamp,
    });

    // Test time-dependent functionality
    let result = execute_time_locked_instruction(&mut svm);
    assert!(result.is_ok());

    // Advance time and test expiration
    svm.set_clock(Clock {
        slot: 200,
        epoch_start_timestamp: test_timestamp,
        epoch: 1,
        leader_schedule_epoch: 1,
        unix_timestamp: test_timestamp + 86400, // +1 day
    });

    let expired_result = execute_time_locked_instruction(&mut svm);
    assert!(expired_result.is_err());
}
```

## Test Categories

### Unit Tests

- Individual instruction testing
- Account validation testing
- Constraint verification
- Error condition coverage

### Integration Tests

- Multi-instruction workflows
- End-to-end user scenarios
- State transition validation
- Complete user workflows

### Security Tests

- Access control validation
- Authority verification
- Attack vector testing
- Edge case coverage

## Advanced Testing Techniques

### Mock Data Generation

```rust
use rand::Rng;

fn generate_test_user() -> (Keypair, u64, Vec<u8>) {
    let keypair = Keypair::new();
    let initial_balance = rand::thread_rng().gen_range(1000..10000);
    let metadata = vec![1, 2, 3, 4]; // Mock metadata

    (keypair, initial_balance, metadata)
}

#[tokio::test]
async fn test_with_random_data() {
    let mut svm = LiteSVM::new();
    // ... setup ...

    let test_users: Vec<_> = (0..10).map(|_| generate_test_user()).collect();

    for (user_keypair, balance, metadata) in test_users {
        // Test with generated data
        let result = create_user_account(&mut svm, &user_keypair, balance, metadata);
        assert!(result.is_ok());
    }
}
```

### Fixture Management

```rust
struct TestEnvironment {
    svm: LiteSVM,
    program_id: Pubkey,
    users: Vec<Keypair>,
    admin: Keypair,
}

impl TestEnvironment {
    fn new() -> Self {
        let mut svm = LiteSVM::new();
        let program_keypair = Keypair::new();
        svm.add_program_from_file(program_keypair.pubkey(), "target/deploy/your_program.so");

        let admin = Keypair::new();
        svm.airdrop(&admin.pubkey(), 10_000_000_000).unwrap();

        let users: Vec<Keypair> = (0..5).map(|_| {
            let user = Keypair::new();
            svm.airdrop(&user.pubkey(), 1_000_000_000).unwrap();
            user
        }).collect();

        Self {
            svm,
            program_id: program_keypair.pubkey(),
            users,
            admin,
        }
    }

    fn execute_instruction(&mut self, instruction: Instruction, signers: &[&Keypair]) -> Result<(), Box<dyn std::error::Error>> {
        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&self.admin.pubkey()),
            signers,
            self.svm.latest_blockhash(),
        );

        self.svm.send_transaction(transaction)?;
        Ok(())
    }
}
```

### Assertion Helpers

```rust
fn assert_account_exists(svm: &LiteSVM, address: &Pubkey) {
    assert!(svm.get_account(address).is_some(), "Account should exist");
}

fn assert_token_balance_equals(svm: &LiteSVM, token_account: &Pubkey, expected_amount: u64) {
    let account = svm.get_account(token_account).expect("Token account should exist");
    let token_account_data = TokenAccount::unpack(&account.data).expect("Should be valid token account");
    assert_eq!(token_account_data.amount, expected_amount);
}

fn assert_program_error(result: Result<(), Box<dyn std::error::Error>>, expected_error: &str) {
    assert!(result.is_err());
    let error_msg = result.unwrap_err().to_string();
    assert!(error_msg.contains(expected_error), "Expected error '{}', got '{}'", expected_error, error_msg);
}
```

## Test Organization

### Test File Structure

```
tests/
├── unit/
│   ├── instructions/
│   ├── accounts/
│   └── constraints/
├── integration/
│   ├── workflows/
│   └── scenarios/
├── performance/
│   └── benchmarks/
└── utils/
    ├── fixtures.rs
    ├── helpers.rs
    └── assertions.rs
```

### Test Data Management

```rust
// tests/utils/fixtures.rs
pub struct TestFixtures {
    pub admin: Keypair,
    pub users: Vec<Keypair>,
    pub program_id: Pubkey,
}

impl TestFixtures {
    pub fn new() -> Self {
        Self {
            admin: Keypair::new(),
            users: (0..5).map(|_| Keypair::new()).collect(),
            program_id: Pubkey::new_unique(),
        }
    }

    pub fn setup_svm(&self) -> LiteSVM {
        let mut svm = LiteSVM::new();

        // Airdrop to admin and users
        svm.airdrop(&self.admin.pubkey(), 10_000_000_000).unwrap();
        for user in &self.users {
            svm.airdrop(&user.pubkey(), 1_000_000_000).unwrap();
        }

        svm
    }
}
```

### Modular Test Utilities

```rust
// tests/utils/helpers.rs
use litesvm::LiteSVM;
use solana_sdk::{
    instruction::Instruction,
    signature::Keypair,
    signer::Signer,
    transaction::Transaction,
};

pub fn execute_instruction(
    svm: &mut LiteSVM,
    instruction: Instruction,
    payer: &Keypair,
    signers: &[&Keypair],
) -> Result<(), Box<dyn std::error::Error>> {
    let mut all_signers = vec![payer];
    all_signers.extend(signers);

    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &all_signers,
        svm.latest_blockhash(),
    );

    svm.send_transaction(transaction)?;
    Ok(())
}

pub fn create_test_account(svm: &mut LiteSVM, owner: &Pubkey, space: usize) -> Keypair {
    let account = Keypair::new();
    svm.create_account(&account.pubkey(), owner, space as u64, 0);
    account
}
```

## Running Tests

### Local Test Execution

```bash
# Build the program first
anchor build

# Run all tests
cargo test

# Run specific test
cargo test test_user_registration

# Run tests with output
cargo test -- --nocapture

# Run tests in specific module
cargo test integration::
```

### Basic Performance Testing

```rust
use std::time::Instant;

#[tokio::test]
async fn test_instruction_performance() {
    let mut svm = LiteSVM::new();
    let fixtures = TestFixtures::new();
    let mut test_svm = fixtures.setup_svm();

    // Deploy program
    test_svm.add_program_from_file(fixtures.program_id, "target/deploy/your_program.so");

    let start = Instant::now();

    // Execute test instruction
    let user = &fixtures.users[0];
    let instruction = create_test_instruction(&fixtures.program_id, &user.pubkey());
    execute_instruction(&mut test_svm, instruction, &fixtures.admin, &[user])
        .expect("Instruction should execute successfully");

    let duration = start.elapsed();
    println!("Execution time: {:?}", duration);

    // Basic performance assertion
    assert!(duration.as_millis() < 1000, "Should execute within 1 second");
}
```

## Test-Driven Development Workflow

### TDD Cycle with Litesvm

```rust
// 1. Write failing test first
#[tokio::test]
async fn test_user_registration() {
    let mut svm = LiteSVM::new();
    let fixtures = TestFixtures::new();
    let mut test_svm = fixtures.setup_svm();

    // This will fail initially because register_user doesn't exist yet
    let result = register_user(&mut test_svm, &fixtures.users[0], "Alice");
    assert!(result.is_ok());

    // Verify user was registered
    let user_account = get_user_account(&test_svm, &fixtures.users[0].pubkey());
    assert_eq!(user_account.name, "Alice");
}

// 2. Implement minimal code to make test pass
// 3. Refactor and improve
// 4. Repeat cycle
```

### Integration Test Examples

```rust
#[tokio::test]
async fn test_complete_user_workflow() {
    let mut svm = LiteSVM::new();
    let fixtures = TestFixtures::new();
    let mut test_svm = fixtures.setup_svm();

    test_svm.add_program_from_file(fixtures.program_id, "target/deploy/your_program.so");

    let user = &fixtures.users[0];

    // Step 1: Register user
    let register_ix = create_register_instruction(&fixtures.program_id, &user.pubkey(), "Alice");
    execute_instruction(&mut test_svm, register_ix, &fixtures.admin, &[user]).unwrap();

    // Step 2: Deposit funds
    let deposit_ix = create_deposit_instruction(&fixtures.program_id, &user.pubkey(), 1000);
    execute_instruction(&mut test_svm, deposit_ix, &fixtures.admin, &[user]).unwrap();

    // Step 3: Make transaction
    let transfer_ix = create_transfer_instruction(
        &fixtures.program_id,
        &user.pubkey(),
        &fixtures.users[1].pubkey(),
        500,
    );
    execute_instruction(&mut test_svm, transfer_ix, &fixtures.admin, &[user]).unwrap();

    // Verify final state
    let sender_account = get_user_account(&test_svm, &user.pubkey());
    let receiver_account = get_user_account(&test_svm, &fixtures.users[1].pubkey());

    assert_eq!(sender_account.balance, 500);
    assert_eq!(receiver_account.balance, 500);
}
```

## Resources

- [Litesvm Documentation](https://www.anchor-lang.com/docs/testing/litesvm)
- [Anchor Testing Guide](https://www.anchor-lang.com/docs/testing)
- [Rust Testing Documentation](https://doc.rust-lang.org/book/ch11-00-testing.html)
