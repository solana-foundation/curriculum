# Blockchain & Distributed Systems with Solana: Teaching Resources

---

## Foundational Academic Papers

- **[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)** — The seminal paper by Satoshi Nakamoto; essential reading for Week 1 on distributed consensus without trusted parties.  
- **[Time, Clocks, and the Ordering of Events in a Distributed System](https://dl.acm.org/doi/10.1145/359545.359563)** — Leslie Lamport’s 1978 classic on logical clocks; directly relevant to Solana’s Proof of History.  
- **[The Byzantine Generals Problem](https://dl.acm.org/doi/10.1145/357172.357176)** — Lamport, Shostak & Pease (1982). Core fault-tolerance theory underlying blockchain consensus.  
- **[Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf)** — Castro & Liskov (1999). Makes BFT practical; groundwork for protocols like Tower BFT.  
- **[In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/)** — Ongaro & Ousterhout (2014). Intuitive alternative to Paxos; great for consensus fundamentals.

---

## Solana Technical Documentation

- **[Solana Whitepaper](https://solana.com/solana-whitepaper.pdf)** — Introduces Proof of History & eight key innovations; read after traditional consensus.  
- **[Solana Docs – Architecture](https://solana.com/docs/core/clusters)** — Continuously updated deep-dive into Solana’s design.  
- **[Tower BFT Specification](https://docs.anza.xyz/implemented-proposals/tower-bft)** — Solana’s optimized PBFT variant; case study in consensus efficiency.

---

## Textbooks & Comprehensive Resources

- [**Mastering Bitcoin (2nd Ed.)**](https://github.com/bitcoinbook/bitcoinbook) — Open-source technical deep dive; ideal pre-Solana reading.  
- **[Bitcoin & Cryptocurrency Technologies](https://bitcoinbook.cs.princeton.edu/)** — *Narayanan et al.* — Free Princeton text on crypto-primitives & economics.  
- **Distributed Systems: Principles & Paradigms** — *Tanenbaum & Van Steen* — Classic DS reference; foundation before blockchain specifics.

---

## University Course Materials
- **[Stanford CS 251: Cryptocurrencies & Blockchain Tech](https://cs251.stanford.edu/)** — Full lectures & assignments.  
- **[MIT 6.5840: Distributed Systems](https://pdos.csail.mit.edu/6.5840/)** — (ex-6.824) Labs in Go; distributed-systems core.  
- **[Berkeley CS 294: Blockchain, Cryptoeconomics, & the Future](https://berkeley-blockchain.github.io/)** — Interdisciplinary syllabus + guest lectures.  
- **[Princeton COS 418: Distributed Systems](https://www.cs.princeton.edu/courses/archive/fall18/cos418/)** — Lecture notes & projects; strong theory base.

---1

## Cryptographic Foundations
- **[A Graduate Course in Applied Cryptography](https://toc.cryptobook.us/)** — *Boneh & Shoup* — Free comprehensive text.  
- **[Zero-Knowledge Proofs: An Illustrated Primer](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/)** — Matthew Green’s accessible intro.  
- **[The Knowledge Complexity of Interactive Proof Systems](https://dl.acm.org/doi/10.1145/22145.22178)** — Goldwasser et al. (1989) — original ZK paper for advanced learners.

---

## Consensus Algorithm Visualizations
- **[Raft Visualization](https://raft.github.io/)** — Interactive demo; simulate failures.  
- **[Blockchain Demo](https://andersbrownworth.com/blockchain/)** — Hands-on hashing & mining visualizer.

---

## Programming Tools & Sandboxes
- **[Solana Playground](https://beta.solpg.io/)** — Browser-based Solana dev; great for demos.  
- **[The Rust Programming Language Book](https://doc.rust-lang.org/book/)** — Official Rust guide; supports Solana-program understanding.  
- **[Anchor Framework Docs](https://book.anchor-lang.com/)** — Simplifies Solana dev; minimizes boilerplate.

---

## Security & Best Practices
- **[SoK: Research Perspectives & Challenges for Bitcoin & Cryptocurrencies](https://www.ieee-security.org/TC/SP2015/papers-archived/6949a104.pdf)** — Bonneau et al. (2015) systematization.  
- **[Solana Security Audits Collection](https://github.com/solana-labs/security-audits)** — Real audit reports; case-study material.  
- **[Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)** — Ethereum-focused but broadly applicable security guidance.

---

## Distributed-Systems Background

- **Designing Data-Intensive Applications** — *Martin Kleppmann* — Modern DS text with excellent CAP coverage.  
- **[Distributed Systems Lecture Notes](https://github.com/ept/dist-sys)** — Kleppmann’s Cambridge slides (LaTeX).  
- **[CAP Theorem Explained](https://www.ibm.com/cloud/learn/cap-theorem)** — IBM Cloud article; clear trade-off discussion.

---

## Performance & Scalability

- **[Solana Performance Proposals](https://github.com/solana-labs/solana/tree/master/docs/src/proposals)** — Real engineering RFCs & benchmarks.  
- [**Blockchain Scalability – arXiv survey**](https://arxiv.org/search/?query=blockchain+scalability&searchtype=all) for up-to-date papers.

---

## Assignment & Project Templates

- **Problem-Set Repo** *(adapted from Stanford/MIT)* — Byzantine scenarios, Merkle proofs, CAP exercises.  
- **Lab Templates** — Simple blockchain, timestamp server, consensus sim.  
- **Solana-Specific Projects** — PoH verification, account-model exploration, perf benchmarking.

---

## Video Lectures & Tutorials
- **[MIT OCW: Blockchain & Money](https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018/)** — Gary Gensler’s full lecture series.  
- **[Solana Breakpoint Talks – YouTube](https://www.youtube.com/c/SolanaFndn)** — Architecture deep dives & ecosystem updates.  
- **Distributed-Systems YouTube Playlists** — MIT, Stanford, Berkeley fundamentals.

---

## Research Paper Collections
- **[Blockchain Papers DB](https://github.com/decrypto-org/blockchain-papers)** — Curated topical list.  
- **[arXiv: Cryptography & Security](https://arxiv.org/list/cs.CR/recent)** — Latest preprints.  
- **[IEEE Xplore – Blockchain](https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=blockchain)** — Peer-reviewed research.

---

## Industry Contacts & Guest Speakers
- **Solana Foundation Education Team** — <mailto:education@solana.com> — guest-lecture coordination & curriculum support.  
- **Solana Validators** — Operational insights & performance deep dives.  
- **Major Ecosystem Projects** — Real-world implementation challenges & career pathways.

---

## Assessment & Grading Resources
- **Rubric Template** — Tech Implementation 40 % · Theory 30 % · Code & Docs 20 % · Innovation 10 %.  
- **Exam-Question Bank** — BFT scenarios, consensus comparisons, crypto applications.  
- **Project Evaluation** — Correctness, performance, security, documentation.

---

## Community Support
- **[Solana Tech Discord](https://discord.gg/solana)** — Academic channel / live Q&A.  
- **[Solana StackExchange](https://solana.stackexchange.com/)** — Technical Q&A knowledge base.  
- **Academic Blockchain Research Network** — University partnerships & conference CFPs.

---

## Supplementary & Advanced Topics
- **MEV & Transaction Ordering** — Research on extractable value; Solana vs Ethereum.  
- **Cross-Chain Communication** — [Wormhole Docs](https://wormholenetwork.com/) & bridge security analyses.  
- **Privacy-Preserving Techniques** — ZK-systems, confidential TXs, regulatory outlook.

---

_Last updated: July 2025 — Compiled for university-level “Blockchain & Distributed Systems with Solana”_
