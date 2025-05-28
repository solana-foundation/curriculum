# Lesson 2: Functions, Control Flow, Comments, and Basic Documentation

**Theme:** Defining and using functions, controlling program execution flow, and understanding Rust's commenting and documentation practices.

## Topics

### 1. Functions

**Theory to Teach:**

- Defining functions with `fn`.¹²
- Function parameters (type annotated) and return types (specified after `->`).¹²
- Statements vs. expressions.
- Functions returning values (last expression in the body or explicit `return` keyword).¹²
- Functions that don't return a value implicitly return the unit type `()`.¹²

### 2. Control Flow

**Theory to Teach:**

- **`if`/`else` Expressions:** Conditional execution. `if`/`else if`/`else` chains. Using `if` as an expression (arms must return compatible types).¹⁴ Braces are always required for blocks.¹⁴
- **Loops:**
  - `loop`: Infinite loop, exited with `break`. Returning values from loops using `break value;`.¹⁴
  - `while`: Conditional loops.¹⁴
  - `for`: Iterating over collections or ranges (e.g., `for i in 0..12`).¹⁴ The `for` loop uses iterators implicitly.¹⁴

### 3. Comments and Documentation

**Theory to Teach:**

- Line comments (`//`) and block comments (`/*...*/`).
- Documentation comments (`///` for items, `//!` for containing modules/crates) written in Markdown.¹³
- Generating HTML documentation with `cargo doc`.²
- Common documentation sections: Examples, Panics, Errors, Safety.¹⁶
- How `rustdoc` tests code examples embedded in documentation.¹⁶

## Resources

- **Primary:** "The Rust Programming Language" - Chapter 3 (Functions, Control Flow, Comments).⁸
- **Examples:** "Rust by Example" - Functions, Flow Control.⁴
- **Documentation Docs:** MIT docs on `rustdoc`.¹⁶
- **Control Flow Docs:** dear-computer.twodee.org ¹⁴, dev.to article.¹⁵
- **Exercises:** Rustlings - `functions`, `if`, `quiz1` (control flow).

## Suggested In-Class Activities/Focus

- Live coding: Implementing functions with different signatures and return types. Demonstrating various loop types and `if`/`else` expressions.
- Writing documentation comments for a simple function and generating docs with `cargo doc`.
- Exercises: FizzBuzz implementation.¹⁵ Write a function that uses `if` as an expression.
- Discussion: The difference between statements and expressions in Rust. Best practices for writing useful documentation.

## Elaboration on Core Concepts and Implications

### Expression-Based Language

Rust's design as an expression-based language significantly influences its control flow constructs.¹⁴ For instance, `if` can be used not just as a statement to conditionally execute code, but also as an expression that evaluates to a value. This allows for more concise and often more readable code, particularly when assigning values based on conditions. Similarly, `loop` expressions can return values using `break value;`, enabling patterns where a loop computes a result and exits. This characteristic encourages a more functional style of programming in certain contexts and can reduce the need for mutable temporary variables.

### Integrated Documentation

The integration of documentation directly into the language and tooling via `rustdoc` and documentation comments (`///`, `//!`) promotes a culture of well-documented code.¹⁶ The ability to embed runnable, tested code examples directly within documentation ¹⁷ ensures that examples remain accurate and up-to-date, serving as both documentation and a form of testing. This is invaluable for library authors and consumers alike, improving the usability and maintainability of Rust crates. For students, learning to write effective documentation comments from the outset instills good software engineering practices.

## Further Exploration for Advanced Students

### 1. Advanced Function Concepts:

- **Challenge:** Implement a recursive function (e.g., factorial or Fibonacci sequence). Discuss potential issues like stack overflow and how to mitigate them (e.g., tail recursion if supported, or iterative approaches).
- **Research:** Explore function pointers in Rust. How are they different from closures? When might you use them?
- **Exploration:** Investigate higher-order functions. Write a function that takes another function as an argument or returns a function.

### 2. Control Flow Nuances:

- **Challenge:** Implement a more complex state machine using `loop` and `match` or `if/else if/else` chains.
- **Research:** Explore the `break` and `continue` keywords with loop labels (e.g., `'outer: loop { ... break 'outer; }`). What are the use cases for labeled breaks and continues?
- **Discussion:** Compare Rust's `match` expression (covered more in Lesson 5, but `if` is an expression too) with `switch` statements in languages like C++ or Java. What are the advantages of Rust's approach regarding exhaustiveness and pattern matching?

### 3. Mastering Documentation:

- **Challenge:** Take a small, existing Rust project (or one of your previous exercises) and write comprehensive `rustdoc` comments for all public items. Generate the HTML documentation and review it.
- **Research:** Explore advanced `rustdoc` features, such as linking between documentation pages, using `#[doc(cfg(...))]` for conditional documentation, and documenting features.
- **Exploration:** Look at the documentation of popular crates on `crates.io`. Identify what makes their documentation effective and try to emulate those practices. Consider how `rustdoc` tests help maintain documentation quality.
