# Lesson 5: Structs, Enums, and Pattern Matching

**Theme:** Defining custom data types using structs and enums, and leveraging Rust's powerful pattern matching for control flow and data extraction.

## Topics

### 1. Structs (Structures)

**Theory to Teach:**

- Defining and instantiating structs to group related data.⁶
- Named-field structs.
- Tuple structs (named tuples).
- Unit-like structs (no fields, useful for traits).
- Accessing and modifying struct fields.
- Method syntax: defining methods on structs using `impl` blocks.
- Associated functions (e.g., constructors like `new`).

### 2. Enums (Enumerations)

**Theory to Teach:**

- Defining a type that can be one of several possible variants.⁶
- Enum variants can have different types and amounts of associated data (e.g., `enum Message { Quit, Move { x: i32, y: i32 }, Write(String) }`).²³
- Defining methods on enums using `impl`.

### 3. Pattern Matching with `match`

**Theory to Teach:**

- A powerful control flow construct that compares a value against a series of patterns and executes code based on which pattern matches.⁸
- `match` expressions must be exhaustive (cover all possible cases). The `_` wildcard pattern for all other cases.
- Matching on literals, variables, enum variants, struct fields.
- Destructuring structs and enums within `match` arms to bind parts of their values to variables.
- Multiple patterns with `|`, ranges with `..=`.

### 4. Concise Control Flow with `if let` and `while let`

**Theory to Teach:**

- Less verbose alternatives to `match` when interested in only one pattern and ignoring the rest.⁸
- `if let Some(value) = option_variable { ... }`
- `while let Some(value) = iterator.next() { ... }`

## Resources

- **Primary:** "The Rust Programming Language" - Chapter 5 (Structs), Chapter 6 (Enums and Pattern Matching).⁸
- **Examples:** "Rust by Example" - Custom Types (struct, enum), `match`.⁴
- **Struct/Enum Docs:** MIT docs ²², doc.rust-lang.org/book/ch06-01-defining-an-enum.html.²³
- **Pattern Matching Docs:** doc.rust-lang.org/rust-by-example/flow_control/match.html ²⁴, doc.rust-lang.org/book/ch19-03-pattern-syntax.html.²⁵
- **Exercises:** Rustlings - `structs`, `enums`, `match_statement`, `if_let`.

## Suggested In-Class Activities/Focus

- Live coding: Defining structs and enums for a simple domain (e.g., shapes, web events). Implementing methods.
- Using `match` to handle different enum variants and destructure data.
- Refactoring `match` expressions to `if let` where appropriate.
- Exercises: Define a `Rectangle` struct with methods for area and perimeter. Create an `IpAddr` enum (V4, V6) and use `match` to process IP addresses.
- Discussion: How structs and enums improve code organization and type safety. The power and safety of exhaustive `match` expressions.

## Elaboration on Core Concepts and Implications

### Custom Data Types

Structs and enums are fundamental to creating custom, meaningful data types in Rust, enhancing code organization and type safety.⁶ Structs allow grouping related data fields into a cohesive unit, while enums define a type that can be one of a finite set of variants, each potentially carrying different data. This ability to define rich, domain-specific types is crucial for building complex applications. For example, in the context of the Solana inspector, one might define structs to represent parsed account data or enums for different command types.

### Pattern Matching

Pattern matching, primarily through the `match` keyword, is a powerful and expressive control flow construct in Rust that works seamlessly with enums and structs.²⁴ `match` allows a value to be compared against a sequence of patterns. When a pattern matches, the code associated with that pattern is executed. A key feature of `match` is its exhaustiveness checking: the compiler ensures that all possible cases for the value being matched are handled, preventing bugs caused by unhandled states. This is particularly powerful when matching on enums, as the compiler will force the developer to consider every variant. Patterns can also destructure values, binding parts of a struct or enum variant to variables, making data extraction clean and safe. The `if let` construct provides a more concise syntax for cases where only one pattern is of interest.⁸

## Further Exploration for Advanced Students

### 1. Advanced Struct and Enum Design:

- **Challenge:** Design a system using structs and enums to represent a more complex domain, e.g., a simple inventory system for a game, or a parser for a basic configuration file format. Implement methods that operate on these types.
- **Research:** Explore struct update syntax. When is it useful? What are its limitations regarding ownership?
- **Exploration:** Investigate how enums can be used to create type-safe state machines. Implement a simple state machine (e.g., a traffic light) using an enum and methods to transition between states.

### 2. Mastering Pattern Matching:

- **Challenge:** Write complex `match` expressions that use various pattern features:
  - Matching multiple patterns with `|`.
  - Using `..=` for inclusive ranges.
  - Binding values within patterns using `@` (e.g., `variant @ Some(value)`).
  - Using match guards (`if condition`) to add further conditions to a match arm.
- **Research:** Explore the full range of pattern syntax available in Rust (see "Pattern Syntax" chapter in The Rust Programming Language book).
- **Discussion:** Compare Rust's pattern matching with similar features in other languages (e.g., `switch` with fall-through in C-like languages, pattern matching in functional languages like Haskell or F#). What are the safety and expressiveness benefits of Rust's approach?

### 3. `if let` and `while let` Power Usage:

- **Challenge:** Refactor existing `match` expressions from previous exercises or new code into `if let` or `while let` constructs where appropriate, and vice-versa. Discuss when each form is more readable or suitable.
- **Exploration:** Consider how `if let` can be chained with `&&` and `||` for more complex conditional logic involving `Option` or `Result` types.
- **Research:** How does `while let` work with iterators that produce `Option` or `Result`? (This ties into Lesson 7 and 9).
