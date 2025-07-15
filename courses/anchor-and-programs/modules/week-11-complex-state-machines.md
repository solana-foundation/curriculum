# Week 11: State Machines and Multi-Program Patterns

## Learning Objectives

- Design and implement basic state machines for program logic
- Build simple multi-program communication patterns
- Master state transition validation and error handling
- Implement event-driven program interactions
- Design modular program architectures

## Topics Covered

- State machine fundamentals: states, transitions, and validation
- Multi-step process management with state tracking
- Basic inter-program communication patterns
- Event emission and listening patterns
- Modular program design and separation of concerns
- State persistence and recovery patterns
- Error handling in stateful systems

## Hands-on Exercises

1. **Basic State Machine**: Build a simple order processing system with states
2. **Multi-Program Communication**: Create two programs that interact via events
3. **State Validation**: Implement comprehensive state transition testing
4. **Event System**: Build event-driven communication between accounts
5. **Modular Design**: Separate concerns across multiple program modules

## Reading Assignment

- [Solana Event-Driven dApp Logic](https://instantnodes.io/articles/solana-event-driven-dapp-logic)
- [Revisiting Solana’s Architecture for Accessibility and Decentralization](https://medium.com/@kyodo-tech/revisiting-solanas-architecture-for-accessibility-and-decentralization-36f1df3e7efb)

## Homework

- Implement a simple state machine for a basic process (3-4 states maximum)
- Create two small programs that communicate via a single event type
- Write tests for valid and invalid state transitions
- Build a basic escrow program with three states: Created, Funded, Released
- Document your state machine design choices and transition rules

## State Machine Fundamentals

### Basic State Structure

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum OrderState {
    Created,
    Paid,
    Shipped,
    Delivered,
    Cancelled,
}

#[account]
pub struct Order {
    pub id: u64,
    pub state: OrderState,
    pub amount: u64,
}

impl Order {
    pub fn can_transition_to(&self, new_state: &OrderState) -> bool {
        match (&self.state, new_state) {
            (OrderState::Created, OrderState::Paid) => true,
            (OrderState::Paid, OrderState::Shipped) => true,
            (OrderState::Shipped, OrderState::Delivered) => true,
            _ => false,
        }
    }
}
```

### State Transition Function

```rust
pub fn update_order_state(
    ctx: Context<UpdateOrder>,
    new_state: OrderState,
) -> Result<()> {
    let order = &mut ctx.accounts.order;

    require!(
        order.can_transition_to(&new_state),
        ErrorCode::InvalidStateTransition
    );

    order.state = new_state;
    Ok(())
}
```

## Basic Multi-Program Communication

### Simple Event System

```rust
#[event]
pub struct UserCreated {
    pub user: Pubkey,
    pub name: String,
}

pub fn create_user(ctx: Context<CreateUser>, name: String) -> Result<()> {
    let user = &mut ctx.accounts.user;
    user.name = name.clone();

    emit!(UserCreated {
        user: ctx.accounts.user.key(),
        name,
    });

    Ok(())
}
```

### Basic Cross-Program Call

```rust
pub fn call_other_program(ctx: Context<CallOther>) -> Result<()> {
    let cpi_accounts = other_program::cpi::accounts::CreateUser {
        user: ctx.accounts.user.to_account_info(),
        // ... other accounts
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.other_program.to_account_info(),
        cpi_accounts,
    );

    other_program::cpi::create_user(cpi_ctx, "Alice".to_string())?;
    Ok(())
}
```

## Workflow Engine Implementation

### Workflow Definition

```rust
#[account]
pub struct WorkflowDefinition {
    pub id: u64,
    pub name: String,
    pub version: u32,
    pub steps: Vec<WorkflowStep>,
    pub active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct WorkflowStep {
    pub id: u32,
    pub name: String,
    pub step_type: StepType,
    pub conditions: Vec<Condition>,
    pub actions: Vec<Action>,
    pub next_steps: Vec<u32>,
    pub timeout: Option<i64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum StepType {
    Manual,
    Automatic,
    Approval,
    Timer,
    External,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Condition {
    pub field: String,
    pub operator: ComparisonOperator,
    pub value: ConditionValue,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ConditionValue {
    Number(u64),
    Text(String),
    Boolean(bool),
    Pubkey(Pubkey),
}
```

### Workflow Execution Engine

```rust
#[account]
pub struct WorkflowInstance {
    pub id: u64,
    pub definition_id: u64,
    pub current_step: u32,
    pub state: WorkflowState,
    pub context: WorkflowContext,
    pub step_history: Vec<StepExecution>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct WorkflowContext {
    pub variables: Vec<(String, ContextValue)>,
    pub participants: Vec<Pubkey>,
    pub metadata: Vec<u8>,
}

pub fn execute_workflow_step(
    ctx: Context<ExecuteWorkflowStep>,
    step_id: u32,
    input_data: Vec<u8>
) -> Result<()> {
    let instance = &mut ctx.accounts.workflow_instance;
    let definition = &ctx.accounts.workflow_definition;

    // Find current step definition
    let step = definition.steps
        .iter()
        .find(|s| s.id == step_id)
        .ok_or(ErrorCode::StepNotFound)?;

    // Validate step can be executed
    require!(
        can_execute_step(instance, step)?,
        ErrorCode::StepNotReady
    );

    // Check conditions
    for condition in &step.conditions {
        require!(
            evaluate_condition(condition, &instance.context)?,
            ErrorCode::ConditionNotMet
        );
    }

    // Execute step actions
    for action in &step.actions {
        execute_action(ctx.accounts, action, &mut instance.context)?;
    }

    // Record step execution
    instance.step_history.push(StepExecution {
        step_id,
        executed_at: Clock::get()?.unix_timestamp,
        executed_by: ctx.accounts.executor.key(),
        input_data: input_data.clone(),
        result: StepResult::Success,
    });

    // Determine next step
    let next_step = determine_next_step(step, &instance.context)?;
    if let Some(next) = next_step {
        instance.current_step = next;
    } else {
        instance.state = WorkflowState::Completed;
    }

    instance.updated_at = Clock::get()?.unix_timestamp;

    Ok(())
}
```

## Atomic Operations and Error Handling

### Atomic Multi-Step Operations

```rust
pub fn atomic_multi_step_operation(
    ctx: Context<AtomicOperation>
) -> Result<()> {
    let accounts = ctx.accounts;

    // Step 1: Validate all preconditions
    validate_preconditions(&accounts)?;

    // Step 2: Reserve resources
    let reservations = reserve_resources(&accounts)?;

    // Step 3: Execute operations with rollback capability
    match execute_operations(&accounts) {
        Ok(_) => {
            // Step 4: Commit all changes
            commit_changes(&accounts)?;
            release_reservations(reservations)?;
        },
        Err(e) => {
            // Rollback all changes
            rollback_changes(&accounts)?;
            release_reservations(reservations)?;
            return Err(e);
        }
    }

    Ok(())
}

fn execute_operations(accounts: &AtomicOperation) -> Result<()> {
    // Use checkpoint pattern for rollback capability
    let checkpoint = create_checkpoint(accounts)?;

    // Execute each operation
    operation_1(accounts).map_err(|e| {
        restore_checkpoint(accounts, &checkpoint).ok();
        e
    })?;

    operation_2(accounts).map_err(|e| {
        restore_checkpoint(accounts, &checkpoint).ok();
        e
    })?;

    operation_3(accounts).map_err(|e| {
        restore_checkpoint(accounts, &checkpoint).ok();
        e
    })?;

    Ok(())
}
```

### Recovery and Continuation Patterns

```rust
#[account]
pub struct RecoveryState {
    pub operation_id: u64,
    pub last_successful_step: u32,
    pub recovery_data: Vec<u8>,
    pub attempts: u32,
    pub max_attempts: u32,
    pub next_retry: i64,
}

pub fn recover_failed_operation(
    ctx: Context<RecoverOperation>
) -> Result<()> {
    let recovery = &mut ctx.accounts.recovery_state;

    // Check if recovery is possible
    require!(
        recovery.attempts < recovery.max_attempts,
        ErrorCode::MaxRetriesExceeded
    );

    require!(
        Clock::get()?.unix_timestamp >= recovery.next_retry,
        ErrorCode::RetryTooSoon
    );

    // Continue from last successful step
    let result = continue_operation_from_step(
        ctx.accounts,
        recovery.last_successful_step,
        &recovery.recovery_data
    );

    match result {
        Ok(_) => {
            // Operation completed successfully
            recovery.attempts = 0;
        },
        Err(e) => {
            // Update recovery state for next attempt
            recovery.attempts += 1;
            recovery.next_retry = Clock::get()?.unix_timestamp +
                calculate_backoff_delay(recovery.attempts);

            return Err(e);
        }
    }

    Ok(())
}
```

## Testing Complex State Systems

### State Machine Testing Framework

```javascript
describe("Complex State Machine Tests", () => {
  let stateMachine;

  beforeEach(async () => {
    stateMachine = await setupStateMachine();
  });

  it("should handle all valid state transitions", async () => {
    const validTransitions = [
      ["Created", "InProgress"],
      ["InProgress", "PendingApproval"],
      ["PendingApproval", "Approved"],
      ["Approved", "Completed"],
    ];

    for (const [from, to] of validTransitions) {
      await stateMachine.setState(from);
      await expect(stateMachine.transitionTo(to)).resolves.toBeDefined();
    }
  });

  it("should reject invalid state transitions", async () => {
    const invalidTransitions = [
      ["Created", "Completed"],
      ["InProgress", "Completed"],
      ["Rejected", "Approved"],
    ];

    for (const [from, to] of invalidTransitions) {
      await stateMachine.setState(from);
      await expect(stateMachine.transitionTo(to)).rejects.toThrow();
    }
  });

  it("should handle workflow timeout scenarios", async () => {
    await stateMachine.setState("PendingApproval");

    // Advance time beyond timeout
    await advanceTime(APPROVAL_TIMEOUT + 1);

    // Should automatically transition to timeout state
    const state = await stateMachine.getState();
    expect(state).toBe("TimedOut");
  });
});
```

## Resources
