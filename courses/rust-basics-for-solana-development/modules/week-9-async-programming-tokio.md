# Week 9: Async Programming with Tokio

## Learning Objectives

- Understand async/await syntax
- Use tokio runtime
- Handle concurrent operations
- Work with futures

## Topics Covered

- async fn and await
- Tokio runtime setup
- Spawning tasks
- Channels and message passing
- Select! macro

## Hands-on Exercises

1. **Async Timer**: Build a concurrent timer system
2. **Task Spawner**: Parallel task execution
3. **Channel Chat**: Message passing example

## Reading Assignment

- Tokio Tutorial (official)
- Async Book: Chapters 1-4

## Homework

- Concurrent file processor that:
  - Reads multiple files simultaneously from a folder.
  - Processes content (word count, line count)
  - Aggregates results
- Complete [Tokio Tutorial](https://tokio.rs/tokio/tutorial) sections:
  - Hello Tokio
  - Spawning
  - Shared State
  - Channels (first part only)
- [Rustlings](https://github.com/rust-lang/rustlings): `threads1-3.rs`, `macros1-4.rs` (7 exercises)
