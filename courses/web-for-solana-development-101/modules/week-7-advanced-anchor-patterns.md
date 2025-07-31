# Week 7: Advanced Anchor Patterns

## Overview

This week explores advanced patterns for working with Anchor programs in web applications. Topics include PDA management, complex account queries, optimistic updates, and caching strategies for building production-ready features.

## Learning Objectives

Learning outcomes for this week include:

1. Implement advanced PDA derivation and management
2. Build efficient account querying and filtering systems
3. Create optimistic UI updates with proper rollback
4. Implement caching strategies with React Query
5. Handle complex program interactions and error recovery

## Lessons

### Lesson 1: Advanced PDA Management

**Topics Covered:**
- PDA derivation patterns and best practices
- Managing multiple PDA hierarchies
- PDA versioning strategies
- Canonical bumps and optimization
- PDA discovery and enumeration

**Lab Exercise: Advanced PDA Management**

**PDAManager Class Implementation:**

1. **Constructor and Setup:**
   - Accept Anchor program and wallet public key
   - Store as private properties for internal use

2. **Core PDA Derivation Methods:**
   - **getUserProfilePDA**: Derive profile PDA using 'user-profile' seed and wallet
   - **getUserPostPDA**: Create nested PDA hierarchy:
     - First derive profile PDA
     - Use profile PDA as seed for post PDAs
     - Include post ID as additional seed
   - **batchDerivePDAs**: Optimize multiple derivations:
     - Accept array of seed arrays
     - Use Promise.all for parallel processing
     - Return array of PDA/bump pairs

3. **PDA Discovery Method:**
   - Fetch user profile to get metadata (post count)
   - Derive all related PDAs based on metadata:
     - Generate array of post IDs
     - Batch derive all post PDAs
     - Derive settings PDA using profile as seed
   - Return organized structure of all PDAs

**usePDAManager Hook:**
- Use useMemo for efficient instantiation
- Check for program and wallet availability
- Return null if dependencies missing
- Memoize based on program and wallet changes

**PDAExplorer Component:**
- Manage state for PDAs and loading
- Implement exploration functionality:
  - Discover all user PDAs using manager
  - Check existence with fetchNullable
  - Organize results by type
  - Handle errors gracefully
- Display UI with:
  - Explore button with loading state
  - PDA cards for each type
  - Grid layout for multiple posts
  - Proper state management

**Key Concepts:**
- Hierarchical PDA structures
- Batch derivation for performance
- PDA existence checking
- Discovery patterns
- Canonical bump usage

### Lesson 2: Complex Account Queries and Filtering

**Topics Covered:**
- Advanced account filtering with memcmp
- Pagination strategies for large datasets
- Building account indexes
- Efficient data fetching patterns
- Real-time account monitoring

**Lab Exercise: Complex Account Queries and Filtering**

**AccountQueryBuilder Class:**

1. **Class Structure:**
   - Store filters array and pagination limit
   - Accept program and account type in constructor
   - Implement fluent interface pattern (return this)

2. **Filter Methods:**
   - **whereOwner**: Add memcmp filter at offset 8 (after discriminator)
   - **whereField**: Generic field filtering with custom offset
   - **whereSize**: Filter by account data size
   - **withLimit**: Set pagination limit

3. **Execution Methods:**
   - **execute**: Run query with accumulated filters
   - **executePaginated**: 
     - Add pagination filter if before parameter provided
     - Fetch all matching accounts
     - Slice results based on limit
     - Return items with hasMore flag

**usePaginatedAccounts Hook:**
- Use React Query's useInfiniteQuery
- Configure with:
  - Dynamic query key based on filters
  - Query function that builds and executes query
  - Next page parameter extraction
  - Enable condition based on program availability

**AdvancedAccountExplorer Component:**

1. **Filter Implementation:**
   - Manage filter type state
   - Apply filters based on selection:
     - 'owned': Filter by wallet owner
     - 'recent': Filter by timestamp field
     - 'all': No additional filters
   - Set appropriate page limit

2. **Real-time Updates:**
   - Set up account subscription in useEffect
   - Subscribe to changes with commitment level
   - Invalidate queries on changes
   - Clean up subscription on unmount

3. **UI Components:**
   - Filter toggle buttons with active state
   - Loading state handling
   - Paginated results display
   - Load more functionality
   - Proper key management for lists

**Key Concepts:**
- Memcmp filter construction
- Pagination patterns
- Query builder pattern
- Real-time subscriptions
- Performance optimization

### Lesson 3: Optimistic Updates and Caching

**Topics Covered:**
- Implementing optimistic UI updates
- Cache management with React Query
- Handling rollbacks on failure
- Conflict resolution strategies
- Offline support patterns

**Lab Exercise: Optimistic Updates and Caching**

**useOptimisticMutation Hook:**

1. **Hook Structure:**
   - Accept mutation function and options
   - Use React Query's useMutation internally
   - Configure optimistic update lifecycle

2. **Mutation Lifecycle:**
   - **onMutate**: 
     - Cancel in-flight queries
     - Snapshot current data
     - Apply optimistic update
     - Return context for rollback
   - **onError**:
     - Restore previous data from context
     - Call custom rollback handler
     - Show error notification
   - **onSettled**:
     - Invalidate queries to ensure fresh data

**OptimisticPostEditor Component:**

1. **Post Creation with Optimistic Updates:**
   - Query existing posts
   - Implement create mutation with:
     - PDA derivation based on post count
     - Program method call
     - Optimistic data addition with temp ID
     - Proper error handling

2. **Post Updates with Conflict Resolution:**
   - Fetch latest version before update
   - Compare local and remote versions
   - Implement conflict resolution:
     - Call resolver function if versions differ
     - Update with incremented version
   - Apply optimistic changes immediately
   - Rollback on error

3. **UI Implementation:**
   - Text area for content input
   - Submit button with loading state
   - Post list with optimistic indicators
   - Visual feedback for temp posts

**Conflict Resolution Strategy:**
- Implement simple last-write-wins
- Merge remote and local changes
- Increment version number
- Consider UI for manual resolution in production

**Key Concepts:**
- Optimistic update patterns
- Query cancellation
- Rollback mechanisms
- Conflict detection
- Cache synchronization

## Practical Assignment

### Build a Social Media Dashboard

Create a comprehensive social media dashboard with advanced Anchor patterns:

1. **Profile Management**
   - User profile with hierarchical PDAs
   - Settings and preferences
   - Profile discovery
   - Batch operations

2. **Post System**
   - Create/edit/delete with optimistic updates
   - Advanced filtering and search
   - Pagination with infinite scroll
   - Real-time updates

3. **Interaction Features**
   - Like/unlike with instant feedback
   - Comment system with threading
   - Follow/unfollow users
   - Activity feed

4. **Performance Dashboard**
   - Cache hit rates
   - Query performance metrics
   - Optimistic update success rates
   - Error tracking

**Requirements:**
- Implement all PDA patterns correctly
- Use optimistic updates throughout
- Handle all error cases gracefully
- Ensure offline functionality
- Add comprehensive loading states

**Advanced Features:**
- Implement collaborative editing
- Add real-time notifications
- Create analytics dashboard
- Export/import functionality

## Additional Resources

### Required Reading
- [Anchor PDA Guide](https://www.anchor-lang.com/docs/pdas)
- [React Query Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Solana Account Subscription](https://docs.solana.com/developing/clients/jsonrpc-api#accountsubscribe)

### Supplementary Materials

- [Advanced Caching Strategies](https://tkdodo.eu/blog/effective-react-query-keys)

### Practice Exercises
1. Build a PDA hierarchy visualizer
2. Create account migration tool
3. Implement merge conflict resolver
4. Build cache persistence layer

## Common Issues and Solutions

### Issue: PDA collision
**Solution:** 
- Add more entropy to PDA seeds
- Include timestamp or unique identifier
- Use multiple seed components
- Consider using incremental counters
- Ensure seed uniqueness across users

### Issue: Optimistic update flicker
**Solution:** 
- Generate stable temporary IDs
- Include user identifier in temp ID
- Use consistent ID format
- Implement smooth CSS transitions
- Maintain UI stability during updates

### Issue: Cache inconsistency
**Solution:** 
- Implement cache versioning strategy
- Include version in query keys
- Clear old cache versions
- Migrate data between versions
- Use structured cache keys

## Week 7 Quiz Questions

1. What are the benefits of hierarchical PDAs?
2. How do memcmp filters work internally?
3. When should you use optimistic updates?
4. What strategies exist for conflict resolution?
5. How can you implement offline support?

## Hands-On Challenge

### PDA Explorer Tool

Build a comprehensive PDA exploration tool that:
- Visualizes PDA hierarchies
- Calculates PDA addresses
- Checks existence in batch
- Monitors PDA changes
- Exports PDA mappings

**Advanced Requirements:**
- Support any program ID
- Detect PDA patterns automatically
- Generate TypeScript types
- Create visual dependency graphs

## Looking Ahead

Next week marks the beginning of the final project - building a full-featured note-taking dApp that combines all concepts covered. Preparation includes:
- Reviewing all previous materials
- Setting up a fresh project
- Planning your architecture
- Gathering UI inspiration

The project showcases the ability to build production-ready Solana applications.