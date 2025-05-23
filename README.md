# JWT Authentication with Hono and SQLite

This is a simple JWT-based authentication system built with:

- [Hono](https://hono.dev/) for the API framework
- [Bun SQLite](https://bun.sh/docs/api/sqlite) for the database
- JWT for token-based authentication
- HTTP-only cookies for token storage

## Setup

1. Make sure you have [Bun](https://bun.sh/) installed
2. Install dependencies:

    ```bash
    bun install
    ```

3. Set up your environment variables:

    ```bash
    # Create a .env file
    echo "SECRET_KEY=your_secret_key_here" > .env
    ```

## Running the application

```bash
bun run dev
```

## API Routes

### Sign Up

- **URL**: `/api/auth/sign-up`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**: Returns the created user and sets an HTTP-only cookie with the JWT

### Sign In

- **URL**: `/api/auth/sign-in`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**: Returns the user info and sets an HTTP-only cookie with the JWT

### Sign Out

- **URL**: `/api/auth/sign-out`
- **Method**: `POST`
- **Response**: Clears the auth cookie

### Get Current User

- **URL**: `/api/auth/user`
- **Method**: `GET`
- **Authentication**: Required (via JWT cookie or Authorization header)
- **Response**: Returns the current authenticated user's info

## Security Features

- Passwords are hashed using Bun's native password hashing functions
- JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- Tokens expire after 30 days
- Strict CORS and same-site cookie policies
