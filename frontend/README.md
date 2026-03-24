## Running this project
- Copy .env.example to .env
  ```sh
  cp .env.example .env
  ```

- Run dev server
  ```sh
  pnpm dev
  ```

## Authentication Flow
- **Login/Signup**: zod validated forms, calls backend endpoints
- **Session**: stored in HTTP-only cookie
- **Server Context**: uses `@tanstack/react-router`'s `createTRPCUntypedClient` or isomorphic fetch to forward cookies on SSR
- **Protected Routes**: redirect to login if no valid session
- Logout: dropdown button to logout, that call backend api to clear cookie, on success invalidates all tanstack query cache 

## Adding to Favourites
- Heart icon button on each property card
- Click toggles: POST to add, DELETE to remove from `/api/properties/{id}/favourites`
- Query invalidation on success refreshes the UI
- View all favourites at `/favourites`
