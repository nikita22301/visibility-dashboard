DareAISearch Frontend Developer Assignment

This project is my solution for Problem Statement 1 from the DareAISearch Frontend Developer assignment.

The idea was to build a data explorer that still behaves properly when the network is slow, requests fail, or a user changes the search quickly.

What the app does

The explorer works with more than 10,000 records and supports:

Search

Platform and status filters

Sorting

Pagination

Record details

Shareable URLs

Browser back and forward navigation

Retry after a failed request

Keyboard navigation

Screen-reader announcements

The mock API also adds random network delay (200ms to 3 seconds) and fails some requests intentionally. This makes it easier to test how the application behaves in real-world conditions instead of only testing the happy path.

Main points I focused on

Avoiding old search results

Search is debounced so a request is not sent for every key press. When the user changes the search or filters while an earlier request is still running, the older request can be cancelled using AbortSignal. This prevents an older response from replacing the latest results.

Keeping the explorer state in the URL

Search, filters, sorting and page are stored in the URL. For example:

/prompts?search=geo&platform=ChatGPT&status=Mentioned&sort=mentions_desc&page=2

Because the state is in the URL, refreshing the page or using the browser back/forward buttons keeps the same explorer view. The URL can also be shared with someone else.

Working with a large list

The API returns only the records needed for the current page instead of sending the complete dataset to the browser. The table also uses windowed rendering so it does not create unnecessary DOM elements for rows that are not visible.

Handling failures

The application has separate loading, empty and error states. If a request fails, the user sees an error message and a Retry action. The UI does not silently show an old response as if it were the latest data.

Detail view

Each record has its own route, for example:

/prompts/123

This makes the detail page directly accessible by URL. Returning to the explorer keeps the previous search, filters, sorting and page.

Tech used

React

TypeScript

Vite

TanStack Query

React Router

Vitest

Testing Library

Vercel serverless functions

Lucide React

Running the project locally

Install the dependencies:

npm install

Start the development server:

npm run dev

For a production build:

npm run build

Run the tests:

npm test

API

The deployed API is available through:

/api/prompts

It supports search, filtering, sorting and pagination through query parameters such as:

search
platform
status
sort
page
pageSize

Example:

/api/prompts?search=geo&platform=ChatGPT&status=Mentioned&sort=mentions_desc&page=2&pageSize=25

A single record can be requested with:

/api/prompts?id=123

The API intentionally adds random delay and occasional failures to test the frontend's loading and error handling.

Tests

The tests are focused on the parts of the app that are most important for this assignment rather than trying to test every small component.

They cover things such as:

API query parameters

Request cancellation

Failed API responses

Deployment

The frontend can be deployed on Vercel using the free tier. The api folder contains the serverless API used by the deployed application.

Demo video

For the demo, I would show the main explorer flow and then demonstrate a slow/failed request using the browser DevTools. I would also show the URL state, detail page and keyboard navigation.

Sources and references

I used the official documentation for the main libraries and browser APIs used in the project, including:

React

TanStack Query

React Router

Vite

Vercel

MDN (AbortController and URLSearchParams)

AI usage

I used ChatGPT during development for help with implementation ideas, debugging and reviewing edge cases. I reviewed and tested the suggestions before adding them to the project.

As requested in the assignment, the related ChatGPT conversation/share history can be provided along with the repository.

Author

Nikita Jangid