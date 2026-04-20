# 🎵 Music API — Capstone Project

A RESTful API for managing a music library built with **Node.js**, **TypeScript**, and **Express**, backed by **Firebase Firestore**. Supports artists, albums, and songs with file upload capabilities for MP3, M4A, and MP4 files.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [File Uploads](#file-uploads)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## Overview

This API powers a music library application with full CRUD operations for artists, albums, and songs. It includes:

- Firebase Authentication with role-based access control
- Media file uploads with MIME type and magic bytes validation
- Swagger/ReDoc API documentation
- Helmet security headers and CORS configuration
- Centralized error handling

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js v22 | Runtime |
| TypeScript v5 | Language |
| Express v5 | Web framework |
| Firebase Admin SDK | Firestore database + Auth |
| Multer | File upload handling |
| file-type | Magic bytes validation |
| Joi | Request validation |
| Swagger / ReDoc | API documentation |
| Helmet | Security headers |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A Firebase project with Firestore enabled
- A Firebase service account key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rrc-w2025-kstrange/Capstone_Project_BE_Kyra_Strange.git
cd Capstone_Project_BE_Kyra_Strange
```

2. **Install dependencies**
```bash
npm install
```

3. **Add your Firebase service account key**

Download your service account key from the Firebase console:
- Go to **Project Settings** → **Service Accounts** → **Generate new private key**
- Save the downloaded file as `src/config/servicekey.json`

> Never commit `servicekey.json` to version control. It is listed in `.gitignore`.

4. **Set up environment variables**

Create a `.env` file in the project root:
```dotenv
NODE_ENV=development
PORT=3000
FIREBASE_API_KEY=your_firebase_web_api_key
SWAGGER_SERVER_URL=http://localhost:3000/api/v1
```

5. **Create the uploads folder**
```bash
mkdir uploads
```

6. **Start the development server**
```bash
npm run start
```

The server will be running at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the server runs on (default: 3000) |
| `FIREBASE_API_KEY` | Firebase Web API key (used for sign-in) |
| `SWAGGER_SERVER_URL` | Base URL shown in Swagger docs |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins (production only) |

---

## API Endpoints

### Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health` | None | Check server status |

### Artists
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/artists` | None | Get all artists |
| GET | `/api/v1/artists/:id` | None | Get artist by ID |
| POST | `/api/v1/artists` | Admin | Create artist |
| PUT | `/api/v1/artists/:id` | Admin | Update artist |
| DELETE | `/api/v1/artists/:id` | Admin | Delete artist |

### Albums
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/albums` | None | Get all albums |
| GET | `/api/v1/albums/:id` | None | Get album by ID |
| POST | `/api/v1/albums` | Admin | Create album |
| PUT | `/api/v1/albums/:id` | Admin | Update album |
| DELETE | `/api/v1/albums/:id` | Admin | Delete album |

### Songs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/songs` | None | Get all songs |
| GET | `/api/v1/songs/:id` | None | Get song by ID |
| POST | `/api/v1/songs` | Admin | Create song |
| PUT | `/api/v1/songs/:id` | Admin | Update song |
| DELETE | `/api/v1/songs/:id` | Admin | Delete song |
| POST | `/api/v1/songs/upload` | Admin | Upload media file |

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/signin` | None | Sign in and get ID token |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/admin/setCustomClaims` | Admin | Set user roles |

---

## Authentication & Authorization

This API uses **Firebase Authentication** with custom claims for role-based access control.

### Signing In

```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

The response includes an `idToken`. Use this token as a Bearer token on protected routes:

```
Authorization: Bearer <idToken>
```

### Roles

| Role | Permissions |
|---|---|
| `admin` | Full access — create, update, delete, upload |
| (no role) | Read-only access to GET endpoints |

### Setting a User Role

An existing admin can assign roles via:

```http
POST /api/v1/admin/setCustomClaims
Authorization: Bearer <admin_idToken>
Content-Type: application/json

{
  "uid": "firebase-user-uid",
  "claims": { "role": "admin" }
}
```

> **Note:** After setting a role, the user must sign in again to receive a new token with the updated claim.

---

## File Uploads

Songs can have an audio or video file linked to them via the upload endpoint.

### Supported Formats

| Format | Max Size |
|---|---|
| `.mp3` | 10MB |
| `.m4a` | 10MB |
| `.mp4` | 300MB |

### Upload Request

```http
POST /api/v1/songs/upload
Authorization: Bearer <admin_idToken>
Content-Type: multipart/form-data

file: <your file>
songId: song_001
```

### Validation Layers

Files pass through three validation layers before being accepted:

1. **Extension check** — only `.mp3`, `.m4a`, `.mp4` are allowed
2. **MIME type check** — the reported MIME type must match the extension
3. **Magic bytes check** — the actual file contents are read to detect spoofed files

If any layer fails, the file is deleted from disk and the request is rejected.

---

## API Documentation

Interactive API documentation is available via Swagger UI when the server is running:

```
http://localhost:3000/api-docs
```

To generate a static ReDoc HTML file:

```bash
npm run generate-docs
```

This outputs a standalone `docs/index.html` file.

---

## Project Structure

```
src/
├── api/
│   └── v1/
│       ├── controllers/     # Route handlers
│       ├── middleware/      # Auth, validation, error handling
│       ├── models/          # DTOs and request models
│       ├── repositories/    # Firestore data access
│       ├── routes/          # Express route definitions
│       └── services/        # Business logic
├── config/                  # Firebase, Swagger, Helmet, CORS config
└── server.ts                # App entry point

uploads/                     # Uploaded media files (not committed)
scripts/                     # Utility scripts (e.g. generate-openapi.ts)
docs/                        # Generated static API docs
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start` | Start the development server |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run generate-docs` | Generate static ReDoc documentation |
| `npm run deploy` | Deploy docs to GitHub Pages |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage report |