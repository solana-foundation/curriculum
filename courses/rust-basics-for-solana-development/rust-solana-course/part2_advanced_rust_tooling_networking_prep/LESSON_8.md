# Lesson 8: Generics and Traits

**Theme:** Writing flexible and reusable code with generics, and defining shared behavior with traits.

## Topics

### 1. Generics (`<T>`)

**Theory to Teach:**

- Generics are a mechanism for abstracting over concrete types, allowing the creation of functions, structs, enums, and methods that can operate on a variety of different data types without code duplication.⁸
- This is achieved by using type parameters, conventionally denoted by single uppercase letters like `T`, `U`, `V`, enclosed in angle brackets (e.g., `fn func_name<T>(param: T) -> T { ... }`).³⁴
- The `<T>` after the function name declares `T` as a generic type parameter for the compiler.³⁴
- Generics can be used in function definitions, struct definitions (e.g., `struct Point<T> { x: T, y: T }`), enum definitions, and method definitions.

### 2. Traits: Defining Shared Behavior

**Theory to Teach:**

- A trait defines a set of method signatures that describe a particular behavior or capability a type can possess.⁸ Traits are similar to interfaces in other languages but offer more flexibility.
- Defining a trait involves using the `trait` keyword followed by the trait name and a block of method signatures (e.g., `trait Summary { fn summarize(&self) -> String; }`).³⁶
- A type implements a trait using an `impl TraitName for TypeName { ... }` block, providing concrete implementations for the required methods.³⁶
- Traits can also provide default implementations for some or all of their methods, which implementing types can use or override.
- Functions can accept parameters that are generic over any type implementing a specific trait, using either `impl Trait` syntax (e.g., `fn notify(item: &impl Summary)`) or the more verbose trait bound syntax (e.g., `fn notify<T: Summary>(item: &T)`).
- Functions can also return values that are specified only by the trait they implement.

### 3. Trait Bounds

**Theory to Teach:**

- Trait bounds are used to constrain generic type parameters, ensuring that the generic type implements one or more specific traits.³⁴ This allows the generic code to use methods from those traits.
- For example, `fn print_item<T: Display>(item: T)` ensures that `item` can be printed using the `{}` formatter.
- Multiple trait bounds can be specified using `+` (e.g., `<T: Display + Debug>`).
- The `where` clause can be used for more complex or numerous trait bounds to improve readability: `fn some_function<T, U>(t: &T, u: &U) -> i32 where T: Display + Clone, U: Clone + Debug { ... }`.³⁴

### 4. Common Standard Library Traits

**Theory to Teach:**
A brief introduction to frequently encountered traits from the standard library:

- `Debug`: For formatter `{:?}`.
- `Display`: For formatter `{}`.
- `Clone`: For explicitly creating a deep copy of a value.
- `Copy`: For types whose values can be duplicated by a simple bitwise copy (stack-only data).
- `PartialEq`, `Eq`: For equality comparisons (`==`, `!=`).
- `PartialOrd`, `Ord`: For ordering comparisons (`<`, `>`, etc.).
- `Default`: For creating a default value for a type.
- `From`, `Into`: For type conversions.
- `ToString`: For converting a value to a `String`.

### 5. Derivable Traits

**Theory to Teach:**

- Rust provides the `#[derive(...)]` attribute to automatically generate implementations for certain common traits like `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, and `Default` if all fields of the struct/enum also implement them. This reduces boilerplate code.

## Resources

- **Primary:** "The Rust Programming Language" - Chapter 10 (Generic Types, Traits, and Lifetimes).⁸
- **Examples:** "Rust by Example" - Generics, Traits.⁴
- **Generics Docs:** easy_rust ³⁴, Codecademy.³⁵
- **Trait Docs:** MIT docs ³⁶, doc.rust-lang.org/std/keyword.trait.html.³⁷
- **Exercises:** Rustlings - `generics`, `traits`.

## Suggested In-Class Activities/Focus

- Live coding: Refactoring a function operating on `i32` to be generic over any numeric type satisfying `Add` and `Copy`. Defining a `Printable` trait and implementing it for custom structs. Using trait bounds to constrain a generic function.
- Exercises: Write a generic function `largest<T: PartialOrd + Copy>(list: &[T]) -> T`. Define a `Summarizable` trait with a `summary()` method and implement it for different structs (e.g., `NewsArticle`, `Tweet`).
- Discussion: How generics and traits promote code reuse and enable polymorphism. The convenience and power of the `#[derive]` attribute for common traits.

## Elaboration on Core Concepts and Implications

### Polymorphism and Abstraction with Traits

Traits serve as the cornerstone of Rust's approach to polymorphism and abstraction.³⁵ Unlike classical object-oriented inheritance, Rust uses traits to define shared behavior that different types can implement. A type that implements a trait can be treated abstractly as that trait, allowing generic functions or collections to operate on diverse types that share the required functionality. This enables developers to build highly flexible and decoupled systems. For instance, the standard library's `Iterator` trait defines how sequences can be iterated, and numerous types implement this trait, allowing them all to be used with a common set of iterator adaptors. This system is fundamental to understanding both the Rust standard library and the broader ecosystem of third-party crates. Furthermore, the combination of generics and traits underpins Rust's "zero-cost abstractions," where high-level, abstract code can be compiled down to highly efficient, specialized machine code, ensuring that abstraction does not come at a performance penalty.

### Compile-Time Contracts with Trait Bounds

Trait bounds act as compile-time contracts for generic code.³⁴ When a generic function or type is defined with trait bounds on its type parameters (e.g., `fn process<T: Display>(item: T)`), the compiler verifies that any concrete type used in place of `T` actually implements the `Display` trait. If this contract is not met, a compile-time error occurs. This ensures that the generic code can safely call methods defined by the bounded traits, as their presence is guaranteed. This compile-time enforcement makes generic code robust and reliable, preventing runtime errors that might occur in dynamically typed languages or systems with less stringent type checking. This characteristic is a key contributor to the "if it compiles, it often just works" experience reported by many Rust developers and is vital for building large, dependable software systems.

## Further Exploration for Advanced Students

### 1. Advanced Generics and Type Systems:

- **Challenge:** Implement a generic data structure, like a linked list or a binary search tree, using generics for the stored data type. Ensure it correctly handles ownership and borrowing.
- **Research:** Explore associated types in traits versus generic type parameters on traits. What are the differences, and when would you choose one over the other? (e.g., `trait Iterator { type Item; ... }` vs. `trait MyTrait<T> { ... }`).
- **Exploration:** Investigate higher-kinded types (HKTs). While Rust doesn't directly support HKTs in the same way as languages like Haskell, explore crates or patterns that emulate HKT-like behavior (e.g., for monads or functors).
- **Discussion:** Compare Rust's generics and traits system with polymorphism mechanisms in other languages (e.g., C++ templates, Java generics/interfaces, Python duck typing).

### 2. Deeper Dive into Traits:

- **Challenge:** Define a trait with associated functions and default method implementations. Then, create multiple types that implement this trait, some overriding the default methods.
- **Research:** Explore "trait objects" (`dyn Trait`). How do they enable dynamic dispatch? What are the performance implications compared to static dispatch with generics? What are the limitations of trait objects (e.g., object safety)?
- **Exploration:** Investigate supertraits (e.g., `trait MySubTrait: MySuperTrait { ... }`). How are they used to build hierarchies of behavior?
- **Challenge:** Implement a blanket implementation for a trait (e.g., `impl<T: Display> MyToString for T { ... }`).

### 3. Trait Bounds and `where` Clauses:

- **Challenge:** Write functions with complex trait bounds using multiple traits, and potentially lifetimes, using `where` clauses for clarity.
- **Research:** What is the `Sized` trait, and why is it a default bound for generic type parameters? How can you opt-out using `?Sized`? When is this necessary (e.g., for working with `str` or custom DSTs - Dynamically Sized Types)?
- **Exploration:** Explore conditional trait implementations: `impl<T: SomeTrait> AnotherTrait for MyType<T> { ... }`.
