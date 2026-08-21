# Plan - Fix SEO Server Function Fetch Error

The user is experiencing a `TypeError: Failed to fetch` when the app attempts to call the `getSeoMeta` server function during the root route's data loading. This prevents the entire application from rendering (blank screen). I will fix this by making the server function more robust, updating it to the latest TanStack Start patterns, and ensuring the root loader handles potential failures gracefully.

## Proposed Changes

### 1. Server Functions
- Update `src/lib/seo.functions.ts`:
    - Switch from `inputValidator` (deprecated) to `validator`.
    - Add comprehensive error handling within the handler.
    - Ensure it returns `null` instead of throwing if the database query fails.
    - Add logging to help diagnose server-side issues.

### 2. Root Route
- Update `src/routes/__root.tsx`:
    - Wrap the `getSeoMeta` call in the loader with a `try...catch`.
    - Provide fallback SEO data if the fetch fails, preventing a blank screen.
    - Ensure the loader returns successfully even if SEO metadata is unavailable.

### 3. Middleware
- Update `src/start.ts`:
    - Refine `errorMiddleware` to avoid returning HTML responses for server function calls, as this breaks the client-side fetcher's ability to handle errors.

### 4. Verification
- Verify that the app renders successfully.
- Check the console and network tab for successful `_server-fn` calls.
- Confirm SEO metadata is correctly applied from the database.

## Technical Details
- TanStack Start server functions use a `/_server-fn` endpoint.
- `TypeError: Failed to fetch` on a same-origin request often indicates the server crashed or returned a response that couldn't be parsed.
- Moving to `.validator()` and adding `try...catch` will isolate runtime issues.

