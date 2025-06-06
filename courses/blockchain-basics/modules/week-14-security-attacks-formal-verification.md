# Week 14: Security, Attacks, and Formal Verification

## Learning Objectives

- Conduct comprehensive security analysis of blockchain systems
- Understand long-range attacks and prevention mechanisms
- Analyze network-level attack vectors
- Evaluate economic security models and incentives
- Apply formal verification to consensus protocols

## Topics Covered

- Security analysis framework:
  - Threat modeling
  - Attack surfaces
  - Security assumptions
- Attack taxonomy:
  - Consensus attacks
  - Network attacks
  - Economic attacks
  - Implementation bugs
- Long-range attacks:
  - Weak subjectivity
  - Checkpoint mechanisms
  - Solana's solutions
- Network attacks:
  - Eclipse attacks
  - DDoS resistance
  - Partition attacks
- Formal verification:
  - TLA+ specifications
  - Safety and liveness proofs
  - Model checking

## Hands-on Exercises

1. **Attack Simulator**: Implement various attacks on toy blockchains
2. **Formal Specification**: Write TLA+ spec for simple consensus
3. **Economic Modeling**: Calculate attack costs and defender strategies

## Reading Assignment

- **Required**: "Eclipse Attacks on Bitcoin's Peer-to-Peer Network" by Heilman et al.
- **Required**: "Long-Range Attacks: The Achilles' Heel of Proof-of-Stake" by Deirmentzoglou et al.
- **Required**: "Formal Verification of Blockchain Byzantine Fault Tolerance" by Novo et al.
- **Supplementary**: "The Economics of Blockchain Security" by Budish

## Homework

- Security Analysis Project:

  1. Choose a blockchain system
  2. Comprehensive threat model:
     - Asset identification
     - Threat actors
     - Attack vectors
     - Risk assessment
  3. Attack implementation:
     - Pick one attack vector
     - Implement proof-of-concept
     - Measure success rate
     - Propose mitigations
  4. Formal verification:
     - Model core consensus in TLA+
     - Specify safety properties
     - Check with model checker
     - Document invariants

- Research Paper (5-6 pages):
  - "Comparing Security Models: PoW vs PoS vs Solana"
  - Analyze attack costs
  - Evaluate assumptions
  - Consider future threats

## Discussion Questions

1. Can we formally prove blockchain security?
2. How do economic incentives interact with cryptographic security?
3. What new attack vectors do high-performance blockchains introduce?

## Lab Session

**Title**: "Breaking Blockchains"

**Activities**:

- Execute eclipse attack on Bitcoin testnet
- Simulate long-range attack on PoS
- Test network partition scenarios
- Verify protocol properties with TLC

## Attack Deep Dives

### Consensus Attacks

1. **51% Attacks**:

   - Double spending
   - Censorship
   - Chain reorganization

2. **Long-Range Attacks**:

   - Posterior corruption
   - Stake bleeding
   - History revision

3. **Nothing-at-Stake**:
   - Multiple chain voting
   - Costless simulation

### Network Attacks

1. **Eclipse Attacks**:

   - IP exhaustion
   - Routing attacks
   - Peer isolation

2. **DDoS Variants**:

   - Transaction spam
   - State bloat
   - Computational DoS

3. **Partition Attacks**:
   - BGP hijacking
   - Nation-state censorship
   - Submarine cables

### Economic Attacks

1. **MEV Exploitation**:

   - Sandwich attacks
   - Time-bandit attacks
   - Censorship markets

2. **Governance Attacks**:
   - Vote buying
   - Plutocracy
   - Bribing attacks

## Formal Methods

### TLA+ for Consensus

```tla
Init ==
  /\ messages = {}
  /\ height = 0
  /\ round = 0

ConsensusInvariant ==
  /\ SafetyProperty
  /\ LivenessProperty
```

### Property Specification

- Safety: No two honest nodes commit different values
- Liveness: All honest nodes eventually commit
- Agreement: All committed values are valid

### Verification Tools

- TLC model checker
- TLAPS proof system
- Ivy verification
- Coq proof assistant

## Solana-Specific Security

1. **PoH Security**:

   - VDF assumptions
   - ASIC resistance economics
   - Leader prediction attacks

2. **Tower BFT Security**:

   - Vote lockouts
   - Slashing conditions
   - Fork switch penalties

3. **Network Security**:
   - Turbine resilience
   - Gulf Stream DoS protection
   - Validator requirements

## Additional Resources

- [TLA+ Examples](https://github.com/tlaplus/Examples)
- [Attack Cost Calculator](https://www.crypto51.app/)
