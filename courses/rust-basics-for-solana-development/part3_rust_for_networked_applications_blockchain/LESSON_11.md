# Lesson 11: Building Command-Line Interface (CLI) Tools; Interacting with JSON APIs

**Theme:** Developing practical CLI applications in Rust using `clap` for argument parsing, and using `reqwest` for making HTTP requests to JSON APIs.

## Topics

### 1. Building CLI Tools with `clap`

**Theory to Teach:**

- `clap` (Command Line Argument Parser) is a powerful and popular crate for parsing command-line arguments in Rust applications.⁴³
- It allows developers to define the expected arguments, options, flags, and subcommands for their CLI tool.
- `clap` handles parsing the raw command-line input, validating it against the defined structure, and generating help messages.
- **Key features include defining:**
  - Positionals: Arguments whose meaning is determined by their position.⁴³
  - Options: Named arguments preceded by flags (e.g., `--output <FILE>` or `-o <FILE>`).⁴³
  - Flags: Boolean switches or counters (e.g., `--verbose` or `-v`).⁴³
  - Subcommands: Nested commands that allow for organizing complex CLI tools into logical groups of operations.⁴³
- `clap` offers both a builder API (programmatically constructing the argument parser) and a derive API (using procedural macros on structs to define arguments), with the builder API often being a good starting point for understanding its capabilities.⁴³
- Arguments can be marked as required, have default values, and be validated using built-in or custom logic.⁴³
- Parsed arguments are typically accessed through a `Matches` object returned by `clap`.

### 2. Interacting with JSON APIs using `reqwest`

**Theory to Teach:**

- `reqwest` is a convenient, higher-level HTTP client library for Rust, available in both asynchronous (with Tokio) and blocking versions.⁴⁴
- For making GET requests, one can use `reqwest::get(url).await?` for simple cases, or create a `reqwest::Client` for more control and reuse (e.g., for connection pooling).⁴⁴
- POST requests can be made using `client.post(url).body("...").send().await?` or by sending structured data like forms or JSON.⁴⁴
- `reqwest` integrates well with Serde for handling JSON data. The `.json()` method on a `RequestBuilder` can serialize a Rust struct into a JSON request body. Similarly, the `.json::<MyType>()` method on a `Response` can deserialize a JSON response body into a Rust struct.⁴⁴
- Error handling is crucial when dealing with network requests. `reqwest` methods typically return `Result`, so errors (network issues, HTTP error statuses) must be handled appropriately.⁴⁴

### 3. Combining `clap`, `reqwest`, and `serde`

**Theory to Teach:**
A common pattern for CLI tools that interact with web APIs involves:

- Using `clap` to parse command-line arguments (e.g., an ID or search query).
- Using `reqwest` to make an HTTP request to an external JSON API, incorporating the parsed arguments into the request.
- Using `serde` to deserialize the JSON response from the API into Rust data structures.
- Processing and displaying the deserialized data to the user.

## Resources

- **Primary:** `clap` tutorial.⁴³ `reqwest` documentation.⁴⁴
- **Examples:** `clap` examples, `reqwest` examples (from their respective docs/GitHub).
- **Book:** "Command-Line Rust: A Project-Based Primer for Writing Rust CLIs" by Ken Youens-Clark ³ (as a supplementary resource).
- **Exercises:** Custom exercises involving building a simple CLI tool that fetches and displays data from a public JSON API (e.g., a dictionary API, a public data API).

## Suggested In-Class Activities/Focus

- Live coding: Building a basic CLI tool with `clap` that accepts a few arguments and a subcommand.
- Live coding: Using `reqwest` and `serde` to fetch data from a public JSON API (e.g., `https://api.coindesk.com/v1/bpi/currentprice.json`) and print specific fields.
- Exercise: Create a CLI tool that takes a GitHub username as an argument, fetches the user's public repository data from the GitHub API using `reqwest`, deserializes it using `serde`, and displays the repository names.
- Discussion: Principles of good CLI design (usability, clear help messages, error reporting). Strategies for handling API rate limits and network errors gracefully.

## Elaboration on Core Concepts and Implications

### Streamlined CLI Development with `clap`

The `clap` crate significantly streamlines the development of command-line interfaces in Rust by abstracting the complexities of argument parsing, validation, and help message generation.⁴³ Instead of manually iterating through command-line arguments and performing string comparisons, developers can declaratively define their CLI's structure—including positional arguments, options with values, boolean flags, and nested subcommands. `clap` then handles the parsing logic and provides a structured way to access the user-provided values. This not only reduces boilerplate code but also promotes the creation of CLIs that adhere to common conventions, making them more user-friendly. For the final Solana Account Inspector project, `clap` will be instrumental in defining commands like `get-balance <PUBKEY>`.

### Ergonomic API Interaction with `reqwest` and `serde`

The combination of `reqwest` for HTTP communication and `serde` for JSON (de)serialization forms a powerful and ergonomic toolkit for Rust applications that need to interact with web APIs.⁴² `reqwest` simplifies making various types of HTTP requests (GET, POST, etc.), managing headers, and handling responses, supporting both asynchronous and blocking operations. Its seamless integration with `serde`, particularly the ability to directly deserialize a JSON response into a Rust struct (e.g., `response.json::<MyType>().await?`), makes consuming JSON APIs remarkably straightforward. This pairing is directly applicable to the final project, where the application will query the Solana JSON-RPC API. Understanding this pattern is broadly valuable for any Rust developer working with web services.

## Further Exploration for Advanced Students

### 1. Advanced `clap` Usage:

- **Challenge:** Implement a CLI tool with more complex argument dependencies or conflicts using `clap`'s advanced features (e.g., `ArgGroup`, custom validators, value enums for predefined choices).
- **Research:** Explore `clap`'s features for generating shell completions (e.g., for Bash, Zsh, Fish). How can this improve the user experience of your CLI tool?
- **Exploration:** Investigate how to use `clap`'s builder API in conjunction with or as an alternative to the derive API for more dynamic or intricate CLI definitions.
- **Discussion:** Compare `clap` with other argument parsing libraries in Rust (e.g., `argh`, `structopt` - though `structopt` is now merged into `clap` v3+).

### 2. Sophisticated API Interaction with `reqwest`:

- **Challenge:** Build a CLI tool that interacts with an API requiring authentication (e.g., using an API key in headers or OAuth). Securely manage API keys (e.g., via environment variables, not hardcoding).
- **Research:** Explore `reqwest`'s middleware capabilities. How can middleware be used to implement custom logic like request logging, automatic retries, or modifying requests/responses?
- **Exploration:** Investigate streaming responses with `reqwest`. When would you process a response as a stream rather than loading it all into memory? Implement an example that downloads a large file and processes it chunk by chunk.
- **Challenge:** Handle different HTTP status codes gracefully (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 5xx Server Errors) and provide informative error messages to the user.

### 3. Robustness and User Experience in CLI Tools:

- **Challenge:** Add progress indicators to your CLI tool for long-running operations (e.g., using crates like `indicatif`).
- **Research:** Explore best practices for CLI output design. How can you make your tool's output clear, concise, and machine-readable if necessary (e.g., by providing a `--json` output flag)?
- **Exploration:** Implement configuration file support for your CLI tool (e.g., using `serde` with `toml` or `json` to load default settings or API keys).
