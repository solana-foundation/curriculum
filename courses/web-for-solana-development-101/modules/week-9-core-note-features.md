# Week 9: Core Note Features Implementation

## Overview

This week focuses on implementing the core functionality of the note-taking dApp. Topics include building CRUD operations for notes, implementing efficient data storage patterns, adding categorization and tagging, and ensuring smooth synchronization between on-chain and off-chain data.

## Learning Objectives

Learning outcomes for this week include:

1. Implement complete CRUD operations for notes
2. Handle large content with IPFS integration
3. Build efficient pagination and filtering
4. Create a robust categorization system
5. Implement optimistic updates for better UX

## Lessons

### Lesson 1: Creating and Storing Notes

**Topics Covered:**
- Note creation flow with Anchor
- Handling content size limitations
- IPFS integration for large content
- Transaction optimization strategies
- Error handling and validation

**Lab Exercise: Creating and Storing Notes**

**1. Note Service Implementation:**

**Service Structure:**
- Initialize with Anchor program reference
- Configure IPFS client with API endpoint and authentication
- Implement core CRUD methods

**Create Note Method:**
- Fetch user profile to get current note count
- Determine storage strategy based on content size:
  - Small content (< 500 chars): Store on-chain
  - Large content: Store in IPFS, save hash on-chain
- Generate content preview (first 200 characters)
- Derive note PDA using profile, wallet, and note ID
- Execute on-chain transaction with all metadata
- Return note ID and transaction signature

**Update Note Method:**
- Derive note PDA from wallet and note ID
- Fetch current note data
- Handle content updates with IPFS if needed
- Preserve unchanged fields
- Execute update transaction

**Delete Note Method:**
- Derive both profile and note PDAs
- Execute deletion transaction
- Update profile note count

**Content Fetching:**
- Check if content is IPFS hash or inline
- Fetch from IPFS if hash detected
- Handle streaming chunks
- Fallback for fetch errors

**2. Create Note Component:**

**Form Setup:**
- Define Zod schema for validation
- Title: 1-64 characters required
- Category: Required selection
- Tags: Comma-separated, parsed to array
- Public flag: Boolean with default false

**Component Features:**
- Use react-hook-form with Zod resolver
- Manage content state separately
- Show loading toast during save
- Navigate to note detail on success
- Handle errors with user feedback

**Form Layout:**
- Title input with validation display
- Two-column grid for category and tags
- Checkbox for public visibility
- Rich text editor integration
- Submit handling with validation

**Key Concepts:**
- Content size optimization
- IPFS integration patterns
- Form validation
- Transaction construction
- Error handling

### Lesson 2: Reading and Displaying Notes

**Topics Covered:**
- Efficient note fetching strategies
- Pagination implementation
- Content loading from IPFS
- Search and filter functionality
- Performance optimization

**Lab Exercise: Reading and Displaying Notes**

**1. Note Fetching Hooks:**

**useUserNotes Hook (Infinite Query):**
- Accept optional filters (category, tags, search)
- Use React Query's useInfiniteQuery for pagination
- Fetch user profile to get total note count
- Calculate pagination boundaries (newest first)
- Batch fetch notes by deriving PDAs
- Handle deleted notes gracefully (return null)
- Apply client-side filtering:
  - Category matching
  - Tag intersection
  - Search in title and preview
- Return paginated results with cursor

**useNote Hook (Single Note):**
- Fetch individual note by ID
- Derive note PDA from wallet and ID
- Fetch note data from chain
- Retrieve full content from IPFS if needed
- Combine on-chain and off-chain data

**2. Notes List Component:**

**Component Structure:**
- Manage filter state
- Use infinite query hook with filters
- Implement intersection observer for auto-loading
- Handle loading, error, and empty states

**Infinite Scroll Implementation:**
- Use react-intersection-observer
- Trigger fetchNextPage when sentinel visible
- Show loading indicator during fetch
- Display scroll hint when more available

**UI Elements:**
- Search/filter component integration
- Responsive grid layout
- Loading skeleton placeholders
- Empty state with CTA
- Error state handling

**3. Note Detail View:**

**Page Component:**
- Extract ID from URL params
- Use single note hook
- Show loading skeleton
- Handle not found errors
- Render note viewer component

**Key Concepts:**
- Infinite scroll pagination
- Batch fetching strategies
- Client-side filtering
- Loading states
- Error boundaries

### Lesson 3: Update and Delete Operations

**Topics Covered:**
- Update patterns with optimistic UI
- Soft vs hard deletion strategies
- Version conflict resolution
- Undo/redo functionality
- Audit trail implementation

**Lab Exercise: Update and Delete Operations**

**1. Update Note Component:**

**Update Mutation Setup:**
- Use React Query's useMutation
- Call NoteService update method
- Implement optimistic updates:
  - Cancel in-flight queries
  - Snapshot previous state
  - Update cache immediately
  - Include updated timestamp
- Handle errors with rollback
- Show success toast and exit edit mode
- Invalidate related queries on settlement

**Delete Mutation Setup:**
- Implement confirmation dialog
- Throw cancellation error if not confirmed
- Execute deletion through service
- Navigate to notes list on success
- Handle cancellation vs actual errors

**Component UI:**
- Toggle between view and edit modes
- Pass note data to edit form
- Provide save/cancel handlers
- Show action buttons in view mode
- Display loading states

**2. Version History Component:**

**History Management:**
- Toggle visibility of version list
- Fetch versions only when expanded
- Display versions in reverse chronological order
- Show version number and timestamp
- Include change summary
- Provide restore functionality

**UI Layout:**
- Expandable section design
- Version cards with metadata
- Restore action for each version
- Proper date formatting

**3. Undo/Redo Manager:**

**Class Implementation:**
- Maintain history array and current index
- Push method:
  - Clear future states
  - Add new state
  - Manage history size limit
- Navigation methods:
  - Check if undo/redo possible
  - Move through history
  - Return state at position
- Memory management:
  - Limit to 50 states
  - Remove oldest when exceeded

**Key Concepts:**
- Optimistic updates
- Confirmation dialogs
- Version management
- Undo/redo patterns
- Mutation lifecycle

## Practical Assignment

### Implement Complete Note Management

Build a fully functional note management system with the following features:

1. **Note Creation**
   - Rich text editor with markdown support
   - Category and tag management
   - Public/private toggle
   - Draft auto-saving

2. **Note Display**
   - Grid and list view options
   - Search with highlighting
   - Filter by category/tags
   - Infinite scroll pagination

3. **Note Editing**
   - In-place editing
   - Version history
   - Collaborative editing prep
   - Conflict resolution

4. **Note Organization**
   - Bulk operations
   - Drag-and-drop reordering
   - Archive functionality
   - Export options

**Requirements:**
- All CRUD operations working
- Optimistic updates throughout
- Proper error handling
- Loading states
- Mobile responsive

**Bonus Features:**
- Offline support with sync
- Note templates
- Import from other formats
- Keyboard shortcuts

## Additional Resources

### State Management
- [Zustand Recipes](https://github.com/pmndrs/zustand/blob/main/docs/recipes.md)
- [React Query Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Optimistic Updates Guide](https://tkdodo.eu/blog/optimistic-updates)

### IPFS Integration
- [IPFS HTTP Client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client)
- [Pinata SDK](https://docs.pinata.cloud/sdks/node-js-sdk)
- [Web3.Storage](https://web3.storage/docs/)

### Rich Text Editing
- [Tiptap Extensions](https://tiptap.dev/extensions)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)
- [Markdown It](https://github.com/markdown-it/markdown-it)

## Common Issues and Solutions

### Issue: IPFS upload failures
**Solution:** 
- Implement retry logic with exponential backoff
- Set maximum retry attempts (e.g., 3)
- Increase delay between retries
- Throw error only after all retries exhausted
- Log each retry attempt for debugging

### Issue: Large note lists performance
**Solution:** 
- Implement virtual scrolling with react-window
- Use FixedSizeList for consistent item heights
- Render only visible items
- Calculate optimal item size
- Handle dynamic content loading

### Issue: Concurrent edit conflicts
**Solution:** 
- Implement optimistic locking with version tracking
- Fetch current version before updates
- Include version in update request
- Detect version mismatch
- Provide conflict resolution UI

## Week 9 Quiz Questions

1. How do you handle content that exceeds on-chain storage limits?
2. What are the trade-offs of optimistic updates?
3. How can you implement efficient pagination with PDAs?
4. What strategies exist for handling concurrent edits?
5. When should you use soft vs hard deletion?

## Hands-On Challenge

### Performance Optimization Sprint

Optimize your note app for:
- Load 1000+ notes smoothly
- Sub-100ms search results
- Offline-first functionality
- 60fps scrolling
- < 3 second initial load

Techniques to explore:
- Virtual scrolling
- Search indexing
- Service workers
- Code splitting
- Lazy loading

## Looking Ahead

Next week adds advanced features to the note-taking dApp:
- Categories and smart tags
- Sharing and collaboration
- Search with full-text indexing
- Analytics and insights

Prerequisites include ensuring core CRUD operations are solid and well-tested before adding advanced features.