# Week 11: Performance Optimization

## Overview

This week focuses on optimizing the note-taking dApp for production performance. Topics include profiling techniques, implementing code splitting, optimizing bundle sizes, enhancing runtime performance, and ensuring the application scales efficiently.

## Learning Objectives

Learning outcomes for this week include:

1. Profile and identify performance bottlenecks
2. Implement code splitting and lazy loading
3. Optimize bundle size with tree shaking
4. Enhance runtime performance with caching
5. Implement performance monitoring

## Lessons

### Lesson 1: Performance Profiling and Analysis

**Topics Covered:**
- Using browser DevTools for profiling
- Identifying performance bottlenecks
- Analyzing bundle composition
- Measuring Core Web Vitals
- Performance budgets

**Lab Exercise: Performance Profiling and Analysis**

**1. Performance Monitor Service:**

**Class Structure:**
- Store metrics in Map by category
- Implement measurement methods
- Generate performance reports

**Core Methods:**
- **measureComponent**:
  - Use Performance API marks
  - Measure execution time
  - Record metrics
  - Clean up marks

- **trackWebVitals**:
  - Set up PerformanceObserver for each vital
  - Track FCP (First Contentful Paint)
  - Track LCP (Largest Contentful Paint)
  - Track FID (First Input Delay)
  - Track CLS (Cumulative Layout Shift)

- **measureRPC**:
  - Time RPC operations
  - Log slow operations (>1s)
  - Track errors separately
  - Return operation result

- **generateReport**:
  - Calculate statistics (min, max, avg, p95)
  - Generate performance suggestions
  - Check against thresholds
  - Return structured report

**2. Performance Hook:**
- Track component render counts
- Warn on excessive re-renders
- Provide operation measurement
- Generate component reports

**3. Bundle Configuration:**
- Enable bundle analyzer conditionally
- Configure webpack optimization:
  - Split chunks strategy
  - Vendor separation
  - Common chunk extraction
  - Solana libraries isolation
- Set priorities for chunk groups

**4. Performance Dashboard:**
- Display Web Vitals metrics
- Show RPC performance table
- Present improvement suggestions
- Auto-refresh every 5 seconds
- Grid layout for metric cards

**Key Concepts:**
- Performance monitoring APIs
- Web Vitals tracking
- Bundle analysis
- Performance budgets
- Metric visualization

### Lesson 2: Code Splitting and Lazy Loading

**Topics Covered:**
- Dynamic imports with Next.js
- Route-based code splitting
- Component lazy loading
- Optimizing third-party libraries
- Preloading strategies

**Lab Exercise: Code Splitting and Lazy Loading**

**1. Dynamic Component Loading:**

**Next.js Dynamic Imports:**
- Use dynamic() for heavy components
- Configure loading components
- Disable SSR for client-only code
- Add onLoad callbacks

**Component Examples:**
- **NoteEditor**: Client-side only with skeleton loader
- **ShareModal**: Simple loading text
- **AnalyticsDashboard**: With load event tracking

**2. Route-Based Code Splitting:**

**Page Structure:**
- Use React.lazy for route components
- Wrap in Suspense boundaries
- Provide fallback components
- Split by logical sections

**Layout Strategy:**
- Main content area (2 columns)
- Sidebar content (1 column)
- Independent loading states
- Progressive enhancement

**3. Preload Manager:**

**Core Features:**
- Track preloaded routes
- Hover-based preloading
- Predictive preloading
- Critical chunk preloading

**Implementation Details:**
- **preloadOnHover**: Prefetch on mouse enter
- **predictivePreload**: Analyze navigation patterns
- **preloadCriticalChunks**: Load essential libraries
- **getPredictions**: Route-based predictions

**Webpack Comments:**
- webpackPreload: Critical resources
- webpackPrefetch: Nice-to-have resources

**4. Lazy Loading Hook:**

**Intersection Observer Setup:**
- Accept callback and options
- Store callback in ref
- Configure observer with rootMargin
- Unobserve after intersection
- Clean up on unmount

**5. Progressive Image Loading:**

**Features:**
- Start with placeholder
- Load full image in background
- Smooth transition on load
- Loading indicator overlay
- Preserve aspect ratio

**Key Concepts:**
- Dynamic imports
- Suspense boundaries
- Prefetch strategies
- Lazy loading patterns
- Progressive enhancement

### Lesson 3: Runtime Performance Optimization

**Topics Covered:**
- React optimization techniques
- Efficient state management
- Virtualization for large lists
- Web Workers for heavy computation
- Memory leak prevention

**Lab Exercise: Runtime Performance Optimization**

**1. Virtual List Implementation:**

**Component Structure:**
- Use react-window for virtualization
- AutoSizer for responsive dimensions
- Memoized item renderer
- Custom comparison function

**NoteItem Optimization:**
- Wrap in React.memo
- Custom comparison checking:
  - Index equality
  - Note ID equality
  - Updated timestamp
- Prevent unnecessary re-renders

**Virtual List Configuration:**
- Fixed item size (120px)
- Overscan count (5 items)
- Pass notes as itemData
- Use AutoSizer for dimensions

**2. Web Worker Search:**

**Worker Implementation:**
- Listen for message events
- Handle buildIndex command
- Handle search command
- Use Fuse.js for indexing
- Post results back to main thread

**Hook Implementation:**
- Initialize worker on mount
- Handle worker messages
- Build index when notes change
- Provide async search method
- Track indexing state
- Clean up on unmount

**Search Method:**
- Return Promise for results
- Add temporary event listener
- Send search query to worker
- Resolve with results
- Remove listener after response

**3. Memory Leak Prevention:**

**useCleanup Hook:**
- Store cleanup functions in ref
- Register cleanup functions
- Execute all on unmount
- Clear array after cleanup
- Prevent memory leaks

**4. Optimized State Management:**

**Store Structure:**
- Use Map for O(1) lookups
- Use Set for unique values
- Implement granular updates
- Add computed getters

**Update Methods:**
- **updateNote**: Partial updates
- **updateNoteField**: Single field updates
- Check for actual changes
- Create new Map instances
- Maintain immutability

**Computed Values:**
- Filter by category
- Get total count
- Avoid recalculation

**Hook Usage:**
- Use shallow comparison
- Select specific data
- Prevent unnecessary renders
- Category-based filtering

**Key Concepts:**
- Virtual scrolling
- Web Workers usage
- Memory management
- State optimization
- Render optimization

## Practical Assignment

### Optimize Your Note App

Apply comprehensive performance optimizations:

1. **Performance Monitoring**
   - Implement Web Vitals tracking
   - Add custom performance metrics
   - Create performance dashboard
   - Set up alerts for regressions

2. **Code Splitting**
   - Split routes with dynamic imports
   - Lazy load heavy components
   - Implement progressive loading
   - Add preload strategies

3. **Runtime Optimization**
   - Virtualize long lists
   - Move search to Web Worker
   - Optimize re-renders
   - Implement efficient caching

4. **Bundle Optimization**
   - Analyze and reduce bundle size
   - Tree shake unused code
   - Optimize images and assets
   - Implement CDN strategy

**Performance Targets:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle size < 200KB (initial)
- 60fps scrolling

**Deliverables:**
- Performance report before/after
- Lighthouse scores
- Bundle analysis
- Loading waterfall

## Additional Resources

### Performance Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

### Optimization Libraries
- [React Window](https://github.com/bvaughn/react-window)
- [Comlink](https://github.com/GoogleChromeLabs/comlink) - Web Worker wrapper
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker

### Reading
- [Web.dev Performance](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

## Common Issues and Solutions

### Issue: Large bundle size from Solana libraries
**Solution:** 
- Use dynamic imports for Solana libraries
- Load only when needed
- Split into separate chunks
- Consider lighter alternatives
- Tree-shake unused exports

### Issue: Slow initial page load
**Solution:** 
- Implement progressive hydration
- Disable JS for static pages
- Prioritize above-the-fold content
- Defer non-critical scripts
- Use static generation where possible

### Issue: Memory leaks from subscriptions
**Solution:** 
- Always clean up event listeners
- Store subscription references
- Remove in useEffect cleanup
- Clear timers and intervals
- Terminate workers properly

## Week 11 Quiz Questions

1. What are the Core Web Vitals and their thresholds?
2. How does code splitting improve performance?
3. When should you use Web Workers?
4. What's the difference between prefetch and preload?
5. How do you prevent memory leaks in React?

## Hands-On Challenge

### Performance Competition

Optimize your app to achieve:
- Perfect Lighthouse score (100/100)
- < 1s Time to Interactive
- < 50KB initial JS bundle
- Offline functionality
- No memory leaks

Constraints:
- Maintain all features
- No functionality regression
- Works on 3G network
- Supports low-end devices

## Looking Ahead

Next week focuses on security and best practices:
- Input validation and sanitization
- XSS and CSRF prevention
- Secure key management
- Audit logging
- Security monitoring

Prerequisites include ensuring performance optimizations are stable before adding security layers.