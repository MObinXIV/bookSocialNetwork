# Book Social Network

A full-stack social reading app where users can share their book collections, discover books from other readers, borrow and return books, and leave feedback.

This project combines a Java Spring Boot backend with an Angular frontend to create a complete book-sharing experience with JWT-based security, email verification, file uploads, and API-first documentation.

## Overview

Book Social Network is designed for readers who want to:

- manage their own virtual bookshelf
- share books they are willing to lend
- borrow books from other users
- track return workflow approvals
- leave ratings and comments about books
- verify accounts through email activation

## Features

- User registration and account activation via email
- Secure login with JWT authentication
- Book creation and management
- Cover image upload for books
- Borrow and return flow with owner approval
- Returned and borrowed book tracking
- Book feedback and rating collection
- Paginated browsing of books and user activity
- Swagger/OpenAPI API documentation

## Tech Stack

### Backend
- Java 21
- Spring Boot 4
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT for authentication
- Spring Mail + MailDev for email testing
- OpenAPI / Swagger documentation

### Frontend
- Angular 20
- Bootstrap
- Font Awesome
- RxJS

### Local infrastructure
- Docker Compose
- PostgreSQL container
- MailDev container

## Architecture

The project is split into two main applications:

- `bookNetworkApi/` — Spring Boot REST API and business logic
- `book-network-ui/` — Angular client application

Supporting local services:

- `docker-compose.yml` — PostgreSQL and MailDev
- `openapi/openapi.json` — generated API contract used by the frontend
- `uploads/` — uploaded book cover images

## Project Structure

```text
bookSocialNetwork/
├── bookNetworkApi/               # Spring Boot backend
│   ├── src/main/java/            # application source code
│   ├── src/main/resources/       # config and templates
│   ├── pom.xml                  # Maven dependencies and build
│   └── mvnw                     # Maven wrapper
├── book-network-ui/              # Angular frontend
│   ├── src/                     # app source
│   ├── package.json             # npm scripts and dependencies
│   └── README.md               # frontend-specific docs
├── docker-compose.yml           # local PostgreSQL + MailDev setup
├── openapi/                     # generated OpenAPI JSON
├── uploads/                     # uploaded files
├── readme.md                    # project overview
└── .gitignore
```

## Prerequisites

Before you run the project locally, make sure you have:

- Java 21+
- Maven or the included Maven wrapper
- Node.js 20+
- npm
- Docker Desktop or Docker Engine

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MObinXIV/bookSocialNetwork.git
cd bookSocialNetwork
```

### 2. Start the local infrastructure

This starts PostgreSQL and MailDev:

```bash
docker compose up -d
```

Services:

- PostgreSQL: `localhost:5433`
- MailDev UI: `http://localhost:1080`
- MailDev SMTP: `localhost:1025`

### 3. Run the backend API

```bash
cd bookNetworkApi
./mvnw spring-boot:run
```

The API will start with the default application configuration and expose Swagger UI at:

```text
http://localhost:8080/api/v1/swagger-ui/index.html
```

The backend uses the PostgreSQL database configured in `application-dev.yml`, so the container started by Docker must be running first.

### 4. Run the frontend

In a new terminal:

```bash
cd book-network-ui
npm install
npm start
```

Then open:

```text
http://localhost:4200
```

## Default Local URLs

- Frontend: `http://localhost:4200`
- API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/api/v1/swagger-ui/index.html`
- MailDev UI: `http://localhost:1080`

## Key API Areas

The backend exposes endpoints for:

- `auth` — registration, login, account activation
- `books` — book CRUD, sharing, borrowing, return flow, cover uploads
- `feedbacks` — book feedback and ratings

## Development Notes

- The frontend uses generated OpenAPI client code in `book-network-ui/src/app/services`.
- The backend stores uploaded book photos under `uploads/`.
- Email activation links are configured to point to the Angular frontend route for account activation.
- The project is a good example of integrating a Spring Security JWT API with a modern Angular application.

## Status

The project is a working learning/demo application with the core social-book flow implemented. The backend covers authentication, book ownership, borrowing, return handling, and feedback. The Angular app continues to evolve as the frontend experience is refined.

## License

This project does not currently include a license file. If you plan to share or publish it, add an appropriate license before distribution.

