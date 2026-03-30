# Event Management API

## Project Overview

The Event Management API is a RESTful backend service built to manage event data in
a structured and secure way. It allows users to create events, retrieve all events, fetch a specific event by ID, update event details, and delete events when necessary.

This project was developed to demonstrate advanced backend practices including OpenAPI documentation, secure configuration management using environment variables,
custom Helmet.js security configurations, controlled CORS policies, and request
validation using Joi.

The goal of this project was not only to build functional endpoints, but to implement
them following professional API development standards with proper documentation and
security considerations.


---

## Features

- Create new events
- Retrieve all events
- Retrieve a specific event by ID
- Update an existing event
- Delete an event
- Request validation using Joi
- OpenAPI 3.0 documentation with Swagger UI
- Custom Helmet.js security configuration
- Custom CORS configuration
- Environment variable management using dotenv
- Public documentation deployment via GitHub Pages
- Firebase integration
- Logging with Morgan
- Unit & integration testing with Jest

---

## Technologies Used

Runtime Dependencies:

- express
- cors
- dotenv
- helmet
- joi
- morgan
- firebase
- firebase-admin
- swagger-jsdoc
- swagger-ui-express

Development Dependencies

- typescript
- ts-node
- jest
- supertest
- @redocly/cli

---

# Installation Guide

## Prerequisites

- Node.js v22.20.0(LTS)
- npm

You can verify your version with:

```bash
node -v
```

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/rrc-f2024-Aum/JOI_Validation_and_Firestore_Integration
cd JOI_Validation_and_Firestore_Integration
```

The repository contains the following branches:

- main
- development
- feature-security
- gh-pages

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID= /--- paste info from your service account key file ----/
FIREBASE_PRIVATE_KEY= /--- paste info from your service account key file ----/
FIREBASE_CLIENT_EMAIL= /--- paste info from your service account key file ----/
SWAGGER_SERVER_URL=http://localhost:3000/api/v1
```

A `.env` file is provided as a template.

Important:

- Do NOT commit your `.env` file.
- Ensure `.env` is listed in `.gitignore`.

---

## Step 4: Start the Server

```bash
npm run start
```

The server will run at:

```
http://localhost:3000
```

---

# API Endpoints

The API provides the following five endpoints:

- **GET** `/api/v1/events`
- **GET** `/api/v1/events/:id`
- **POST** `/api/v1/events`
- **PUT** `/api/v1/events/:id`
- **DELETE** `/api/v1/events/:id`

---

# API Request Examples

## Get All Events

**GET** `/api/v1/events`

```bash
curl -X GET http://localhost:3000/api/v1/events
```

**Response (200 OK)**

```json
{
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": "1",
      "title": "Tech Conference 2026",
      "description": "Annual developer conference",
      "date": "2026-06-15",
      "location": "Winnipeg"
    }
  ]
}
```

---

## Get Event by ID

**GET** `/api/v1/events/1`

```bash
curl -X GET http://localhost:3000/api/v1/events/1
```

**Response (200 OK)**

```json
{
  "message": "Event retrieved successfully",
  "data": {
    "id": "1",
    "title": "Tech Conference 2026",
    "description": "Annual developer conference",
    "date": "2026-06-15",
    "location": "Winnipeg"
  }
}
```

**Error (404 Not Found)**

```json
{
  "message": "Event not found"
}
```

---

## Create Event

**POST** `/api/v1/events`

```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Startup Meetup",
    "description": "Networking event for founders",
    "date": "2026-09-10",
    "location": "Toronto"
  }'
```

**Response (201 Created)**

```json
{
  "message": "Event created successfully",
  "data": {
    "id": "2",
    "title": "Startup Meetup",
    "description": "Networking event for founders",
    "date": "2026-09-10",
    "location": "Toronto"
  }
}
```

---

## Update Event

**PUT** `/api/v1/events/2`

```bash
curl -X PUT http://localhost:3000/api/v1/events/2 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Startup Meetup 2026",
    "description": "Updated networking event",
    "date": "2026-09-15",
    "location": "Toronto"
  }'
```

**Response (200 OK)**

```json
{
  "message": "Event updated successfully",
  "data": {
    "id": "2",
    "title": "Startup Meetup 2026",
    "description": "Updated networking event",
    "date": "2026-09-15",
    "location": "Toronto"
  }
}
```

---

## Delete Event

**DELETE** `/api/v1/events/2`

```bash
curl -X DELETE http://localhost:3000/api/v1/events/2
```

**Response (200 OK)**

```json
{
  "message": "Event deleted successfully"
}
```

---

# API Documentation

## Public Documentation

Full OpenAPI documentation is available at:

```
https://rrc-f2024-aum.github.io/JOI_Validation_and_Firestore_Integration/
```

---

## Local Documentation

When running locally, access Swagger UI at:

```
http://localhost:3000/api-docs
```

---

# Security Overview

This API implements multiple security best practices:

- Custom Helmet.js configuration for HTTP security headers
- Controlled CORS configuration limiting allowed origins and methods
- Environment variable management using dotenv
- No hardcoded sensitive information
- Joi validation for request bodies

For detailed justification and external references, see:

```
SECURITY.md
```

---

# Environment Variables

All configuration values are managed using environment variables.

Example:

- `PORT`
- `NODE_ENV`

Sensitive values are never stored directly in the source code.

---

# Development & Branching

The repository follows a structured branching workflow:

- main: Production-ready code
- development: Active development integration branch
- feature-security: Feature implementation branch
- gh-pages: Static documentation deployment

Changes are committed with meaningful messages and merged through pull requests.

---

# Author

Aum Mistry  
Back-End Development 3018
