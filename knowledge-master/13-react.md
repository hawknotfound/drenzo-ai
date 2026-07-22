# React

Declarative, component-based UI library. Build interactive interfaces with predictable state management.

## Core Concepts

**Components:** Functions that return JSX. Props in, UI out. Pure components for predictable rendering.

**JSX:** HTML-like syntax compiled to React.createElement calls. Expressions in {}.

**State (useState):** Local component memory. Triggers re-render on change. Lazy initialization.

**Effects (useEffect):** Side effects — data fetching, subscriptions, DOM manipulation. Dependency array controls execution.

**Context (useContext):** Pass data through the tree without prop drilling. Provider/Consumer pattern.

**Refs (useRef):** Mutable values that persist across renders without triggering re-renders. DOM references.

**Memoization (useMemo, useCallback):** Skip expensive recalculations. Only when actually needed — premature optimization costs complexity.

## Patterns

- **Lifting state up:** Share state by moving it to the nearest common ancestor
- **Compound components:** Related components that share implicit state
- **Custom hooks:** Extract reusable stateful logic
- **Render props:** Pass rendering logic via props
- **Higher-order components (HOC):** Wrap to extend behavior

## React 19

- **useActionState:** Manage form state with pending/error handling
- **Server Actions:** Call server functions directly from components
- **Compiler (React Forget):** Auto-memoization — components and hooks
- **Improved hydration:** Faster initial load for server-rendered apps

## Performance

- Identify unnecessary re-renders first (React DevTools)
- Key props correctly in lists
- Split code with lazy/Suspense
- Virtualize long lists (react-window, react-virtuoso)
- Profile before optimizing
