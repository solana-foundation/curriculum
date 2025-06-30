# Week 14: Performance Optimization

## Learning Objectives

- Profile Rust applications
- Optimize async code
- Implement caching strategies
- Use connection pooling

## Topics Covered

- Performance profiling tools
- Async optimization patterns
- Caching with dashmap
- Database connection pools
- Benchmarking with criterion

## Hands-on Exercises

1. **Performance Lab**: Profile and optimize
2. **Cache Builder**: LRU cache implementation
3. **Pool Manager**: Connection pool setup

## Reading Assignment

- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
- Async optimization guides

## Homework

- Benchmark improvements using [Criterion.rs](https://github.com/bheisler/criterion.rs):
  - API endpoint response times
  - JSON parsing performance
  - Concurrent request handling
- Profile with [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph) to find bottlenecks
- Implement caching for at least 3 expensive operations
