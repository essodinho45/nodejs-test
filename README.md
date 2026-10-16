# Support Tickets Mini App

A full-stack ticket tracking application built with a **Node.js + Express** REST API (structured with a clean MVC pattern) and a **React + Vite + Tailwind CSS v4** frontend. It features optimistic UI updates, debounced search with race-condition protection, manual dark/light theming, and full English/Arabic (LTR/RTL) localization.

---

## Project Structure

```text
support-tickets-app/
├── README.md
├── server/                        # Node.js + Express Backend (ES Modules)
│   ├── package.json
│   ├── src/
│   │   ├── server.js              # Express app setup & centralized error middleware
│   │   ├── models/
│   │   │   └── Ticket.js          # Data layer (In-memory / Native SQLite)
│   │   ├── controllers/
│   │   │   └── ticketController.js# Request validation (Joi) & HTTP response orchestration
│   │   └── routes/
│   │       └── tickets.js         # REST API endpoint definitions
│   └── tests/
│       └── tickets.test.js        # Integration tests (Vitest + Supertest)
│
└── client/                        # React + Vite + Tailwind CSS v4 Frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                # State orchestrator & global theme/locale effects
        ├── index.css              # Tailwind v4 imports & class-based dark variant
        ├── translations.js        # EN / AR translation dictionary
        ├── hooks/
        │   └── useTickets.js      # Custom hook (debouncing, AbortController, optimistic UI)
        └── components/
            ├── Header.jsx         # Brand header, Dark/Light & EN/AR toggles
            ├── TicketForm.jsx     # Creation form with client & server error display
            ├── TicketFilters.jsx  # Search input & status filter dropdown
            ├── TicketList.jsx     # Loading, error, empty, and list states
            ├── TicketItem.jsx     # Single ticket row with status & delete controls
            └── Pagination.jsx     # Page navigation with RTL-aware icons
```

---

## Prerequisites & Setup Instructions

### Prerequisites
- **Node.js**: v22.5.0 or higher (Tested on v26.x — required if using the built-in `node:sqlite` driver).
- **npm**: v10+

### 1. Backend Setup (`/server`)
Open a terminal and navigate to the backend directory:
```bash
cd server
npm install
```

Start the development server (runs on `http://localhost:3000` by default):
```bash
npm run dev
```

Run the automated test suite (Vitest + Supertest):
```bash
npm test
```

### 2. Frontend Setup (`/client`)
Open a second terminal and navigate to the frontend directory:
```bash
cd client
npm install
```

Start the Vite development server (typically runs on `http://localhost:5173`):
```bash
npm run dev
```

---

## API Reference

| Method | Endpoint | Query / Body Parameters | Response Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | `?status=` (`open` \| `in_progress` \| `closed`), `?q=` (string), `?page=` (int, default `1`), `?limit=` (int, max `50`, default `10`) | `200 OK`, `400 Bad Request` |
| `POST` | `/api/tickets` | `{ title: string (3-100 chars), description?: string (max 1000), priority: 'low' \| 'medium' \| 'high' }` | `201 Created`, `400 Bad Request` |
| `PATCH` | `/api/tickets/:id` | Partial payload of `{ title, description, priority, status }` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/tickets/:id` | None | `204 No Content`, `404 Not Found` |

---

## Architecture & Key Decisions

### 1. Backend MVC Separation
Rather than placing validation, storage logic, and HTTP responses directly inside Express route callbacks, the backend is divided into:
- **Routes (`routes/tickets.js`)**: Purely maps HTTP verbs and endpoints to controller actions.
- **Controllers (`controllers/ticketController.js`)**: Validates incoming queries and payloads using **Joi** schemas and formats HTTP responses (`201`, `204`, `400`, `404`).
- **Models (`models/Ticket.js`)**: Encapsulates all data access. Because the controller only calls methods like `Ticket.findAll()` or `Ticket.create()`, the underlying storage engine can be swapped between an **in-memory array** and **Node's native `node:sqlite`** without touching a single line of controller or route code.

### 2. Storage Choice: Native SQLite (`node:sqlite`) / In-Memory Fallback
- **Zero External Dependencies**: Modern Node.js includes the built-in `node:sqlite` module (`DatabaseSync`). This provides true SQL persistence (`tickets.db`), prepared statements for SQL-injection safety, and native `WHERE` / `LIMIT` / `OFFSET` pagination without requiring third-party C++ binaries or external database servers.
- **Test Isolation**: When `process.env.NODE_ENV === 'test'`, the database automatically switches to `:memory:`, ensuring Supertest runs fast and leaves no leftover test artifacts on disk.

### 3. Centralized Error Handling
All route errors are forwarded via `next(err)` to a single error-handling middleware in `src/server.js`.
- Known client errors (created via `http-errors` and `Joi`) return structured `400` or `404` JSON payloads with validation details.
- Unexpected `500` errors are logged server-side for debugging, but their stack traces and internal messages are stripped from the client response to prevent information leakage.

### 4. Custom `useTickets` Hook & Race-Condition Protection
Instead of pulling in an external state library, `useTickets.js` demonstrates core React fundamentals:
- **Debouncing**: A `300ms` timer delays network requests while the user types in the search bar.
- **Stale Response Cancellation**: Uses the native browser `AbortController` API. If a user types rapidly or switches filters while a request is already in flight, the previous HTTP request is aborted before the new one begins.
- **Optimistic UI with Rollback**: Changing a ticket's status updates the React state immediately for zero-latency feedback. Before mutating state, the hook saves a snapshot of the current tickets array. If the `PATCH` request fails, the hook catches the error and restores the snapshot.

### 5. Styling, Dark Mode, and RTL Localization
- **Tailwind CSS v4**: Configured with the zero-config `@tailwindcss/vite` plugin and `@variant dark (&:where(.dark, .dark *));` for explicit class-based dark mode toggling rather than relying strictly on OS defaults.
- **Birectional Layout (EN / AR)**: Toggling the language updates `document.documentElement.dir` (`ltr` vs. `rtl`). Components use Tailwind's logical properties (`ps-`, `pe-`, `start-`, `end-`, `rtl:rotate-180`) so embedded input icons and pagination arrows automatically mirror in Arabic.

---

## Trade-offs Made

1. **Custom Hook vs. TanStack Query (React Query)**:
   - *Decision*: Built `useTickets` with native `useState`, `useEffect`, `useRef`, and `fetch`.
   - *Trade-off*: It fulfills the starter skeleton directly and proves a clear understanding of closures, cleanup functions, and `AbortController`. However, it requires manual `refreshTrigger` counters to force refetches after mutations and lacks background cache revalidation or window-focus refetching.
2. **Offset Pagination (`page` & `limit`) vs. Cursor Pagination**:
   - *Decision*: Used standard `LIMIT` and `OFFSET` pagination as specified by the API requirements.
   - *Trade-off*: Simple to implement and supports jumping to arbitrary pages, but in a high-volume production database, large offsets degrade query performance and can cause skipped/duplicated rows if items are inserted while paging.
3. **Prop Drilling for Localization (`t` object)**:
   - *Decision*: Passed the active translation dictionary `t` down as a prop from `App.jsx` to child components.
   - *Trade-off*: Very explicit and fast for a 5-component tree, but would become repetitive in a larger application compared to a React Context provider or `react-i18next`.

---

## What I Would Do With More Time

1. **Authentication & Role-Based Access Control (Bonus)**:
   - Add JWT authentication middleware on the backend with `agent` (write/delete permissions) and `viewer` (read-only) roles, paired with a role-switcher in the React header to preview permissions.
2. **Migrate Data Fetching to TanStack Query**:
   - Replace the manual `refreshTrigger` and optimistic rollback boilerplate with `useQuery` and `useMutation` for automatic cache invalidation, retry logic, and deduplicated requests.
3. **Full Ticket Editing & Description Modal**:
   - Expose the optional `description` field in the UI via an expandable drawer or modal, allowing agents to edit ticket titles and descriptions inline.
4. **End-to-End & Frontend Component Testing**:
   - Expand backend Vitest coverage to test `PATCH` edge cases, `DELETE` 404s, and pagination caps (`limit > 50`), and add **React Testing Library** tests to verify optimistic rollback behavior in the UI.