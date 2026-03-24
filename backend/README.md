## Running this project
- copy env variables from `.env.example` to `.env`
  ```sh
  cp .env.example .env
  ```
- setup database and redis in docker
  ```sh
  docker compose up -d
  ```
- seed admin and properties
  ```sh
  pnpm db:seed
  ```
- start app
  ```sh
  pnpm start
  ```

## Authentication
- **Session-based** with Redis storage
- **Signup**: creates new user with password hashed with bcrypt
- **Login**: validates credentials, creates session in Redis with an expiry time
- **Logout**: deletes session cookie and session from Redis
- Protected routes verify session from cookie via Authorization header

## Database Schema
- **users**: id, fullName, email, password (hashed), role (user/admin), image, timestamps
- **properties**: id, title, description, price, currency, area, address, city, country, bedroom/kitchen/bathroom/livingroom counts, favouriteCount, ownerId (FK), coverImage, images[], timestamps
- **favourites**: id, propertyId (FK), userId (FK), favouritedAt - unique constraint on (userId, propertyId)
