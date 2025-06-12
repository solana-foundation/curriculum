# Week 2: Time and Order in Distributed Systems

## Learning Objectives

- Understand why computer clocks aren't perfect
- Learn about logical time vs wall-clock time
- See how events are ordered without a global clock
- Connect this to how blockchain orders transactions

## Topics Covered

- Why can't we just use regular clocks?
- Introduction to logical clocks
- Lamport timestamps (simple version)
- How blockchain creates order
- Real-world examples: WhatsApp message ordering

## Reading Assignment

- **Required**: "There is No Now" - distributed systems time explained simply
- **Optional**: Lamport's original paper (just read introduction)

## Hands-on Exercises

1. **Clock Drift Demo**: See how computer clocks get out of sync
2. **Message Ordering**: Build a simple chat with timestamps
3. **Blockchain Preview**: How Bitcoin orders transactions

## Homework

- Implement a basic Lamport clock in any language
- Create a 3-node system where messages arrive out of order
- Write 1 page: "Why does blockchain need its own clock?"

## Lab: "Time in a Distributed World"

- Build a multiplayer game where time matters
- See what happens with network delays
- Fix it using logical clocks
