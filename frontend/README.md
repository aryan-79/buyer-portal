## Running this project
- Copy .env.example to .env
  ```sh
  cp .env.example .env
  ```

- Run dev server
  ```sh
  pnpm dev
  ```

## Data fetching and mutation
- Fetch api client and tanstack query hooks generated from openapi schema with openapi-cli
- Uses tanstack router's loader for data loading extending upon tanstack query
- Customised generated fetch client to forward cookies while in server context (i.e in loader) using `createIsomorphicFn`

## Authentication Flow
- **Login/Signup**: zod validated forms, calls backend endpoints
- **Session**: stored in HTTP-only cookie
- **Server Context**: uses `@tanstack/react-start`'s `createIsomorphicFn` or isomorphic fetch to forward cookies on SSR
- **Protected Routes**: redirect to login if no valid session
- Logout: dropdown button to logout, that call backend api to clear cookie, on success invalidates all tanstack query cache 

## Adding to Favourites
- Heart icon button on each property card
- Click toggles: POST to add, DELETE to remove from `/api/properties/{id}/favourites`
- Query invalidation on success refreshes the UI
- View all favourites at `/favourites`

**NOTE:** Visit /admin while logged in as admin to add property

**NOTE** Infinite scroll is implemented for viewing list of properties and favorites
