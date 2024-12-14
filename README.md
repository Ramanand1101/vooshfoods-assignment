# Vooshfoods API

## Overview

Vooshfoods API is a backend server built with Node.js and Express. It provides RESTful endpoints for managing users, artists, albums, tracks, and favorites in a music application. The application includes user authentication, role-based access control, and database integration using MongoDB.

## Features

- User authentication and authorization
- Role-based access control (Admin, Editor, Viewer)
- CRUD operations for Users, Artists, Albums, Tracks, and Favorites
- Error handling and input validation
- Token-based authentication using JWT
- Pagination and filtering for list endpoints

## Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vooshfoods-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the server at:

   ```
   http://localhost:5000
   ```

## API Endpoints

### Authentication

- **POST** `/api/v1/signup` - Register a new user
  - Request Body:
    ```json
    {
      "email": "example@example.com",
      "password": "securePassword"
    }
    ```
  - Response:
    ```json
    {
      "status": 201,
      "message": "User created successfully."
    }
    ```

- **POST** `/api/v1/login` - User login
  - Request Body:
    ```json
    {
      "email": "example@example.com",
      "password": "securePassword"
    }
    ```
  - Response:
    ```json
    {
      "status": 200,
      "data": {
        "token": "jwt-token"
      },
      "message": "Login successful."
    }
    ```

- **POST** `/api/v1/logout` - Logout a user
  - Response:
    ```json
    {
      "status": 200,
      "message": "User logged out successfully."
    }
    ```

### User Management

- **GET** `/api/v1/users` - List users (Admin only)
  - Query Parameters:
    - `limit`: Number of users to fetch
    - `offset`: Number of users to skip
    - `role`: Filter users by role
  - Response:
    ```json
    {
      "status": 200,
      "data": [
        {
          "user_id": "uuid",
          "email": "example@example.com",
          "role": "Editor"
        }
      ],
      "message": "Users retrieved successfully."
    }
    ```

- **POST** `/api/v1/users/add-user` - Add a new user (Admin only)

- **DELETE** `/api/v1/users/:id` - Delete a user (Admin only)

### Artist Management

- **POST** `/api/v1/artists` - Add an artist
- **GET** `/api/v1/artists` - List all artists
- **PUT** `/api/v1/artists/:id` - Update an artist
- **DELETE** `/api/v1/artists/:id` - Delete an artist

### Album Management

- **POST** `/api/v1/albums` - Add an album
- **GET** `/api/v1/albums` - List all albums
- **PUT** `/api/v1/albums/:id` - Update an album
- **DELETE** `/api/v1/albums/:id` - Delete an album

### Track Management

- **POST** `/api/v1/tracks` - Add a track
- **GET** `/api/v1/tracks` - List all tracks
- **PUT** `/api/v1/tracks/:id` - Update a track
- **DELETE** `/api/v1/tracks/:id` - Delete a track

### Favorites

- **POST** `/api/v1/favorites` - Add a favorite
- **GET** `/api/v1/favorites` - List all favorites
- **DELETE** `/api/v1/favorites/:id` - Remove a favorite

## Middleware

1. **Authentication Middleware**: Protects routes using JWT verification.

   ```javascript
   const { verifyToken } = require("../middleware/auth");
   app.use(verifyToken);
   ```

2. **Error Handling Middleware**: Catches and handles errors globally.

   ```javascript
   app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).json({ message: "Something went wrong", error: err.message });
   });
   ```

## Database

The API uses MongoDB for data persistence. Connection is managed in `./config/db.js`:

```javascript
const mongoose = require("mongoose");
const connection = mongoose.connect(process.env.MONGO_URI);
module.exports = { connection };
```

## How to Contribute

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For questions or feedback, please contact [Your Name/Team] at [Your Email/Contact Information].

