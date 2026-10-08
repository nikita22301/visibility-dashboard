# DareAISearch Frontend Developer Assignment

This project is my solution for **Problem Statement 1** from the DareAISearch Frontend Developer assignment.

The goal was to build a data explorer that remains reliable when the network is slow, requests fail, or users change their search and filters while previous requests are still running.

Live Demo

Live Application: https://visibility-dashboard-eight.vercel.app/

GitHub Repository: https://github.com/nikita22301/visibility-dashboard

The application is deployed on Vercel and the source code is available in the public GitHub repository.

---

## What the app does

The Data Explorer works with **12,000 mock records** and supports:

* Search
* Platform filtering
* Status filtering
* Sorting
* Pagination
* Record detail pages
* Shareable URL state
* Browser back/forward navigation
* Retry after failed requests
* Keyboard-accessible controls
* Screen-reader announcements
* Virtualized/windowed table rendering

The mock API intentionally simulates real-world network conditions:

* Random latency between **200ms and 3 seconds**
* Approximately **10% request failures**
* Server-side style search, filtering, sorting and pagination

This makes it possible to test the application beyond the normal happy path.

---

## Main implementation decisions

### 1. Avoiding stale search results

Search input is debounced by 350ms so a request is not sent for every keystroke.

TanStack Query provides an `AbortSignal` to the query function, which is passed through to the API request. When a query becomes obsolete, the previous request can be cancelled.

This helps prevent an older response from replacing the latest search results.

### 2. Keeping explorer state in the URL

Search, filters, sorting and pagination are stored in the URL.

For example:

```text
/prompts?search=geo&platform=ChatGPT&status=Mentioned&sort=mentions_desc&page=2
```

This means the explorer state can be:

* Refreshed without losing the current view
* Shared through a URL
* Restored using browser back/forward navigation

### 3. Handling a large dataset

The mock API contains **12,000 records**, but the browser only receives the records required for the current page.

The table also uses windowed rendering so unnecessary DOM rows are not rendered at the same time.

This keeps the explorer lightweight even though the underlying dataset is large.

### 4. Handling slow and failed requests

The application has separate states for:

* Loading
* Refreshing
* Empty results
* API errors
* Successful results

When an API request fails, the application shows an error message and a **Retry** action rather than silently treating old data as the latest response.

### 5. Detail view

Every prompt has its own route:

```text
/prompts/123
```

The detail page can therefore be opened directly using a URL.

When returning to the explorer, the previous search, filters, sorting and pagination state are preserved.

---

## Architecture

The project is structured around a few main areas:

```text
src/
├── components/
├── pages/
│   ├── Prompts.tsx
│   └── PromptDetail.tsx
├── services/
│   ├── api.ts
│   └── localMockApi.ts
├── explorer.test.ts
├── types.ts
└── styles.css

api/
└── prompts.ts
```

The frontend uses TanStack Query for asynchronous API state and request lifecycle handling.

The API layer keeps request construction separate from the UI.

The mock API is used during local development, while the deployed application uses the Vercel serverless API.

---

## API

The deployed application uses:

```text
/api/prompts
```

Supported query parameters include:

```text
search
platform
status
sort
page
pageSize
```

Example:

```text
/api/prompts?search=geo&platform=ChatGPT&status=Mentioned&sort=mentions_desc&page=2&pageSize=25
```

A single record can be requested with:

```text
/api/prompts?id=123
```

The API intentionally introduces random latency and occasional failures so that loading, cancellation and error handling can be tested.

---

## Running locally

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the automated tests:

```bash
npm test
```

---

## Testing

The automated tests focus on the behaviour that is most important for this assignment.

Current test coverage includes:

* API query parameters
* Search/filter/sort/pagination request construction
* AbortSignal propagation
* API failure handling
* Utility behaviour

Current test result:

```text
Test Files: 2 passed
Tests:      4 passed
```

---

## Deployment

The project is deployed using **Vercel**.

The `api` directory contains the serverless API used by the deployed application.

The production build is generated with:

```bash
npm run build
```

---

## Demo

The demo shows:

1. The 12,000-record explorer
2. Search and filtering
3. Sorting and pagination
4. URL state preservation
5. Opening a record detail page
6. Returning to the explorer
7. A simulated API failure
8. Retry behaviour
9. Keyboard-accessible interaction

A failed request is intentionally demonstrated because handling unreliable requests is an important part of the assignment.

---

## Sources and references

The implementation was based primarily on the official documentation for the technologies and browser APIs used:

* React documentation
* TypeScript documentation
* Vite documentation
* TanStack Query documentation
* React Router documentation
* Vitest documentation
* Vercel documentation
* MDN documentation for `AbortController`, `URLSearchParams` and related browser APIs

---

## AI usage

I used ChatGPT during development for:

* Discussing implementation approaches
* Debugging TypeScript and API issues
* Reviewing request cancellation and error-handling behaviour
* Checking edge cases against the assignment requirements
* Improving the project documentation

I reviewed and tested the generated suggestions before incorporating them into the project.

The relevant ChatGPT conversation/share history will be provided as requested in the assignment.

---

## Trade-offs

A few implementation choices were made to keep the project focused on the assignment requirements:

* The dataset is generated deterministically instead of using an external database.
* The API is intentionally simulated rather than connected to a production data source.
* Pagination is used to limit the amount of data transferred for each request.
* Windowed table rendering is used to avoid unnecessary DOM work.
* TanStack Query handles request lifecycle and cancellation rather than implementing a custom request manager.

These choices keep the project small enough to run on free hosting while still demonstrating the required frontend behaviour.

---

## Author

**Nikita Jangid**
