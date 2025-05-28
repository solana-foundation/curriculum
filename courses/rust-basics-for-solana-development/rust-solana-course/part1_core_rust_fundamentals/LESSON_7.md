# Lesson 7: Error Handling (`Option`, `Result`, `?`) and Common Collections (`Vec`, `String`, `HashMap`)

**Theme:** Mastering Rust's idiomatic error handling with `Option` and `Result`, and learning to use common standard library collections.

## Topics

### 1. Robust Error Handling

**Theory to Teach:**

- Distinguishing between recoverable errors (use `Result`) and unrecoverable errors (use `panic!`).⁸
- The `#[must_use]` attribute on `Result` encourages handling.²⁸

### 2. The `Option<T>` Enum

**Theory to Teach:**

- Recap `Option` (`Some(T)`, `None`) for values that can be absent.
- Using `match`, `if let` to handle `Option`.
- Methods like `unwrap()`, `expect()`, `unwrap_or()`, `unwrap_or_else()`, `map()`, `ok_or()`.²⁸

### 3. The `Result<T, E>` Enum

**Theory to Teach:**

- `Ok(T)` for success, `Err(E)` for failure.²⁸
- Using `match`, `if let` to handle `Result`.
- Methods like `unwrap()`, `expect()`, `unwrap_or()`, `unwrap_or_else()`, `map()`, `map_err()`, `and_then()`, `or_else()`.²⁸

### 4. Propagating Errors with the `?` Operator

**Theory to Teach:**

- Simplifying error propagation from functions that return `Result`.²⁸
- How `?` works (early return `Err(E.into())` if an error occurs).

### 5. Common Collections (Introduction)

**Theory to Teach:**

- Overview of collections provided by the standard library for storing multiple values.⁸
- **Vectors (`Vec<T>`):** Storing a variable number of values of the same type, stored on the heap. Creating, updating, reading elements. Iterating over vectors. Using `Vec` when a dynamic array is needed.³¹
- **Strings (`String`):** Storing UTF-8 encoded text. Recap from ownership, now in context of collections. Creating, updating, methods for manipulation.
- **Hash Maps (`HashMap<K, V>`):** Storing key-value pairs. Creating, accessing values, updating, iterating. Using `HashMap` for associative data.³¹

## Resources

- **Primary:** "The Rust Programming Language" - Chapter 9 (Error Handling), Chapter 8 (Common Collections).⁸
- **Examples:** "Rust by Example" - Error handling (`Result`, `Option`), `Vec`, `String`, `HashMap`.⁴
- **Error Handling Docs:** `std::result` ²⁸, dev.to article on `Result`.²⁹
- **Collection Docs:** `std::collections` ³¹, Codecademy on collections.³⁰
- **Exercises:** Rustlings - `error_handling`, `option`, `result`, `vecs`, `hashmaps`, `strings`.

## Suggested In-Class Activities/Focus

- Live coding: Refactoring functions to return `Result` instead of panicking. Using `?` for error propagation. Demonstrating `Vec` and `HashMap` operations.
- Exercises: Write a function that reads from a "pretend" source and can fail, returning a `Result`. Implement a word counter using `HashMap`.
- Discussion: `panic!` vs. `Result`. Choosing appropriate collection types.

## Elaboration on Core Concepts and Implications

### Explicit Error Handling

Rust's approach to error handling, centered around the `Option<T>` and `Result<T, E>` enums, enforces explicitness and compile-time consideration of potential failures or absent data.²⁸ `Option<T>` is used when a value might be present (`Some(T)`) or absent (`None`), forcing developers to handle both cases. `Result<T, E>` is used for operations that can succeed (`Ok(T)`) or fail (`Err(E)`), where `E` is an error type providing information about the failure. The `#[must_use]` attribute on `Result` ²⁸ generates a compiler warning if a `Result` is not explicitly handled, discouraging the silent ignoring of potential errors. This contrasts with exception-based systems where errors can propagate unhandled or null pointer issues that often lead to runtime crashes. The `?` operator provides a concise way to propagate errors upwards in a call stack, reducing boilerplate while maintaining clarity about error paths.²⁹ This system contributes significantly to Rust's reputation for reliability.

### Collections and Ownership

When working with collections like `Vec<T>` (dynamic arrays) and `HashMap<K, V>` (key-value stores) ³¹, Rust's ownership and borrowing rules remain paramount. Operations such as adding elements, accessing elements by index (which returns a reference), or iterating over a collection must adhere to these rules. For example, one cannot hold a mutable reference to a vector (e.g., to add elements) while simultaneously holding an immutable reference to one of its elements, as adding elements might cause reallocation and invalidate existing references. Iterating over a collection can be done by immutable reference (`.iter()`), mutable reference (`.iter_mut()`), or by taking ownership of the elements (`.into_iter()`), each having different implications for what can be done with the collection and its elements during or after iteration.³² This interplay reinforces the core memory safety principles of Rust and requires careful attention from the developer.

## Further Exploration for Advanced Students

### 1. Advanced Error Handling:

- **Challenge:** Define custom error types (structs or enums) that implement the `std::error::Error` trait. Refactor a function to return your custom error type.
- **Research:** Explore the `source()` method on the `Error` trait. How is it used for error chaining and providing context?
- **Exploration:** Investigate libraries for more advanced error handling, such as `anyhow` (which will be used in the project) or `thiserror`. How do they simplify error management?

### 2. Collection Performance and Internals:

- **Challenge:** Benchmark the performance of `Vec` vs. `VecDeque` for operations like adding/removing elements at the beginning vs. the end.
- **Research:** How does `HashMap` handle hash collisions? What are the performance characteristics of `HashMap` (average vs. worst-case for lookups, insertions, deletions)?
- **Discussion:** When would you choose `Vec` over an array `[T; N]` and vice-versa? What are the trade-offs regarding flexibility and performance?
- **Exploration:** Look into other standard library collections like `VecDeque`, `LinkedList`, `BTreeMap`, `BTreeSet`, `BinaryHeap`. What are their primary use cases and performance characteristics?

### 3. Combining Collections and Error Handling:

- **Challenge:** Write a function that processes a `Vec` of strings, attempts to parse each string into a number, and collects valid numbers into a new `Vec`, while collecting parsing errors into another `Vec<MyErrorType>`. The function should return a `Result<Vec<i32>, Vec<MyErrorType>>`.
- **Exploration:** How can iterator adaptors like `filter_map` or `flat_map` be used with `Option` and `Result` to process collections and handle potential errors concisely?

## Common Methods Tables

**Table: `Option<T>` Common Methods**
| Method | Description | Example Usage (Conceptual) |
| ------------------ | --------------------------------------------------------------------------- | -------------------------------------- |
| `is_some()` | Returns `true` if the option is a `Some` value. | `if opt.is_some() { ... }` |
| `is_none()` | Returns `true` if the option is a `None` value. | `if opt.is_none() { ... }` |
| `unwrap()` | Returns the value `v` if `Some(v)`, panics if `None`. | `let val = opt.unwrap();` |
| `expect(msg)` | Returns the value `v` if `Some(v)`, panics with `msg` if `None`. | `let val = opt.expect("Value expected");` |
| `unwrap_or(def)` | Returns the value `v` if `Some(v)`, or `def` if `None`. | `let val = opt.unwrap_or(default_val);` |
| `unwrap_or_else(f)`| Returns the value `v` if `Some(v)`, or computes it from `f()` if `None`. | `let val = opt.unwrap_or_else(|| ...);` |
| `map(f)` | Applies function `f` to the contained value (if `Some`), returns `Option<U>`. | `opt.map(|v| v + 1)` |
| `and_then(f)` | Applies function `f` (returning `Option<U>`) to contained value, else `None`.| `opt.and_then(|v| Some(v * 2))` |
| `ok_or(err)` | Transforms `Option<T>` into `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err)`. | `opt.ok_or("Value not found")` |
_Data sourced from ⁸_

**Table: `Result<T, E>` Common Methods**
| Method | Description | Example Usage (Conceptual) |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| `is_ok()` | Returns `true` if the result is `Ok`. | `if res.is_ok() { ... }` |
| `is_err()` | Returns `true` if the result is `Err`. | `if res.is_err() { ... }` |
| `unwrap()` | Returns the value `v` if `Ok(v)`, panics if `Err`. | `let val = res.unwrap();` |
| `expect(msg)` | Returns the value `v` if `Ok(v)`, panics with `msg` if `Err`. | `let val = res.expect("Operation failed");` |
| `unwrap_or(def)` | Returns the value `v` if `Ok(v)`, or `def` if `Err`. | `let val = res.unwrap_or(default_val);` |
| `unwrap_or_else(f)` | Returns the value `v` if `Ok(v)`, or computes it from `f(err)` if `Err(err)`.| `let val = res.unwrap_or_else(|e| ...);` |
| `map(f)` | Applies function `f` to the contained `Ok` value, returns `Result<U, E>`. | `res.map(|v| v.to_string())` |
| `map_err(f)` | Applies function `f` to the contained `Err` value, returns `Result<T, F>`. | `res.map_err(|e| NewError::from(e))` |
| `and_then(f)` | Applies function `f` (returning `Result<U, E>`) to `Ok` value, else `Err`. | `res.and_then(|v| Ok(v + 1))` |
| `or_else(f)` | Applies function `f` (returning `Result<T, F>`) to `Err` value, else `Ok`. | `res.or_else(|e| Ok(backup_value))` |
| `?` operator | Propagates `Err` variant from a function. If `Ok(v)`, evaluates to `v`. | `let val = might_fail()?;` |
_Data sourced from ⁸_
