# Lesson 1: Introduction to Rust, Development Environment, Variables, and Basic Data Types

**Theme:** Establishing the Rust development environment, understanding Cargo, and learning Rust's foundational syntax including variables, mutability, and scalar data types.

## Topics

### 1. Setting up the Rust Development Environment

**Theory to Teach:**

- Installation of Rust using `rustup` on various operating systems (Windows, macOS, Linux).¹ `rustup` manages Rust versions and associated tools.²
- Verifying the installation (`rustc --version`, `cargo --version`).¹
- Introduction to the local offline documentation (`rustup doc`).¹

**Details:**
The installation process typically involves downloading an installer or running a script from the official Rust website.²

- For Windows, this involves `rustup-init.exe` and potentially installing Visual Studio C++ build tools.¹
- For Linux and macOS, a `curl` command is commonly used to download and execute the `rustup` installation script.¹
  Post-installation, configuring the shell's `PATH` environment variable is crucial for accessing Rust tools.¹

### 2. "Hello, World!" Program and `cargo` Introduction

**Theory to Teach:**

- Writing and running a basic "Hello, World!" program.
- Introduction to Cargo, Rust's build system and package manager.²
  - Creating a new project: `cargo new project_name`.²
  - Building the project: `cargo build`.²
  - Running the project: `cargo run`.²
  - Checking the project for errors without producing an executable: `cargo check`.
- Understanding the `Cargo.toml` (manifest file for metadata and dependencies) and `Cargo.lock` (ensuring reproducible builds) files.²
- Adding dependencies from crates.io (e.g., `cargo add some_crate` or manually editing `Cargo.toml`).²

### 3. Variables and Mutability

**Theory to Teach:**

- Declaring variables with `let`.
- Rust's default immutability.⁴
- Using the `mut` keyword to make variables mutable.⁴
- Constants (`const`) and their differences from immutable variables.
- Shadowing variables.

### 4. Basic Data Types (Scalar Types)

**Theory to Teach:**
Rust is a statically-typed language, meaning it must know the types of all variables at compile time. The compiler can usually infer types based on the value and how it's used.

- **Integers:** Signed (`i8`, `i16`, `i32`, `i64`, `i128`, `isize`) and unsigned (`u8`, `u16`, `u32`, `u64`, `u128`, `usize`) types.⁶ Integer literals (decimal, hex, octal, binary, byte).⁶ Integer overflow behavior (debug vs. release builds).
- **Floating-Point Numbers:** `f32` (single-precision) and `f64` (double-precision, the default) types, adhering to IEEE-754 standard.⁶
- **Booleans:** The `bool` type with values `true` and `false`.⁶
- **Characters:** The `char` type representing a single Unicode Scalar Value, denoted by single quotes (e.g., 'a', 'ℤ', '😻').⁶ `char` is 4 bytes in size.

## Resources

- **Primary:** "The Rust Programming Language" (The Book) - Chapters 1, 2, and 3 (Getting Started, Common Programming Concepts, Variables and Mutability, Data Types).³
- **Installation Guides:** Official Rust website (rust-lang.org/tools/install)², dev.to guide.¹
- **Data Type Docs:** dev.to article⁶, MIT docs.⁷
- **Examples:** "Rust by Example" - Primitives, Variable Bindings.⁴
- **Exercises:** Rustlings - `intro`, `variables`, `if` (for boolean usage), `primitive_types`.¹⁰

## Suggested In-Class Activities/Focus

- Guided installation and "Hello, World!" walkthrough.
- Interactive session on `cargo` commands.
- Exercises on variable declaration, mutability, shadowing, and using different scalar types.
- Discussion on Rust's static typing and type inference.

## Elaboration on Core Concepts and Implications

### The Role of Cargo

The role of Cargo extends beyond simple compilation; it standardizes project structure, simplifies dependency management through crates.io, and provides a consistent interface for building, testing, and documenting Rust projects.² This comprehensive tooling is a significant factor in Rust's developer productivity and the growth of its ecosystem. For students, this means a lower barrier to entry for managing complex projects, including the final Solana CLI application, as adding external libraries like `solana-sdk` or `clap` becomes a straightforward process. The `Cargo.lock` file, by ensuring deterministic builds, is particularly important for collaborative projects and for deploying applications reliably.²

### Static Typing

Rust's emphasis on static typing, introduced from the very first interaction with data types, is a fundamental aspect of its design philosophy aimed at catching errors at compile time rather than runtime.⁶ While type inference reduces verbosity, the compiler's strict type checking ensures that operations are performed on compatible types, preventing a large class of common programming errors. This early feedback loop helps developers build more robust applications. For learners, this means adapting to a compiler that is initially perceived as strict but ultimately serves as a powerful assistant in writing correct code. The distinction between various integer types (e.g., `i32` vs. `u32`, `isize` vs. `usize`) also introduces the concept of memory representation and architecture-dependent sizing, which are important in systems programming contexts.

## Further Exploration for Advanced Students

### 1. Delving Deeper into `rustup` and Toolchains:

- **Challenge:** Explore `rustup` commands for managing different Rust toolchains (stable, beta, nightly). Try installing a nightly toolchain and a specific older stable version. Discuss scenarios where managing multiple toolchains is beneficial.
- **Research:** Investigate how `rustup override` works and its use cases for per-project toolchain management.

### 2. Advanced Cargo Features:

- **Challenge:** Create a project with both a library and a binary crate. Explore how `Cargo.toml` workspaces can be used to manage multiple related crates.
- **Research:** Look into Cargo build scripts (`build.rs`). What are they used for? Try creating a simple build script that prints a message during compilation.
- **Exploration:** Investigate conditional compilation features in Rust (e.g., `#[cfg(...)]`) and how they can be used in `Cargo.toml` to manage platform-specific dependencies or features.

### 3. Nuances of Variables and Data Types:

- **Discussion:** Compare Rust's concept of immutability by default and shadowing with variable handling in languages like Python, JavaScript, or C++. What are the trade-offs?
- **Challenge:** Write small programs that intentionally cause integer overflow in both debug and release modes. Analyze the output and explain the difference in behavior.
- **Research:** Explore the `isize` and `usize` types in more detail. Why are they pointer-sized? When would you explicitly choose them over fixed-size integers?
- **Exploration:** Investigate the internal representation of `char` as a Unicode Scalar Value and compare it to character types in other languages (e.g., ASCII vs UTF-8 vs UTF-16 handling).
