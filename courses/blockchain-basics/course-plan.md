# Blockchain and Distributed Systems: Theory & Practice with Solana

## Overview
This course explores blockchain through the lens of **distributed-systems theory**, using **Solana** as a modern case study. We bridge classical concepts (Lamport clocks, FLP impossibility, Paxos/BFT) with contemporary blockchain architectures, emphasizing the foundations that enable decentralized consensus at scale.  
Rather than hands-on smart-contract coding, the focus is on **theory and system-design trade-offs**. Students will analyze consensus algorithms, reason formally about safety / liveness, and evaluate how Solana’s Proof-of-History, Tower BFT, and parallel execution address long-standing challenges. The capstone is a full ledger-design and analysis project.

---

## Learning Objectives
1. Master logical clocks, consensus protocols, fault-tolerance models.  
2. Understand hashes, digital signatures, Merkle trees, ZK-proofs.  
3. Analyze Byzantine Fault Tolerance from PBFT → modern blockchains.  
4. Apply CAP-theorem & consistency-model reasoning to ledgers.  
5. Compare PoW, PoS, and **Solana’s Proof of History**.  
6. Evaluate Solana’s eight architectural innovations.  
7. Prove safety / liveness of consensus with formal methods.  
8. Theorize parallel transaction processing & horizontal scaling.  
9. Design ledgers balancing security, scalability, decentralization.  
10. Think like a systems researcher, not merely an implementer.

---

## Prerequisites
| Area | Background |
|------|------------|
| Algorithms / Data-Structures | Big-O, standard data structures |
| Complexity Theory | P vs NP basics |
| Networking | Latency vs throughput, OSI layers |
| Discrete Math & Probability | Proofs, basic probability |
| Cryptography | Helpful but **not required** |
| Programming | Useful for assignments; not central |

---

## Course Outline (15 Weeks)

<details>
<summary><strong>Expand week-by-week topics</strong></summary>

### Week 1 – Intro to Distributed-Systems Challenges
- Agreement problem; FLP impossibility  
- Centralized coordinators vs decentralized solutions  
- How blockchains re-frame the problem  

### Week 2 – Time & Order
- Physical vs logical clocks  
- Lamport / vector clocks  
- Achieving global ordering in blockchains  

### Week 3 – Failure Models
- Crash vs Byzantine failures  
- Network models: sync / async / partial  
- State-machine replication  

### Week 4 – Cryptographic Foundations I
- Hashes, commitments, digital signatures  
- RSA vs ECDSA vs **Ed25519**  
- Hash chains  

### Week 5 – Cryptographic Foundations II
- Merkle trees & accumulators  
- Zero-knowledge proofs, VRFs  
- Verifiable delay functions → Proof of History  

### Week 6 – Classical Consensus
- Paxos & Raft fundamentals  
- Leader election, atomic broadcast  

### Week 7 – Byzantine Fault Tolerance
- PBFT mechanics, view-changes, optimizations  

### Week 8 – Bitcoin & Nakamoto Consensus
- Probabilistic PoW, longest-chain rule, incentives  

### Week 9 – Bitcoin Limitations
- Throughput / energy trade-offs, selfish mining  

### Week 10 – Alternative Consensus
- PoS variants, DPoS, hybrid models, the trilemma  

### Week 11 – Solana Proof of History
- VDF-based decentralized clock, O(n) messaging  

### Week 12 – Solana Architecture Deep-Dive
- Tower BFT, Turbine, Gulf Stream, Sealevel  

### Week 13 – Performance & Optimization
- Bottlenecks, hardware limits, scaling strategies  

### Week 14 – Security & Formal Verification
- Long-range, eclipse, economic attacks; formal proofs  

### Week 15 – Future Directions & Open Problems
- Interop, privacy, quantum threats, governance  

</details>

---

## Target Audience
Upper-division undergraduates / graduate students and professionals focused on **theoretical foundations & system design** (not application coding).

---

## Assignments

### Weekly Problem Sets (15)
*One focused exercise per week – see original list for details.*

### Theoretical Exercises
1. **Consensus Comparison** – PBFT vs Raft vs Tower BFT message-complexity proof  
2. **CAP Application** – design ledgers optimizing different CAP axes  
3. **Cryptographic Proofs** – security properties of hash-based structures  
4. **Performance Modeling** – throughput bounds across consensus types  

### Major Projects
| Milestone | Description |
|-----------|-------------|
| **Mid-term** | Design a specialized consensus protocol for a constrained scenario (e.g. bank consortium, IoT network, university voting). |
| **Final** | End-to-end ledger design + formal correctness proofs. |

---

## Recommended Readings
- **[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)** — Satoshi Nakamoto  
- **[Time, Clocks, and the Ordering of Events…](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)** — Leslie Lamport  
- **[Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf)** — Castro & Liskov  
- **[Raft: In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf)** — Ongaro & Ousterhout  
- **[Solana: A New Architecture for a High-Performance Blockchain](https://solana.com/solana-whitepaper.pdf)** — Yakovenko  
- **[The Byzantine Generals Problem](https://lamport.azurewebsites.net/pubs/byz.pdf)** — Lamport, Shostak & Pease  
- **[Bitcoin’s Academic Pedigree](https://queue.acm.org/detail.cfm?id=3136559)** — Narayanan & Clark  
- **[SoK: Consensus in the Age of Blockchains](https://arxiv.org/pdf/1711.03936.pdf)** — Bano et al.  

---

## Additional Resources

### Distributed-Systems Visualizations
- **[Raft Visualization](https://raft.github.io/)** — interactive animated Raft demo  
- **[PBFT Simulator](https://github.com/luckydonald/pbft-simulation)** — message-flow visualizer  
- **[Blockchain Demo](https://andersbrownworth.com/blockchain/)** — live Merkle-chain demo  

### Consensus Simulators
- **[TLA+ Spec Examples](https://github.com/tlaplus/Examples)** — formal specs for consensus algorithms  
- **[Tendermint Simulator](https://github.com/tendermint/tendermint)** — Go-based BFT engine  
- **[Bitcoin Network Simulator](https://github.com/arthurgervais/Bitcoin-Simulator)** — C++ discrete-event simulator  

### Formal-Verification Frameworks
- **[TLA+ Tools](https://lamport.azurewebsites.net/tla/tools.html)** — PlusCal, TLC, Apalache  
- **[Coq Proof Assistant](https://coq.inria.fr/)** — interactive theorem proving  
- **[Isabelle/HOL](https://isabelle.in.tum.de/)** — higher-order logic proofs  

### Academic Repositories
- **[Blockchain Papers DB](https://github.com/decrypto-org/blockchain-papers)** — curated research papers  
- **[arXiv Crypto & Security](https://arxiv.org/list/cs.CR/recent)** — recent preprints  
- **[IACR ePrint Archive](https://eprint.iacr.org/)** — cryptography papers  

### Solana Technical Docs
- **[Architecture Docs](https://docs.solanalabs.com/)** — cluster design, PoH, Sealevel  
- **[SPL Program Library](https://github.com/solana-labs/solana-program-library)** — token, governance, name-service programs  
- **[Solana Developer Portal](https://solana.com/developers)** — tutorials & resources  

### Industry Whitepapers
- **[Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)** — formal spec  
- **[Cosmos Whitepaper](https://cosmos.network/resources/whitepaper)** — inter-blockchain communication  
- **[Diem (Libra) Technical Papers](https://developers.diem.com/papers/)** — Move language & consensus  

### Conference Proceedings
- **[IEEE Security & Privacy](https://www.ieee-security.org/TC/SP-Index.html)** — flagship security venue  
- **[USENIX Security](https://www.usenix.org/conferences/byname/108)** — applied security research  
- **[ACM SOSP](https://sosp.org/)** — premier systems conference  

---