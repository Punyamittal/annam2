# GreenGuardian Authentication System

This document outlines the authentication system implemented for GreenGuardian using Appwrite.

## Overview

GreenGuardian uses Appwrite as its authentication provider. The authentication system includes:

- User registration
- User login
- Password reset functionality
- Protected routes
- User profile management

## Files Structure

```
GreenGuardian/
├── services/
│   └── auth.js                 # Appwrite authentication service
├── contexts/
│   └── AuthContext.js          # React context for authentication state
├── components/
│   ├── Layout.js               # Main layout with navigation
│   ├── Navbar.js               # Navigation bar with auth controls
│   └── ProtectedRoute.js       # Component to protect routes
├── pages/
│   ├── _app.tsx                # App wrapper with AuthProvider
│   ├── login.js                # Login page
│   ├── register.js             # Registration page
│   ├── forgot-password.js      # Password reset request page
│   ├── reset-password.js       # Password reset confirmation page
│   ├── profile.js              # User profile page
│   └── dashboard.js            # User dashboard
```

## Setup

1. Create an Appwrite project at [https://appwrite.io](https://appwrite.io)
2. Set up the following environment variables in your `.env` file:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
```

## Authentication Flow

1. **Registration**:
   - User enters name, email, and password
   - Appwrite creates a new user account
   - User is automatically logged in after registration

2. **Login**:
   - User enters email and password
   - Appwrite validates credentials and creates a session
   - User is redirected to the dashboard

3. **Password Reset**:
   - User requests a password reset by providing their email
   - Appwrite sends a password reset email with a link
   - User clicks the link and sets a new password

4. **Protected Routes**:
   - All routes are protected by the `ProtectedRoute` component
   - Unauthenticated users are redirected to the login page
   - Authentication state is managed by the `AuthContext`

## User Management

- User profiles can be viewed and edited on the profile page
- User data is stored in Appwrite's user management system
- Additional user data can be stored in Appwrite's database

## Security Considerations

- Passwords are securely hashed by Appwrite
- Authentication tokens are managed by Appwrite
- Protected routes ensure only authenticated users can access certain pages
- Password strength validation is implemented on the client side

## Future Enhancements

- Social login (Google, GitHub)
- Two-factor authentication
- Email verification
- Role-based access control
- Session management (view active sessions, log out from other devices)

## Troubleshooting

If you encounter authentication issues:

1. Check that your Appwrite project ID and endpoint are correct in the `.env` file
2. Ensure that authentication is enabled in your Appwrite project settings
3. Check the browser console for any errors
4. Verify that the user exists in the Appwrite dashboard
