# Lesson 13: Final Project - Planning, Setup, and Basic CLI Structure

**Theme:** Kicking off the Solana Account Inspector CLI project: planning features, setting up the Rust project with dependencies, and implementing the basic command structure using `clap`.

## Topics

### 1. Project Overview and Feature Planning

**Theory to Teach:**

- The primary goal is to build a command-line tool, `solana_account_inspector`, that allows users to query information about Solana accounts.
- **Core required feature:**
  - `get-balance <PUBKEY>`: Takes a Solana public key as input and displays its SOL balance.
- **Core optional (but highly recommended) feature:**
  - `get-account-info <PUBKEY>`: Takes a Solana public key and displays its detailed information, including owner Pubkey, lamport balance, data length, and executable status.
- **Stretch goals (if time permits):**
  - Parsing and displaying data for specific known account types (e.g., SPL Token accounts, displaying mint and amount).
  - Option to specify RPC endpoint URL and commitment level.

### 2. Project Setup

**Theory to Teach:**

- Initialize a new binary Rust project using `cargo new solana_account_inspector --bin`.
- Navigate into the project directory. The `Cargo.toml` file will need to be updated to include necessary dependencies.
- **Key dependencies include:**
  - `solana-sdk`: For Solana-specific data types like `Pubkey` and `Account`.⁴⁸
  - `solana-client`: For the `RpcClient` to interact with Solana nodes.⁵⁷
  - `tokio`: As an asynchronous runtime, with features like `macros` and `rt-multi-thread` (e.g., `tokio = { version = "1", features = ["full"] }`).³⁹
  - `clap`: For parsing command-line arguments. The version supporting `derive` macros is often convenient (e.g., `clap = { version = "4", features = ["derive"] }`).⁴³
  - `serde`: For deserializing JSON data, particularly if handling complex RPC responses or planning for parsing account data. `serde_json` will be needed for JSON specifically.⁴²
  - `anyhow`: For ergonomic application-level error handling (e.g., `anyhow = "1"`). This crate provides a simple way to propagate and manage different error types.

### 3. CLI Command Structure with `clap`

**Theory to Teach:**

- Design the command-line interface using `clap`. This typically involves defining a main struct or enum that represents the CLI commands and their arguments, often using `clap`'s derive macros.
- **Example structure using `clap` derive:**

  ```rust
  // In main.rs or a cli module
  use clap::Parser;
  use solana_sdk::pubkey::Pubkey;
  use std::str::FromStr;

  #[derive(Parser)]
  #[clap(author, version, about, long_about = None)]
  struct Cli {
      #[clap(subcommand)]
      command: Commands,
  }

  #[derive(clap::Subcommand)]
  enum Commands {
      /// Gets the SOL balance for a given public key
      GetBalance {
          #[clap(value_parser = Pubkey::from_str)]
          pubkey: Pubkey,
      },
      /// Gets detailed information for a given public key
      GetAccountInfo {
          #[clap(value_parser = Pubkey::from_str)]
          pubkey: Pubkey,
      },
  }
  ```

- Input `Pubkey` strings will need to be parsed into `solana_sdk::pubkey::Pubkey` types. `clap` allows specifying a parsing function for arguments, and `Pubkey::from_str` can be used for this.⁴⁸

### 4. Basic Asynchronous Structure with `tokio`

**Theory to Teach:**

- The `main` function will be asynchronous, annotated with `#[tokio::main]`.
- The initial structure will involve parsing CLI arguments using `Cli::parse()`, then matching on the parsed command to dispatch to the appropriate handler function.

  ```rust
  // In main.rs
  // ... (clap structs defined above)

  #[tokio::main]
  async fn main() -> anyhow::Result<()> {
      let cli = Cli::parse();

      match cli.command {
          Commands::GetBalance { pubkey } => {
              // Call handler function for get-balance
              println!("Fetching balance for: {}", pubkey);
              // ... implementation to follow
          }
          Commands::GetAccountInfo { pubkey } => {
              // Call handler function for get-account-info
              println!("Fetching account info for: {}", pubkey);
              // ... implementation to follow
          }
      }
      Ok(())
  }
  ```

## Resources

- **Primary:** `clap` documentation.⁴³ `tokio` documentation.³⁹ `solana-sdk` ⁴⁸ and `solana-client` docs.⁵⁷ `anyhow` crate documentation.
- Course Outline Project Description.

## Suggested In-Class Activities/Focus

- Collaborative discussion on refining the CLI features and command structure.
- Guided walkthrough of `cargo new` and adding the specified dependencies to `Cargo.toml`.
- Live coding session demonstrating the implementation of the basic `clap` argument parsing for the `get-balance <PUBKEY>` command and the `get-account-info <PUBKEY>` command.
- Students begin setting up their projects and implementing the initial CLI structure.

## Elaboration on Core Concepts and Implications

### Project Scaffolding

The initial phase of any software project, including this CLI tool, involves scaffolding: creating the project structure, defining dependencies, and outlining the basic application flow. This process serves as a practical application and reinforcement of earlier lessons covering Rust's tooling (Cargo), module system, and common libraries. Students will directly apply their knowledge of `Cargo.toml` to manage dependencies like `solana-sdk`, `tokio`, and `clap`.⁴⁰ Structuring the application with `clap` for command-line argument parsing provides a tangible example of using external crates to solve common problems, moving from isolated exercises to building a cohesive application.

### Application-Level Error Handling with `anyhow`

For application-level error handling in a CLI tool, where various types of errors can occur (argument parsing errors, network errors, API errors, data conversion errors), using a library like `anyhow` can significantly simplify error management. While `Result<T, E>` and custom error enums are fundamental for library code, `anyhow::Result<T>` (often type-aliased as `Result<T>`) provides a convenient, universal error type (`anyhow::Error`) that can wrap diverse error sources. This allows for the ergonomic use of the `?` operator across different fallible operations without extensive manual `From` trait implementations. `anyhow` also typically captures backtraces, aiding in debugging. Introducing `anyhow` for the project allows students to focus more on the core application logic while still maintaining robust error handling, a common and practical approach in many Rust applications.
