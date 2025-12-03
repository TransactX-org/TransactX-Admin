# API Integration Documentation

This directory contains the API integration layer for the TransactX Admin Dashboard.

## Structure

```
lib/api/
├── client.ts              # Axios client with interceptors
├── types.ts               # TypeScript type definitions
├── services/              # API service functions
│   ├── user.service.ts
│   └── email-template.service.ts
└── hooks/                 # React Query hooks
    ├── use-users.ts
    └── use-email-templates.ts
```

## Setup

1. **Environment Variables**: Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_URL=https://ip-160-187-210-249.my-advin.com/api/v1
   ```

2. **Authentication**: The API client automatically reads the auth token from `localStorage.getItem("auth_token")` and adds it to requests as a Bearer token.

## Usage

### Using React Query Hooks

```tsx
import { useUsers, useUserStats, useUser } from "@/lib/api/hooks/use-users"

function UsersComponent() {
  const { data, isLoading, error } = useUsers(page, perPage)
  const { data: stats } = useUserStats()
  const { data: user } = useUser(userId)
  
  // Access data
  const users = data?.data?.data || []
  const pagination = data?.data || null
}
```

### Using Mutations

```tsx
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/lib/api/hooks/use-users"

function CreateUserForm() {
  const createUser = useCreateUser()
  
  const handleSubmit = async (formData) => {
    await createUser.mutateAsync({
      name: formData.name,
      email: formData.email,
      // ... other fields
    })
  }
}
```

## API Endpoints Implemented

### User Management
- `GET /admin/user-management` - Get all users (paginated)
- `GET /admin/user-management/stats` - Get user statistics
- `GET /admin/user-management/:id` - Get single user
- `POST /admin/user-management` - Create new user
- `PUT /admin/user-management/:id` - Update user (if available)
- `DELETE /admin/user-management/:id` - Delete user (if available)

### Email Templates
- `GET /admin/email-templates` - Get all email templates (paginated)
- `GET /admin/email-templates/:id` - Get single template (if available)

## Error Handling

The API client includes global error handling:
- **401 Unauthorized**: Automatically redirects to `/login` and clears auth token
- **403 Forbidden**: Logs error
- **404 Not Found**: Logs error
- **500 Server Error**: Logs error
- **Network Errors**: Logs error

## React Query Configuration

- **Stale Time**: 5 minutes for most queries
- **Refetch on Window Focus**: Disabled
- **Retry**: 1 attempt
- **DevTools**: Available in development mode

## Type Safety

All API responses are fully typed using TypeScript interfaces defined in `types.ts`. This ensures:
- Type safety across the application
- Better IDE autocomplete
- Compile-time error checking

