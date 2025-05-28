# Lesson 6: Modules, Crates, Packages, Paths, `use`, and `pub`

**Theme:** Organizing code into modules, understanding crates and packages, and controlling visibility with `pub` and the `use` keyword.

## Topics

### 1. Packages and Crates

**Theory to Teach:**

- **Crate:** The smallest unit of compilation in Rust. A crate can be a binary (executable) or a library (reusable code). The crate root (`src/main.rs` for a binary, `src/lib.rs` for a library) is the entry point for the compiler.⁸
- **Package:** A bundle of one or more crates that provides a set of functionality. A package contains a `Cargo.toml` file that describes how to build those crates. A package can contain at most one library crate, but many binary crates.⁸

### 2. Modules and the Module System

**Theory to Teach:**

- Hierarchically splitting code into logical units (modules) to control scope and privacy.⁴
- Defining modules (`mod my_module { ... }`). Modules can be nested.
- Modules can be in the same file or in separate files (`my_module.rs` or `my_module/mod.rs`).

### 3. Paths for Referring to Items in the Module Tree

**Theory to Teach:**

- Absolute paths (starting from `crate`) vs. relative paths (starting from `self`, `super`, or a named module).⁸

### 4. Controlling Privacy with `pub`

**Theory to Teach:**

- By default, all items (functions, structs, enums, modules, constants) in Rust are private to their module.⁸
- Using the `pub` keyword to make an item public and accessible from outside its module.
- `pub` can also be used with structs and enums, and their fields/variants (e.g., `pub struct Point { pub x: i32, y: i32 }`).

### 5. Bringing Paths into Scope with the `use` Keyword

**Theory to Teach:**

- Using `use` to bring items into the current scope, allowing shorter paths to refer to them.⁸
- Idiomatic `use` paths (e.g., bringing the full path to a struct/enum, but only up to the module for functions).
- Using `as` for renaming types or traits on import.
- Using `pub use` to re-export items.
- Nested paths and the `self` and `*` (glob) operators in `use` statements.

## Resources

- **Primary:** "The Rust Programming Language" - Chapter 7 (Managing Growing Projects with Packages, Crates, and Modules).⁸
- **Examples:** "Rust by Example" - Modules, Crates.⁴
- **Exercises:** Rustlings - `modules`.

## Suggested In-Class Activities/Focus

- Live coding: Creating a library crate with multiple modules. Demonstrating `pub` and `use`.
- Refactoring a single-file program into multiple modules.
- Exercises: Design a module structure for a hypothetical application. Fix visibility errors in provided code snippets.
- Discussion: Benefits of modular design. How Rust's module system compares to other languages.

## Elaboration on Core Concepts and Implications

### Code Organization and Encapsulation

Rust's module system provides a robust mechanism for organizing code, managing namespaces, and controlling visibility, which is essential for developing maintainable and scalable projects.⁸ Modules allow developers to group related functionality and define clear boundaries. By default, all items within a module are private, meaning they can only be accessed by code within the same module or its direct children. The `pub` keyword is used to explicitly mark items (functions, structs, enums, etc.) as public, making them part of the module's external API. This principle of "private by default" encourages thoughtful API design and encapsulation.

### Ecosystem and Reusability

The `use` keyword simplifies working with modules by bringing paths into the current scope, avoiding the need for lengthy, fully qualified paths.⁸ This, combined with Cargo's management of crates (compilation units) and packages (collections of crates managed by `Cargo.toml`), forms a powerful system. `crates.io`, the official Rust package registry, integrated with Cargo, facilitates easy discovery, download, and integration of third-party libraries.² This rich ecosystem significantly accelerates development, as developers can leverage a vast collection of well-tested and documented crates for common tasks, a practice that will be vital when using crates like `solana-sdk`, `tokio`, and `clap` in the course project.

## Further Exploration for Advanced Students

### 1. Advanced Module Organization:

- **Challenge:** Design and implement a more complex module structure for a hypothetical larger project. Consider how to organize code for features, utilities, and API layers. Experiment with nested modules and file/directory structures (`mod.rs` vs. `module_name.rs`).
- **Research:** Explore the concept of "visibility and privacy" in Rust more deeply. What are the implications of `pub(crate)`, `pub(super)`, and `pub(in path)`? Provide examples where these specific visibilities are useful.
- **Exploration:** Look into how large open-source Rust projects (e.g., `tokio`, `serde`, `ripgrep`) structure their modules. What patterns can you identify?

### 2. Crate Features and Conditional Compilation:

- **Challenge:** Create a library crate with optional features defined in `Cargo.toml`. Write code that is conditionally compiled based on whether a feature is enabled, using `#[cfg(feature = "my_feature")]`.
- **Research:** How can crate features be used to manage optional dependencies or provide different implementations for different environments (e.g., `std` vs. `no_std`)?
- **Discussion:** Compare Rust's feature system with similar mechanisms in other languages/build systems (e.g., preprocessor directives in C/C++, build profiles in Maven/Gradle).

### 3. Publishing and Versioning Crates (Conceptual):

- **Research:** While not requiring actual publishing, investigate the process of publishing a crate to `crates.io`. What are the requirements and best practices (e.g., API stability, semantic versioning)?
- **Exploration:** Explore the `Cargo.toml` fields related to publishing, such as `license`, `repository`, `documentation`, `keywords`, and `categories`.
- **Discussion:** Why is semantic versioning (SemVer) particularly important in an ecosystem like Rust's with a central package registry?
