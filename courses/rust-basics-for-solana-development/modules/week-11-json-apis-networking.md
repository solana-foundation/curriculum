# Week 11: JSON APIs & Networking

## Learning Objectives

- Serialize/deserialize JSON with serde
- Make HTTP requests
- Handle API responses
- Build API clients

## Topics Covered

- Serde derive macros
- JSON handling
- reqwest client
- API error handling
- Response parsing

## Hands-on Exercises

1. **JSON Transform**: Parse and modify JSON
2. **API Consumer**: Fetch external data
3. **Type-safe Client**: Strongly typed API wrapper

## Reading Assignment

- [Serde documentation](https://docs.rs/serde/latest/serde/trait.Serialize.html)
- [RESTful API design principles](https://restfulapi.net/)

## Homework

- Data aggregation from at least 3 different public APIs:
  - Weather API (e.g., OpenWeatherMap)
  - News API (e.g., NewsAPI)
  - Cryptocurrency API (e.g., CoinGecko)
- JSON manipulation exercises:
  - [Serde JSON examples](https://github.com/serde-rs/json#examples): Complete parsing, serializing, and custom deserializer examples
  - [Exercism Rust Track](https://exercism.org/tracks/rust): "JSON Parser" exercise
  - Create custom deserializers for: date formats, nested objects, and enum variants
