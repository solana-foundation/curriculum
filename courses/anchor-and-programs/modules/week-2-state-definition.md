# Week 2: State Definition with #[account] and Automatic Serialization

## Learning Objectives

- Master the `#[account]` attribute for defining program state
- Understand automatic discriminators and their role in account identification
- Implement custom serialization and deserialization patterns
- Design efficient data structures for on-chain storage
- Handle account rent and space calculations

## Topics Covered

- `#[account]` attribute deep dive and automatic trait implementations
- Account discriminators: automatic generation and custom values
- Space calculation for accounts and rent exemption requirements
- Data structure design best practices for on-chain storage
- Account initialization patterns and ownership
- Zero-copy deserialization for large data structures

## Hands-on Exercises

1. **Note-Taking Program**: Create a program that stores and manages user notes
2. **Data Structure Design**: Implement various data types (Vec, HashMap equivalents, nested structs)
3. **Space Calculator**: Build a utility to calculate account space requirements
4. **Discriminator Explorer**: Examine how Anchor generates and uses discriminators
5. **Rent Calculation**: Practice calculating minimum balance for rent exemption

## Reading Assignment

- [Solana Account Model](https://solana.com/docs/core/accounts)
- [RareSkills - Anchor Account Types](https://www.rareskills.io/post/anchor-account-types)

## Homework

- Build a complete note-taking program with CRUD operations
- Implement a user profile system with nested data structures
- Create a library program that manages book records with different data types
- Calculate and verify rent requirements for various account sizes

## Key Concepts to Master

- Account space = 8 (discriminator) + data size + padding
- Account ownership and program authority
- Discriminator collision prevention

## Resources

- [Solana Cookbook - Account Model](https://solanacookbook.com/core-concepts/accounts.html)
- [Space Calculation Tools](https://github.com/solana-developers/program-examples)
