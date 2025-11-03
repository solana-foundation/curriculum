//! # Solana Anchor Counter Program - Finalized Reference
//! 
//! This program demonstrates core Anchor concepts including:
//! - Traditional account initialization and management
//! - Program Derived Addresses (PDAs) with deterministic seeds
//! - Account constraints and validation
//! - Cross-program invocations with the System Program
//! 
//! The program ID below must match the deployed program address in Anchor.toml
//! Anchor automatically generates the IDL (Interface Definition Language) from this code.

use anchor_lang::prelude::*;

// Program ID declaration - this creates a unique identifier for our program
// Must match the deployed program address in Anchor.toml for both localnet and devnet
declare_id!("841TgnQsPTuTihCn22RaBCTgpnAiG4QL3oQLkyrw3L6N");

/// Main program module containing all instruction handlers
/// Each public function becomes an instruction that clients can invoke
#[program]
pub mod counter {
    use super::*;

    /// Initialize a new Counter account with count = 0
    /// 
    /// This instruction creates a new account on-chain and sets its initial state.
    /// The `init` constraint automatically handles account creation via the System Program.
    /// 
    /// # Accounts
    /// - `counter`: New account to be created (payer funds the account creation)
    /// - `payer`: Signer who pays for account creation and rent
    /// - `system_program`: Required for account creation (CPI to System Program)
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Get mutable reference to the counter account
        // ctx.accounts provides type-safe access to all accounts in the instruction
        let counter = &mut ctx.accounts.counter;
        
        // Initialize the count to 0
        counter.count = 0;
        
        Ok(())
    }

    /// Increment the counter by 1 with overflow protection
    /// 
    /// This instruction modifies an existing Counter account.
    /// Uses `checked_add` to prevent integer overflow attacks.
    /// 
    /// # Accounts
    /// - `counter`: Existing account to be modified (must be mutable)
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        // Get mutable reference to the counter account
        let counter = &mut ctx.accounts.counter;
        
        // Increment with overflow protection - panics if overflow occurs
        // In production, consider using `checked_add` with proper error handling
        counter.count = counter.count.checked_add(1).unwrap();
        
        Ok(())
    }

    /// Initialize a new PDA (Program Derived Address) with count = 0
    /// 
    /// PDAs are deterministic addresses derived from seeds and the program ID.
    /// They allow programs to own accounts without requiring a private key.
    /// The seeds ensure the same payer always gets the same PDA address.
    /// 
    /// # Accounts
    /// - `state`: PDA to be created with deterministic seeds
    /// - `payer`: Signer who pays for account creation and provides seed material
    /// - `system_program`: Required for PDA account creation
    pub fn initialize_pda(ctx: Context<InitializePda>) -> Result<()> {
        // Get mutable reference to the PDA state account
        let state = &mut ctx.accounts.state;
        
        // Initialize the count to 0
        state.count = 0;
        
        Ok(())
    }

    /// Update the PDA counter by 1 with overflow protection
    /// 
    /// This instruction modifies an existing PDA account.
    /// The PDA constraints ensure we're operating on the correct account.
    /// 
    /// # Accounts
    /// - `state`: Existing PDA to be modified
    /// - `payer`: Signer who provides seed material for PDA derivation
    pub fn update_pda(ctx: Context<UpdatePda>) -> Result<()> {
        // Get mutable reference to the PDA state account
        let state = &mut ctx.accounts.state;
        
        // Increment with overflow protection
        state.count = state.count.checked_add(1).unwrap();
        
        Ok(())
    }
}

/// Counter account structure for traditional account management
/// 
/// This struct defines the data layout for accounts created with the `init` constraint.
/// Anchor automatically handles serialization/deserialization using Borsh.
/// The 8-byte discriminator is automatically prepended by Anchor.
#[account]
pub struct Counter {
    /// Current count value - stored as 8-byte unsigned integer
    pub count: u64,
}

/// State account structure for PDA-based storage
/// 
/// Identical structure to Counter but used for PDA accounts.
/// Demonstrates that the same data structure can be used for both
/// traditional accounts and PDAs.
#[account]
pub struct State {
    /// Current count value - stored as 8-byte unsigned integer
    pub count: u64,
}

/// Account validation context for the initialize instruction
/// 
/// The `#[derive(Accounts)]` macro generates validation logic that runs
/// before the instruction handler. This ensures all accounts meet the
/// specified constraints.
#[derive(Accounts)]
pub struct Initialize<'info> {
    /// New counter account to be created
    /// 
    /// Constraints:
    /// - `init`: Creates a new account (fails if account already exists)
    /// - `payer = payer`: The payer account pays for account creation
    /// - `space = 8 + 8`: 8 bytes for discriminator + 8 bytes for u64 count
    #[account(init, payer = payer, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    
    /// Account that signs the transaction and pays for account creation
    /// 
    /// Constraints:
    /// - `mut`: Account must be mutable (required for paying rent)
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// System Program required for account creation
    /// 
    /// Anchor automatically validates this is the correct System Program ID
    pub system_program: Program<'info, System>,
}

/// Account validation context for the increment instruction
/// 
/// Simpler context since we're only modifying an existing account.
#[derive(Accounts)]
pub struct Increment<'info> {
    /// Existing counter account to be modified
    /// 
    /// Constraints:
    /// - `mut`: Account must be mutable to allow state changes
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

/// Account validation context for PDA initialization
/// 
/// Demonstrates PDA creation with deterministic seeds and bump validation.
#[derive(Accounts)]
pub struct InitializePda<'info> {
    /// PDA state account to be created
    /// 
    /// Constraints:
    /// - `init`: Creates a new account
    /// - `payer = payer`: Payer funds the account creation
    /// - `space = 8 + 8`: Account size (discriminator + data)
    /// - `seeds = [b"state", payer.key().as_ref()]`: Deterministic seeds
    /// - `bump`: Anchor automatically finds and validates the canonical bump
    #[account(
        init,
        payer = payer,
        space = 8 + 8,
        seeds = [b"state", payer.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,
    
    /// Payer account that provides seed material and funds creation
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// System Program for PDA account creation
    pub system_program: Program<'info, System>,
}

/// Account validation context for PDA updates
/// 
/// Demonstrates PDA access using the same seeds used for creation.
#[derive(Accounts)]
pub struct UpdatePda<'info> {
    /// Existing PDA state account to be modified
    /// 
    /// Constraints:
    /// - `mut`: Account must be mutable
    /// - `seeds = [b"state", payer.key().as_ref()]`: Must match creation seeds
    /// - `bump`: Validates the canonical bump for security
    #[account(
        mut,
        seeds = [b"state", payer.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,
    
    /// Payer account that provides seed material for PDA derivation
    /// 
    /// Note: No `mut` constraint needed since we're not modifying the payer
    pub payer: Signer<'info>,
}
