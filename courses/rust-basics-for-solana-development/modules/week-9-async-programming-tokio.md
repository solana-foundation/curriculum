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

- **[Tokio Tutorial](https://tokio.rs/tokio/tutorial/async)** (official)
- **[Async Book — Chapters 1 - 4](https://book.async.rs/)**

## Homework

- **Concurrent file processor**  
  - Read multiple files simultaneously from a folder  
  - Process content (word count, line count)  
  - Aggregate results  

- **[Tokio Tutorial](https://tokio.rs/tokio/tutorial)** — complete sections:  
  - [Hello Tokio](https://tokio.rs/tokio/tutorial/hello-tokio)  
  - [Spawning](https://tokio.rs/tokio/tutorial/spawning)  
  - [Shared State](https://tokio.rs/tokio/tutorial/shared-state)  
  - [Channels](https://tokio.rs/tokio/tutorial/channels) *(first part only)*  

- **[Rustlings](https://github.com/rust-lang/rustlings)**  
  - [`threads1 – threads3`](https://github.com/rust-lang/rustlings/tree/main/exercises/20_threads)  
  - [`macros1 – macros4`](https://github.com/rust-lang/rustlings/tree/main/exercises/21_macros) *(7 exercises)*
