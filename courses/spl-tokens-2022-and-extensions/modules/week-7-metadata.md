# Week 7: Metadata Pointer & On-chain Metadata

## Learning Objectives

- Implement metadata pointer extension for canonical metadata
- Store and manage on-chain metadata directly in mint
- Create dynamic, updateable metadata systems
- Integrate with existing metadata standards

## Topics Covered

- Metadata pointer extension setup and configuration
- TokenMetadata interface implementation
- On-chain vs off-chain metadata strategies
- Metadata update authorities and permissions
- Integration with Metaplex standards
- Custom metadata fields for gaming/DeFi

## Hands-on Exercises

1. **Basic Metadata Setup**: Add name, symbol, and URI to token
2. **Dynamic Metadata**: Implement updateable game asset metadata
3. **Metadata Migration**: Convert existing tokens to use metadata extension

## Reading Assignment

- [Metadata Extension Guide](https://spl.solana.com/token-2022/extensions#metadata)
- Metaplex Token Metadata Standard comparison
- On-chain storage optimization techniques

## Homework

- Build a gaming token with rich metadata:
  - Standard fields (name, symbol, decimals, image)
  - Custom game fields (level, experience, rarity)
  - Achievement/badge system in metadata
  - Metadata versioning system
  - Update mechanism with validation
  - Metadata history tracking
- Create metadata viewer/editor UI
- Implement access control for updates
- Optimize storage costs
- Write migration tool from Metaplex to Token-2022 metadata
