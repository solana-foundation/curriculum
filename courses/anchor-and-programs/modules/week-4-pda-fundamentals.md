# Week 4: Program Derived Addresses (PDAs) - Fundamentals

## Learning Objectives

- Understand the mathematical foundation of PDA derivation
- Master the collision resistance properties of PDAs
- Implement canonical bump patterns for optimization
- Design deterministic account addressing schemes
- Build basic PDA hierarchies for data organization

## Topics Covered

- PDA derivation mathematics: SHA256 and Ed25519 curve points
- Seeds and bump values: deterministic address generation
- Collision resistance and security guarantees
- Canonical bump discovery and caching strategies
- PDA ownership and signing authority
- Basic PDA patterns: user accounts, configuration storage
- `seeds` and `bump` constraints in account validation

## Hands-on Exercises

1. **Name Registry System**: Build a decentralized name registration service
2. **PDA Explorer**: Create tools to derive and validate PDA addresses
3. **Bump Discovery**: Implement canonical bump finding algorithms
4. **Seed Pattern Design**: Practice different seed combinations for unique addressing
5. **PDA Signing**: Understand how programs sign with PDAs

## Reading Assignment

- [Solana PDA Documentation](https://solana.com/docs/core/pda)

## Homework

- Build a complete name registry with user profiles stored in PDAs
- Implement a simple key-value store using PDAs for deterministic addressing
- Create a user preferences system where each user has a unique PDA
- Experiment with different seed patterns and document their trade-offs

## PDA Fundamentals Checklist

### Mathematical Understanding

- [ ] Ed25519 curve and point validation
- [ ] SHA256 hash function properties
- [ ] Probability of collisions (2^(-125))
- [ ] Canonical bump calculation

### Implementation Patterns

- [ ] Seed selection strategies
- [ ] Bump storage vs calculation
- [ ] PDA as program authority
- [ ] Cross-program PDA usage

### Security Considerations

- [ ] Seed predictability and privacy
- [ ] Authority validation
- [ ] PDA vs keypair trade-offs
- [ ] Collision attack resistance

## Common PDA Patterns

### User Data Storage

```rust
// Seeds: ["user", user_pubkey]
#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    // ...
}
```

### Configuration Accounts

```rust
// Seeds: ["config"]
#[account(
    seeds = [b"config"],
    bump
)]
pub config: Account<'info, ConfigAccount>,
```

## Resources

- [PDA Examples](https://github.com/solana-developers/program-examples/tree/main/basics/program-derived-addresses)
- [Anchor PDA Patterns](https://www.anchor-lang.com/docs/pdas)
- [Solana Cookbook - PDAs](https://solanacookbook.com/core-concepts/pdas.html)
