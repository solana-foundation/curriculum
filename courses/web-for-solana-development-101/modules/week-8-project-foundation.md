# Week 8: Note-Taking dApp - Project Foundation

## Overview

This week begins the capstone project: building a full-featured note-taking dApp on Solana. Topics include architecting the application, setting up the project structure, implementing core UI components, and integrating wallet authentication using all the patterns learned in previous weeks.

## Learning Objectives

Learning outcomes for this week include:

1. Design a complete dApp architecture with Solana integration
2. Set up a production-ready project structure
3. Implement core UI components with Tailwind CSS
4. Build wallet-based authentication and user profiles
5. Create a robust state management system

## Lessons

### Lesson 1: Project Architecture and Planning

**Topics Covered:**

- Analyzing requirements for a note-taking dApp
- Designing the on-chain data model
- Planning the component architecture
- Setting up the development environment
- Creating technical specifications

**Lab Exercise: Project Architecture and Setup**

**Architecture Planning:**

1. **Feature Requirements:**

   - Full CRUD operations for notes
   - Rich text editing with markdown support
   - Organization through categories and tags
   - Search and filtering capabilities
   - Public/private note sharing
   - Collaborative features (future enhancement)

2. **On-chain Data Model Design:**

   **UserProfile PDA Structure:**

   - Owner wallet public key
   - Username (32 character limit)
   - Note counter for tracking
   - Creation timestamp
   - Avatar IPFS hash (64 chars)

   **Note PDA Structure:**

   - Author public key reference
   - Unique note ID
   - Title (64 character limit)
   - Content hash for IPFS storage
   - Category (32 chars)
   - Tags array (max 5, 16 chars each)
   - Public/private flag
   - Shared wallet list (max 10)
   - Timestamps and version tracking

   **Off-chain Storage:**

   - Full markdown content in IPFS
   - File attachments
   - Version history tracking

3. **Project Setup Steps:**
   - Initialize Next.js with TypeScript and Tailwind
   - Configure app directory structure
   - Install Solana dependencies (@solana/client, @solana/react-hooks, @coral-xyz/anchor)
   - Add UI libraries (tiptap, react-query, react-hook-form)
   - Set up state management (zustand)
   - Configure validation (zod)
   - Create organized folder structure
   - Set up TypeScript for Solana compatibility
   - Configure environment variables

**Key Concepts:**

- Scalable architecture design
- On-chain vs off-chain data decisions
- PDA hierarchy planning
- Component organization
- Development workflow setup

### Lesson 2: Core UI Components

**Topics Covered:**

- Building reusable UI components
- Implementing responsive design
- Creating a consistent design system
- Accessibility considerations
- Component composition patterns

**Lab Exercise: Core UI Components Implementation**

**1. Layout Component Structure:**

- Create main layout wrapper with header and optional sidebar
- Use flexible container with proper spacing
- Implement responsive design patterns
- Support conditional sidebar rendering
- Apply consistent background styling

**2. Note Editor Component:**

**Setup Requirements:**

- Initialize Tiptap editor with StarterKit and Markdown extensions
- Configure markdown-only mode (no HTML)
- Apply Tailwind prose classes for typography
- Set minimum height and responsive sizing

**Component Features:**

- Title input field with large font styling
- Rich text editor with toolbar
- Save/Cancel button actions
- Loading states for save operation
- Extract markdown content from editor
- Pass title and content to save handler

**3. Note Card Component:**

**Card Structure:**

- Clickable card with hover effects
- Title with single-line truncation
- Public/private indicator badge
- Preview text with 2-line limit
- Category and tag badges
- Relative time display

**Visual Design:**

- White background with subtle shadow
- Border and hover shadow transition
- Color-coded badges for categorization
- Responsive spacing and layout

**4. Search and Filter Component:**

**Form Implementation:**

- Use react-hook-form for state management
- Define filter options interface
- Set default values for all fields
- Watch form changes for real-time filtering

**Filter Controls:**

- Search input with full-width styling
- Category dropdown selector
- Public-only checkbox toggle
- Sort options dropdown
- Responsive grid layout
- Auto-trigger filter on changes

**Key Concepts:**

- Component reusability
- Responsive design patterns
- Form handling
- Rich text editing
- Performance optimization

### Lesson 3: Wallet Integration and Authentication

**Topics Covered:**

- Implementing wallet-based authentication
- Creating user profiles on-chain
- Session management
- Protected routes
- Multi-wallet support

**Lab Exercise: Wallet Integration and Authentication**

**1. Auth Store Implementation (Zustand):**

**Store Structure:**

- Define authentication state interface
- Track authentication status, profile, wallet, loading, and errors
- Implement action methods for auth operations

**Core Methods:**

- **signIn**: Check for existing profile and update auth state
- **signOut**: Clear all authentication data
- **checkProfile**: Derive PDA and fetch profile data
- **createProfile**: Execute on-chain profile creation

**PDA Derivation:**

- Use 'profile' seed with wallet public key
- Consistent PDA generation across methods
- Handle fetch errors gracefully

**2. Auth Provider Component:**

**Integration Points:**

- Connect wallet-ui hooks for wallet state
- Use Anchor program hook
- Access auth store actions

**Lifecycle Management:**

- Monitor wallet connection changes
- Auto-signin when wallet connects
- Auto-signout on disconnect
- Handle program availability

**3. Protected Route Implementation:**

**Route Protection Logic:**

- Check authentication status
- Redirect to home if not authenticated
- Show loading screen during auth check
- Render children only when authenticated

**Navigation Handling:**

- Use Next.js router for redirects
- Implement proper loading states
- Prevent content flash

**4. Profile Creation Modal:**

**Form Setup:**

- Define Zod schema for validation
- Username constraints (3-32 chars, alphanumeric)
- Use react-hook-form with Zod resolver

**Modal Features:**

- Full-screen overlay with backdrop
- Centered modal container
- Form with validation feedback
- Loading states during creation
- Success/error handling

**Profile Creation Flow:**

- Validate username input
- Call store's createProfile method
- Handle success with modal close
- Display errors appropriately

**Key Concepts:**

- Wallet-based authentication flow
- State management with Zustand
- Protected route implementation
- Profile creation patterns
- Form validation

## Practical Assignment

### Build the Foundation

Complete the following tasks to establish your note-taking dApp foundation:

1. **Project Setup**

   - Initialize the project with Next.js and TypeScript
   - Configure @solana/client and @solana/react-hooks
   - Set up Tailwind CSS with custom theme
   - Create the folder structure

2. **Core Components**

   - Implement the layout system
   - Build the note editor with Tiptap
   - Create note card and list components
   - Add search and filter functionality

3. **Authentication System**

   - Integrate wallet connection
   - Implement profile creation flow
   - Set up protected routes
   - Create auth state management

4. **Design System**
   - Define color palette and typography
   - Create reusable UI components
   - Implement loading states
   - Add error boundaries

**Deliverables:**

- GitHub repository with clean commit history
- README with setup instructions
- Component storybook (optional)
- Live demo on Vercel/Netlify

## Additional Resources

### UI/UX Inspiration

- [Notion](https://notion.so) - Note organization
- [Bear](https://bear.app) - Minimal design
- [Obsidian](https://obsidian.md) - Linking features
- [Linear](https://linear.app) - Modern UI patterns

### Technical References

- [Tiptap Documentation](https://tiptap.dev/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS Components](https://tailwindui.com/)

### Solana dApp Examples

- [Solana Cookbook Examples](https://solanacookbook.com/)
- [Realms](https://github.com/solana-labs/governance-ui)
- [Metaplex Candy Machine UI](https://github.com/metaplex-foundation/candy-machine-ui)

## Common Issues and Solutions

### Issue: Wallet connection in development

**Solution:**

- Detect development environment
- Implement mock wallet adapter
- Provide test wallet functionality
- Enable faster development cycles
- Skip actual wallet connection requirements

### Issue: Large note content

**Solution:**

- Define maximum content size limit (e.g., 900 bytes)
- Implement content splitting algorithm
- Store chunks separately or use IPFS
- Reassemble content on retrieval
- Handle chunk references properly

### Issue: SEO for public notes

**Solution:**

- Implement Next.js generateMetadata function
- Fetch public note data server-side
- Return proper meta tags
- Include title and description
- Enable social media previews
- Improve search engine visibility

## Week 8 Quiz Questions

1. What factors determine on-chain vs off-chain storage?
2. How do you implement wallet-based authentication?
3. What are the benefits of using Zustand for state?
4. How can you optimize component re-renders?
5. What security considerations apply to note sharing?

## Hands-On Challenge

### Speed Development Challenge

In 2 hours, implement:

- Complete authentication flow
- Basic note CRUD operations
- Search functionality
- Responsive design

Focus on:

- Clean code structure
- Error handling
- Loading states
- User experience

## Looking Ahead

Next week implements the core note functionality. Topics include:

- Create note storage on-chain
- Implement CRUD operations
- Add categorization system
- Build real-time sync

Prerequisites include ensuring the foundation is solid by testing all authentication flows and verifying UI components are working correctly.
