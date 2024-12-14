# Vooshfoods API

## Overview

The **Vooshfoods API** is a backend server built with **Node.js** and **Express**. It provides RESTful endpoints for managing users, artists, albums, tracks, and favorites in a music application. The application supports **user authentication**, **role-based access control**, and **MongoDB** integration.

## Features

- **User authentication** and **authorization** via JWT
- **Role-based access control** (Admin, Editor, Viewer)
- CRUD operations for **Users**, **Artists**, **Albums**, **Tracks**, and **Favorites**
- **Error handling** and **input validation**
- **Pagination** and **filtering** for list endpoints

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
  - **Request Body**:
    ```json
    {
      "email": "example@example.com",
      "password": "securePassword"
    }
    ```
  - **Response**:
    ```json
    {
      "status": 201,
      "message": "User created successfully."
    }
    ```

- **POST** `/api/v1/login` - Login a user
  - **Request Body**:
    ```json
    {
      "email": "example@example.com",
      "password": "securePassword"
    }
    ```
  - **Response** (Success):
    ```json
    {
      "status": 200,
      "data": {
        "token": "<jwt_token>"
      },
      "message": "Login successful."
    }
    ```
  - **Response** (Error: Invalid Credentials):
    ```json
    {
      "status": 400,
      "message": "Bad Request, Reason: Invalid Credentials"
    }
    ```

- **POST** `/api/v1/logout` - Logout a user and invalidate the token
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Response**:
    ```json
    {
      "status": 200,
      "message": "User logged out successfully."
    }
    ```

### User Management

- **GET** `/api/v1/users` - Retrieve a list of users (Admins only)
  - **Query Parameters**:
    - `limit`: Number of users per page (default: 5)
    - `offset`: Pagination offset (default: 0)
    - `role`: Filter by user role (optional)
  - **Response**:
    ```json
    {
      "status": 200,
      "data": [
        {
          "user_id": "unique_user_id",
          "email": "user@example.com",
          "role": "Admin"
        }
      ],
      "message": "Users retrieved successfully."
    }
    ```

- **POST** `/api/v1/users/add-user` - Add a new user (Admins only)
  - **Request Body**:
    ```json
    {
      "email": "newuser@example.com",
      "password": "securePassword",
      "role": "Editor"
    }
    ```
  - **Response**:
    ```json
    {
      "status": 201,
      "message": "User created successfully."
    }
    ```

- **DELETE** `/api/v1/users/:id` - Delete a user (Admins only)
  - **Response**:
    ```json
    {
      "status": 200,
      "message": "User deleted successfully."
    }
    ```

- **PUT** `/api/v1/users/update-password` - Update a user's password
  - **Request Body**:
    ```json
    {
      "old_password": "oldSecurePassword",
      "new_password": "newSecurePassword"
    }
    ```
  - **Response**:
    ```json
    {
      "status": 204,
      "message": "Password updated successfully."
    }
    ```

### Error Handling

- **400 Bad Request** - Invalid or missing input data (e.g., missing fields)
- **401 Unauthorized** - Unauthorized access (e.g., invalid token or insufficient permissions)
- **403 Forbidden** - Forbidden action (e.g., trying to delete an admin user)
- **404 Not Found** - Resource not found (e.g., user not found)
- **500 Internal Server Error** - General server error

---
Here is the updated documentation that includes the routes you provided:

---

## Artist API 

### Overview

This API provides endpoints for managing artists, including retrieving, adding, updating, and deleting artist records. All routes are protected by authentication, ensuring only authorized users can access or modify artist data.

### Routes

---

### 1. **GET /artists**
- **Description**: Retrieves a list of artists with optional filters and pagination.
- **Method**: `GET`
- **Query Parameters**:
  - `limit`: (optional) The number of artists to retrieve. Default is `5`.
  - `offset`: (optional) The pagination offset. Default is `0`.
  - `grammy`: (optional) Filters artists who have won a Grammy (`true`/`false`).
  - `hidden`: (optional) Filters artists who are hidden (`true`/`false`).
- **Response**:
  - **Status 200**: Returns the list of artists.
  - **Status 400**: Bad request (e.g., invalid query parameters).
  - **Status 401**: Unauthorized (if the token is missing or invalid).
  - **Status 500**: Internal Server Error (if a server error occurs).
- **Example**:
  ```json
  {
    "status": 200,
    "data": [
      {
        "artist_id": "605c72ef1532073f3fc1b9b4",
        "name": "Artist Name",
        "grammy": true,
        "hidden": false
      }
    ],
    "message": "Artists retrieved successfully.",
    "error": null
  }
  ```

---

### 2. **GET /artists/:id**
- **Description**: Retrieves a single artist by ID.
- **Method**: `GET`
- **URL Params**:
  - `id`: The ID of the artist to retrieve.
- **Response**:
  - **Status 200**: Returns the artist data.
  - **Status 404**: Artist not found.
  - **Status 403**: Forbidden access (if the user is not authorized to view the artist).
  - **Status 400**: Bad request (invalid request parameters).
- **Example**:
  ```json
  {
    "status": 200,
    "data": {
      "artist_id": "605c72ef1532073f3fc1b9b4",
      "name": "Artist Name",
      "grammy": true,
      "hidden": false
    },
    "message": "Artist retrieved successfully.",
    "error": null
  }
  ```

---

### 3. **POST /artists/add-artist**
- **Description**: Adds a new artist to the system.
- **Method**: `POST`
- **Request Body**:
  - `name`: (required) The name of the artist.
  - `grammy`: (required) Boolean value indicating if the artist has won a Grammy.
  - `hidden`: (required) Boolean value indicating if the artist is hidden.
- **Response**:
  - **Status 201**: Artist successfully created.
  - **Status 400**: Bad request (e.g., missing or invalid fields).
  - **Status 500**: Internal Server Error.
- **Example**:
  ```json
  {
    "status": 201,
    "data": null,
    "message": "Artist created successfully.",
    "error": null
  }
  ```

---

### 4. **PUT /artists/:id**
- **Description**: Updates an existing artist by ID.
- **Method**: `PUT`
- **URL Params**:
  - `id`: The ID of the artist to update.
- **Request Body**: 
  - Any of the artist's fields can be updated (e.g., `name`, `grammy`, `hidden`).
- **Response**:
  - **Status 200**: Artist successfully updated.
  - **Status 404**: Artist not found.
  - **Status 400**: Bad request (invalid or missing parameters).
- **Example**:
  ```json
  {
    "status": 200,
    "data": {
      "artist_id": "605c72ef1532073f3fc1b9b4",
      "name": "Updated Artist Name",
      "grammy": true,
      "hidden": false
    },
    "message": "Artist updated successfully.",
    "error": null
  }
  ```

---

### 5. **DELETE /artists/:id**
- **Description**: Deletes an artist by ID.
- **Method**: `DELETE`
- **URL Params**:
  - `id`: The ID of the artist to delete.
- **Response**:
  - **Status 200**: Artist successfully deleted.
  - **Status 404**: Artist not found.
  - **Status 400**: Bad request (invalid ID or other errors).
- **Example**:
  ```json
  {
    "status": 200,
    "data": {
      "artist_id": "605c72ef1532073f3fc1b9b4"
    },
    "message": "Artist: Artist Name deleted successfully.",
    "error": null
  }
  ```

---

### Authentication

- **Authentication Middleware**: All routes are protected by the `verifyToken` middleware, which ensures that users are authenticated before accessing the data.
- **Authorization**: Specific routes, such as retrieving or modifying an artist, may require additional role-based authorization checks. For example, only users with the role `Editor` or the artist's owner can modify or view specific artist details.

### Error Handling

- **400 Bad Request**: Returned for invalid query parameters, missing fields, or other client-side errors.
- **401 Unauthorized**: If the request is missing a valid authentication token or if the token is invalid.
- **403 Forbidden**: If the user does not have permission to access or modify the requested resource.
- **404 Not Found**: If the requested artist does not exist.
- **500 Internal Server Error**: For unexpected errors on the server side.

---
Here is the updated version of your documentation with the album-related routes included:

---

## Album API 

### Overview

This API provides endpoints for managing albums, including retrieving, adding, updating, and deleting album records. All routes are protected by authentication, ensuring only authorized users can access or modify album data.

### Routes

---

### 1. **GET /albums**
- **Description**: Retrieves a list of albums with optional filters (artist_id, hidden), pagination (limit, offset), and sorting.
- **Method**: `GET`
- **Query Parameters**:
  - `limit`: (optional) The number of albums to retrieve. Default is `5`.
  - `offset`: (optional) The pagination offset. Default is `0`.
  - `artist_id`: (optional) Filters albums by artist.
  - `hidden`: (optional) Filters albums based on visibility (`true`/`false`).
- **Response**:
  - **Status 200**: Returns the list of albums.
  - **Status 400**: Bad request (e.g., invalid query parameters).
  - **Status 401**: Unauthorized (if the token is missing or invalid).
  - **Status 500**: Internal Server Error (if a server error occurs).
- **Example**:
  ```json
  {
    "status": 200,
    "data": [
      {
        "album_id": "605c72ef1532073f3fc1b9b4",
        "name": "Album Name",
        "artist_id": "605c72ef1532073f3fc1b9b4",
        "year": 2020,
        "hidden": false
      }
    ],
    "message": "Albums retrieved successfully.",
    "error": null
  }
  ```

---

### 2. **GET /albums/:id**
- **Description**: Retrieves a specific album by ID.
- **Method**: `GET`
- **URL Params**:
  - `id`: The ID of the album to retrieve.
- **Response**:
  - **Status 200**: Returns the album data.
  - **Status 404**: Album not found.
  - **Status 403**: Forbidden access (if the user is not authorized to view the album).
  - **Status 400**: Bad request (invalid request parameters).
- **Example**:
  ```json
  {
    "status": 200,
    "data": {
      "album_id": "605c72ef1532073f3fc1b9b4",
      "name": "Album Name",
      "artist_id": "605c72ef1532073f3fc1b9b4",
      "year": 2020,
      "hidden": false
    },
    "message": "Album retrieved successfully.",
    "error": null
  }
  ```

---

### 3. **POST /albums/add-album**
- **Description**: Adds one or more albums to the system.
- **Method**: `POST`
- **Request Body**:
  - `albums`: (required) Array of album objects, each containing:
    - `artist_id`: (required) The ID of the artist.
    - `name`: (required) The name of the album.
    - `year`: (required) The release year of the album.
    - `hidden`: (optional) Boolean value indicating if the album is hidden.
- **Response**:
  - **Status 201**: Albums successfully created.
  - **Status 400**: Bad request (missing or invalid fields in the albums array).
  - **Status 500**: Internal Server Error.
- **Example**:
  ```json
  {
    "status": 201,
    "data": [
      {
        "album_id": "605c72ef1532073f3fc1b9b4",
        "name": "Album Name",
        "artist_id": "605c72ef1532073f3fc1b9b4",
        "year": 2020,
        "hidden": false
      }
    ],
    "message": "1 album created successfully.",
    "error": null
  }
  ```

---

### 4. **PUT /albums/:id**
- **Description**: Updates an existing album by ID.
- **Method**: `PUT`
- **URL Params**:
  - `id`: The ID of the album to update.
- **Request Body**:
  - `name`: (optional) The updated name of the album.
  - `year`: (optional) The updated release year.
  - `hidden`: (optional) The updated visibility status of the album.
- **Response**:
  - **Status 200**: Album successfully updated.
  - **Status 404**: Album not found.
  - **Status 400**: Bad request (invalid or missing parameters).
- **Example**:
  ```json
  {
    "status": 204,
    "data": null,
    "message": "Album updated successfully.",
    "error": null
  }
  ```

---

### 5. **DELETE /albums/:id**
- **Description**: Deletes an album by ID.
- **Method**: `DELETE`
- **URL Params**:
  - `id`: The ID of the album to delete.
- **Response**:
  - **Status 200**: Album successfully deleted.
  - **Status 404**: Album not found.
  - **Status 400**: Bad request (invalid ID or other errors).
- **Example**:
  ```json
  {
    "status": 200,
    "data": null,
    "message": "Album: Album Name deleted successfully.",
    "error": null
  }
  ```

---

### Authentication

- **Authentication Middleware**: All routes are protected by the `verifyToken` middleware, which ensures that users are authenticated before accessing the data.
- **Authorization**: Specific routes, such as retrieving or modifying an album, may require additional role-based authorization checks. For example, only users with the role `Editor` or the album's owner can modify or view specific album details.

### Error Handling

- **400 Bad Request**: Returned for invalid query parameters, missing fields, or other client-side errors.
- **401 Unauthorized**: If the request is missing a valid authentication token or if the token is invalid.
- **403 Forbidden**: If the user does not have permission to access or modify the requested resource.
- **404 Not Found**: If the requested album does not exist.
- **500 Internal Server Error**: For unexpected errors on the server side.

---

Let me know if you need further adjustments!
Here is the full API documentation for your `trackRouter` with the requested updates.

---

## Track API 

### Base URL
```
/api
```

This API provides CRUD operations for **Track** resources, such as creating, updating, deleting, and retrieving tracks. All routes are protected by JWT authentication middleware `verifyToken`.

### Routes

---

#### 1. **Get All Tracks**
- **URL:** `/api/tracks`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)
- **Query Parameters:**
  - `limit`: (Optional) The number of tracks to retrieve per request. Default is 5.
  - `offset`: (Optional) The starting index of tracks to retrieve. Default is 0.
  - `artist_id`: (Optional) Filter tracks by artist's ID.
  - `album_id`: (Optional) Filter tracks by album's ID.
  - `hidden`: (Optional) Filter tracks by their visibility status. Accepts `'true'` or `'false'`.

- **Response (200 OK):**
```json
{
  "status": 200,
  "data": [
    {
      "track_id": "UUID",
      "artist_id": "artist_id",
      "album_id": "album_id",
      "name": "Track Name",
      "duration": "Track Duration",
      "hidden": false
    }
  ],
  "message": "Tracks retrieved successfully.",
  "error": null
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "Error fetching tracks.",
  "error": "Error details"
}
```

---

#### 2. **Get Track by ID**
- **URL:** `/api/tracks/:id`
- **Method:** `GET`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `id`: The unique ID of the track to retrieve.

- **Response (200 OK):**
```json
{
  "status": 200,
  "data": {
    "track_id": "UUID",
    "artist_id": "artist_id",
    "album_id": "album_id",
    "name": "Track Name",
    "duration": "Track Duration",
    "hidden": false
  },
  "message": "Track retrieved successfully.",
  "error": null
}
```

- **Response (Error - 404 Not Found):**
```json
{
  "status": 404,
  "message": "Resource doesn't exist.",
  "error": null
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "Error fetching track.",
  "error": "Error details"
}
```

---

#### 3. **Create a New Track**
- **URL:** `/api/tracks/add-track`
- **Method:** `POST`
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "artist_id": "artist_id",
    "album_id": "album_id",
    "name": "Track Name",
    "duration": "Track Duration",
    "hidden": false
  }
  ```
  - `artist_id`: (Required) The ID of the artist.
  - `album_id`: (Required) The ID of the album.
  - `name`: (Required) The name of the track.
  - `duration`: (Required) The duration of the track in seconds or minutes.
  - `hidden`: (Optional) Boolean indicating whether the track is hidden or not (default is `false`).

- **Response (201 Created):**
```json
{
  "status": 201,
  "message": "Track created successfully.",
  "error": null
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "All fields are required."
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "Error adding track.",
  "error": "Error details"
}
```

---

#### 4. **Update Track**
- **URL:** `/api/tracks/:id`
- **Method:** `PUT`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `id`: The unique ID of the track to update.

- **Request Body:**
  ```json
  {
    "name": "New Track Name",
    "duration": "New Track Duration",
    "hidden": true
  }
  ```
  - `name`: (Optional) The updated name of the track.
  - `duration`: (Optional) The updated duration of the track.
  - `hidden`: (Optional) The updated visibility status of the track.

- **Response (204 No Content):**
```json
{
  "status": 204,
  "message": "Track updated successfully.",
  "error": null
}
```

- **Response (Error - 404 Not Found):**
```json
{
  "status": 404,
  "message": "Resource doesn't exist.",
  "error": null
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "Error updating track.",
  "error": "Error details"
}
```

---

#### 5. **Delete Track**
- **URL:** `/api/tracks/:id`
- **Method:** `DELETE`
- **Authentication:** Required (JWT Token)
- **URL Parameters:**
  - `id`: The unique ID of the track to delete.

- **Response (200 OK):**
```json
{
  "status": 200,
  "message": "Track: Track Name deleted successfully.",
  "error": null
}
```

- **Response (Error - 404 Not Found):**
```json
{
  "status": 404,
  "message": "Resource doesn't exist.",
  "error": null
}
```

- **Response (Error - 400 Bad Request):**
```json
{
  "message": "Error deleting track.",
  "error": "Error details"
}
```

---

### Error Handling

- **400 Bad Request:** The request is malformed or missing required data.
- **404 Not Found:** The requested resource was not found.
- **500 Internal Server Error:** An unexpected error occurred on the server.

### Authentication
All routes require a valid **JWT** token to be passed in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

---

### Notes:
- **UUID Generation:** For `track_id`, you need to use a UUID generator in your backend code.
- **Error Details:** Each error response includes detailed information about what went wrong.

This documentation outlines all CRUD operations on tracks, ensuring proper data validation and clear error responses when something goes wrong.

Here's the documentation for the `favoriteRouter` with all necessary details for the routes and operations:

---

### **Favorites API**

This set of routes handles managing user favorites, including retrieving, adding, and removing favorite items.

---

### **1. GET /favorites/:category**

Retrieve the list of favorite items for a specific category.

- **URL**: `/favorites/:category`
- **Method**: `GET`
- **Parameters**:
  - `category`: The category of the items to retrieve favorites for (e.g., "electronics", "books").
- **Query Parameters**:
  - `limit`: (Optional) The number of items to retrieve. Defaults to `5`.
  - `offset`: (Optional) The number of items to skip (for pagination). Defaults to `0`.
- **Authentication**: Requires a valid token passed via the `Authorization` header.
  
**Response**:
- **Status Code**: `200 OK`
- **Body**: 
  ```json
  {
    "status": 200,
    "data": [ /* Array of favorite items */ ],
    "message": "Favorites retrieved successfully.",
    "error": null
  }
  ```

- **Error Response**:
  - **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "status": 400,
      "message": "Bad Request",
      "error": "Error message here"
    }
    ```

---

### **2. POST /favorites/add-favorite**

Add a new item to the user's favorites.

- **URL**: `/favorites/add-favorite`
- **Method**: `POST`
- **Request Body**:
  - `category`: (String) The category of the item (e.g., "electronics").
  - `item_id`: (String) The unique identifier of the item being added to favorites.
  - `name`: (String) The name of the item.
- **Authentication**: Requires a valid token passed via the `Authorization` header.

**Response**:
- **Status Code**: `201 Created`
- **Body**: 
  ```json
  {
    "status": 201,
    "data": null,
    "message": "Favorite added successfully.",
    "error": null
  }
  ```

- **Error Response**:
  - **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "status": 400,
      "message": "Favorite already exists",
      "error": null
    }
    ```

---

### **3. DELETE /favorites/remove-favorite/:id**

Remove a specific item from the user's favorites.

- **URL**: `/favorites/remove-favorite/:id`
- **Method**: `DELETE`
- **Parameters**:
  - `id`: The ID of the favorite item to remove.
- **Authentication**: Requires a valid token passed via the `Authorization` header.

**Response**:
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "status": 200,
    "data": null,
    "message": "Favorite removed successfully.",
    "error": null
  }
  ```

- **Error Response**:
  - **Status Code**: `404 Not Found`
  - **Body**:
    ```json
    {
      "status": 404,
      "message": "Favorite not found",
      "error": null
    }
    ```

- **Error Response**:
  - **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "status": 400,
      "message": "Bad Request",
      "error": "Error message here"
    }
    ```

---

### **Middleware for Authentication**

- **Middleware**: `verifyToken`
  - The `verifyToken` middleware checks if the request contains a valid authentication token in the `Authorization` header.
  - The token is used to identify the user, and the user ID is attached to the request object (`req.user.id`), allowing access to the user's favorites.

---

### **Example Usage**

#### **1. Retrieving Favorites for a Category**

```bash
GET /favorites/electronics?limit=10&offset=0
```

**Response**:
```json
{
  "status": 200,
  "data": [
    {
      "item_id": "123",
      "name": "Laptop",
      "category": "electronics",
      "user_id": "456"
    }
  ],
  "message": "Favorites retrieved successfully.",
  "error": null
}
```

#### **2. Adding a Favorite Item**

```bash
POST /favorites/add-favorite
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "category": "electronics",
  "item_id": "123",
  "name": "Laptop"
}
```

**Response**:
```json
{
  "status": 201,
  "data": null,
  "message": "Favorite added successfully.",
  "error": null
}
```

#### **3. Removing a Favorite Item**

```bash
DELETE /favorites/remove-favorite/123
Authorization: Bearer <your-token>
```

**Response**:
```json
{
  "status": 200,
  "data": null,
  "message": "Favorite removed successfully.",
  "error": null
}
```

---


This documentation is now aligned with the functionality in your code, providing an overview, prerequisites, and details of each API endpoint. Let me know if you need any additional modifications!
