# Week 3: Instruction Contexts with #[derive(Accounts)] and Constraint Validation

## Learning Objectives

- Master the `#[derive(Accounts)]` attribute for defining instruction contexts
- Implement comprehensive constraint validation using Anchor's built-in constraints
- Understand account validation patterns and security implications
- Build robust access control systems
- Handle instruction data and context validation

## Topics Covered

- `#[derive(Accounts)]` attribute and automatic account validation
- Core constraints: `init`, `mut`, `close`, `payer`, `seeds`, `bump`
- Security constraints: `has_one`, `constraint`, `address`
- Account type specifications and their implications
- Custom constraint expressions and error handling
- Instruction data validation and deserialization
- Context lifetime management and borrowing rules

## Hands-on Exercises

1. **Access Control System**: Build a program with role-based permissions
2. **Constraint Practice**: Implement all major constraint types in various scenarios
3. **Validation Testing**: Create comprehensive tests for constraint violations
4. **Custom Constraints**: Write complex custom constraint expressions
5. **Error Handling**: Practice proper error propagation and custom error types

## Reading Assignment

- [QuickNode - Anchor Constraints Guide](https://www.quicknode.com/guides/solana-development/anchor/how-to-use-constraints-in-anchor)
- [Solana Program Security](https://github.com/Rektoff/Security-Roadmap-for-Solana-applications)
- [RareSkills - Account Validation](https://www.rareskills.io/post/anchor-account-types)

## Homework

- Build a complete access control system with multiple user roles
- Implement a voting system with proper constraint validation
- Create a resource management program with ownership validation
- Build error handling patterns for common validation failures

## Common Constraints Reference

### Account Initialization

- `init` - Creates new accounts with automatic rent exemption
- `init_if_needed` - Conditional initialization for idempotent operations

### Account Modification

- `mut` - Marks accounts as mutable
- `close` - Safely closes accounts and returns rent

### Ownership and Authority

- `has_one` - Validates account relationships
- `address` - Enforces specific account addresses
- `signer` - Requires transaction signature

### Advanced Validation

- `constraint` - Custom boolean expressions
- `realloc` - Dynamic account resizing
- `seeds` and `bump` - PDA validation (preview for next week)

## Security Considerations

- Always validate account ownership before state changes
- Use `constraint` for complex business logic validation
- Implement proper error handling for all validation failures
- Consider attack vectors when designing constraint combinations

## Resources

- [Solana Security Handbook](https://github.com/sannykim/solsec)
- [Constraint Reference](https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html)
- [A Hitchhiker's Guide To Solana Program Security](https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security)
- [Awesome Solana Security](https://github.com/0xMacro/awesome-solana-security)