# Steganos Core API

A secure Node.js and TypeScript REST API for user authentication and image steganography. The API allows authenticated users to hide structured JSON data inside PNG images and later extract that data using Least Significant Bit (LSB) steganography.

---

## Features

### Authentication System

* User registration
* User login
* JWT access token authentication
* Refresh token rotation
* Secure HTTP-only cookie storage
* User profile retrieval
* Logout functionality

### Steganography System

* Encode JSON payloads into PNG images
* Decode hidden data from PNG images
* LSB (Least Significant Bit) image steganography
* PNG-only upload validation
* Image size validation
* Memory-based file processing (no filesystem storage)

### Security Features

* Password hashing with bcrypt
* JWT access and refresh token strategy
* Refresh token rotation
* Protected routes
* CORS protection
* Cookie-based authentication support
* Input validation
* Upload restrictions

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB
* Mongoose

## Authentication

* JWT (JSON Web Tokens)
* bcrypt

## File Processing

* Multer
* PNGJS

## Utilities

* Compression
* Cookie Parser
* CORS
* Dotenv

---

# Project Structure

```text
src/
│
├── algo/
│   ├── algo.ts
│   └── complex-query.ts
│
├── config/
│   └── index.ts
│
├── controllers/
│   ├── auth/
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── refresh.ts
│   │   └── register.ts
│   │
│   ├── steg/
│   │   ├── encode.ts
│   │   └── decode.ts
│   │
│   └── user.controller.ts
│
├── middlewares/
│   └── auth.middleware.ts
│
├── model/
│   ├── user.model.ts
│   ├── refresh-token.model.ts
│   └── stegano-message.model.ts
│
├── routes/
│   ├── auth.route.ts
│   ├── steg.route.ts
│   └── users.route.ts
│
├── services/
│   ├── auth/
│   └── steg/
│
├── types/
│
├── util/
│
├── app.ts
├── router.ts
└── server.ts
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/steganos-core-api.git

cd steganos-core-api
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

PORT=5000

MONGO_URI=mongodb://localhost:27017/steganos

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRE_TIME=15m

REFRESH_TOKEN_EXPIRE_TIME=7d

SALTROUNDS=10
```

---

# Running the Application

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

---

# API Endpoints

## Health Check

### Request

```http
GET /health
```

### Response

```json
{
  "status": "success",
  "message": "Steganos Core API Running"
}
```

---

# Authentication Endpoints

Base URL:

```text
/api/auth
```

---

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "termsAndCondition": true
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Account created successfully"
}
```

---

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Login Successful",
  "data": {
    "userId": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "accessToken": "jwt_token"
  }
}
```

### Notes

The API automatically sets a secure refresh token cookie.

---

## Refresh Access Token

### Endpoint

```http
GET /api/auth/refresh
```

### Requirements

* Valid refresh token cookie

### Response

```json
{
  "status": "success",
  "message": "REFRESH_SUCCESS",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

---

## Logout

### Endpoint

```http
POST /api/auth/logout
```

### Response

```json
{
  "status": "success",
  "message": "Logout Successful"
}
```

---

# User Endpoints

All user endpoints require a valid access token.

Base URL:

```text
/api/users
```

---

## Get Current User

### Endpoint

```http
GET /api/users/me
```

### Response

```json
{
  "status": "success",
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

# Steganography Endpoints

All steganography endpoints require authentication.

Base URL:

```text
/api/steg
```

---

## Encode Data Into Image

### Endpoint

```http
POST /api/steg/encode
```

### Content Type

```text
multipart/form-data
```

### Form Fields

| Field          | Type      | Required |
| -------------- | --------- | -------- |
| image          | PNG File  | Yes      |
| payload fields | JSON Data | Yes      |

### Example

```json
{
  "message": "Hello World",
  "sender": "John"
}
```

### Response

Returns a PNG image containing the embedded payload.

```http
Content-Type: image/png
```

---

## Decode Data From Image

### Endpoint

```http
POST /api/steg/decode
```

### Content Type

```text
multipart/form-data
```

### Form Fields

| Field | Type     |
| ----- | -------- |
| image | PNG File |

### Response

```json
{
  "status": "success",
  "message": "Steg-image decoded successfully",
  "data": {
    "message": "Hello World",
    "sender": "John"
  }
}
```

---

# Authentication Flow

```text
Register
   ↓
Login
   ↓
Receive Access Token
   ↓
Access Protected Routes
   ↓
Access Token Expires
   ↓
Refresh Token Endpoint
   ↓
Receive New Access Token
```

---

# File Upload Restrictions

| Rule           | Value  |
| -------------- | ------ |
| Allowed Format | PNG    |
| Storage Type   | Memory |
| Max Size       | 10 MB  |
| Multiple Files | No     |

---

# Error Responses

### Unauthorized

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

### Invalid Credentials

```json
{
  "status": "error",
  "message": "Invalid Credentials"
}
```

### Invalid Image Type

```json
{
  "status": "error",
  "message": "Invalid Image format. Allowed format is PNG"
}
```

### Missing Image

```json
{
  "status": "error",
  "message": "No Image Uploaded"
}
```

### Payload Empty

```json
{
  "status": "error",
  "message": "Payload cannot be empty"
}
```

---

# Security Considerations

* Passwords are hashed before storage.
* Refresh tokens are stored as hashes.
* Refresh token rotation prevents token replay attacks.
* JWT verification protects private routes.
* Only PNG images are accepted.
* Upload size restrictions help mitigate abuse.
* Sensitive credentials are loaded from environment variables.

---

# Future Improvements

* Email verification
* Password reset workflow
* Role-based authorization (RBAC)
* Audit logging
* Image encryption before embedding
* Batch image processing
* API rate limiting
* OpenAPI/Swagger documentation
* Docker support
* Automated testing pipeline

---

# License

This project is licensed under the MIT License.

---

# Author

Steganos Core API Team

```

A secure authentication and PNG steganography service built with Node.js, Express, TypeScript, MongoDB, and JWT.
```
