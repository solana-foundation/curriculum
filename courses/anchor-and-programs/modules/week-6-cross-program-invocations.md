# Week 6: Cross-Program Invocations (CPIs) and SPL Token Integration

## Learning Objectives

- Master Cross-Program Invocation patterns and security considerations
- Integrate with SPL Token program for token operations
- Implement CPI security patterns and account validation
- Handle error propagation across program boundaries
- Build complex multi-program interactions

## Topics Covered

- **CPI fundamentals**: calling other programs from within your program
- **SPL Token program integration**: minting, transferring, burning tokens
- **CPI security patterns:** account validation and authority checking
- **PDA signing in CPIs:** using program-derived addresses as signers
- Error handling and propagation across program boundaries
- Composability patterns and program interaction design
- **Common CPI targets:** System, Token, Associated Token, and custom programs

## Hands-on Exercises

1. **Token Wrapper Program**: Build a program that manages SPL tokens with additional functionality
2. **CPI Security Testing**: Implement and test various CPI security patterns
3. **Multi-Program Flow**: Create a system that coordinates multiple programs
4. **Error Propagation**: Practice handling errors across program boundaries
5. **PDA Authority**: Use PDAs as signing authorities in CPIs

## Reading Assignment

- [SPL Token Documentation](https://spl.solana.com/token)
- [Anchor CPI Guide](https://www.anchor-lang.com/docs/cross-program-invocations)
- [CPI Security Patterns](https://github.com/slowmist/solana-smart-contract-security-best-practices)

## Homework

- Build a token staking program that integrates with SPL Token
- Create a marketplace escrow system using CPIs for token transfers
- Implement a token airdrop program with batch distribution
- Build a wrapped token program with additional metadata
- Test CPI error scenarios and implement proper error handling

## Core CPI Patterns

### Basic Token Transfer CPI

```rust
use anchor_spl::token::{self, Transfer, TokenAccount};

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, amount)
}
```

### PDA Authority CPI

```rust
pub fn transfer_with_pda_authority(ctx: Context<TransferWithPDA>, amount: u64) -> Result<()> {
    let seeds = &[
        b"authority",
        &[ctx.accounts.authority_pda.bump]
    ];
    let signer_seeds = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority_pda.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    token::transfer(cpi_ctx, amount)
}
```

## SPL Token Operations

### Minting Tokens

- `mint_to`: Create new tokens to a token account
- Authority validation and mint account configuration
- Decimal handling and precision considerations

### Token Transfers

- `transfer`: Move tokens between accounts
- `transfer_checked`: Transfer with mint and decimal validation
- Batch transfer patterns and optimization

### Burning Tokens

- `burn`: Destroy tokens from circulation
- `burn_checked`: Burn with validation
- Supply management strategies

## Security Considerations

### Account Validation

- Always verify account ownership in CPIs
- Validate token account mints match expectations
- Check account initialization status
- Verify program IDs for all CPI targets

### Authority Patterns

- Use PDAs as program authorities for automation
- Implement multi-signature patterns for high-value operations
- Validate authority chains in complex hierarchies
- Implement emergency controls and circuit breakers

### Error Handling

- Propagate errors properly across program boundaries
- Implement transaction rollback patterns
- Handle partial success scenarios
- Provide meaningful error messages

## Common CPI Targets

### System Program

- Account creation and rent payment
- Account ownership transfers
- Space allocation and reallocation

### Associated Token Program

- Automatic token account creation
- Standard token account addressing
- Integration with wallet standards

### Custom Programs

- Protocol-specific integrations
- Composable DeFi primitives
- Cross-protocol communication

## Resources

- [SPL Token Examples](https://solana.com/docs/tokens)
- [Anchor CPI Examples](https://github.com/solana-foundation/anchor/tree/master/examples/tutorial)
- [Token Program Guide](https://www.quicknode.com/guides/solana-development/anchor/token-2022)
