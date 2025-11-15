# Copilot Instructions - Acquisitions API

## Architecture Overview

This is a Node.js Express API using ES modules with a layered architecture:

- **Entry**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **Auth**: JWT tokens stored in HTTP-only cookies with bcrypt password hashing
- **Validation**: Zod schemas for request validation
- **Logging**: Winston logger integrated throughout

## Import Path System

Uses Node.js imports mapping (see `package.json`). Always use hash imports:

```javascript
import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { users } from '#models/user.model.js';
```

## Key Patterns

### Controller Pattern

Controllers handle validation → service calls → response formatting:

```javascript
// Always validate with Zod first
const validationResult = signupSchema.safeParse(req.body);
if (!validationResult.success) {
  return res.status(400).json({
    errors: 'Validation failed',
    details: formatValidationErrors(validationResult.error),
  });
}
// Call service layer, handle specific errors, log actions
```

### Database Operations

Use Drizzle ORM with proper error handling:

```javascript
// Check existence before operations
const existingUser = db.select().from(users).where(eq(users.email, email)).limit(1);
// Always use .returning() for inserts to get created data
const [newUser] = await db.insert(users).values({...}).returning({...});
```

### Authentication Flow

- JWT tokens signed with user `{id, email, role}`
- Cookies set with security options via `cookies.set(res, 'token', token)`
- Environment-aware secure settings in `cookies.getOptions()`

## Development Commands

```bash
npm run dev           # Development with --watch
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier formatting
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Apply migrations
npm run db:studio     # Open Drizzle Studio
```

## Error Handling Conventions

- Log all errors with context: `logger.error('Signup error', e)`
- Throw specific error messages for business logic
- Use HTTP status codes: 400 (validation), 409 (conflict), 500 (server)
- Never expose internal errors to clients

## Code Style

- ESLint enforces: single quotes, 2-space indents, semicolons
- Prefer arrow functions and const/let over var
- Use async/await, not promises chains
- Always include .js extensions in imports
