# Book Social Network

A full-stack book-sharing application for readers. Create a bookshelf, share books with the community, borrow books from other readers, manage returns, and leave feedback.

The project has an Angular web client and a Spring Boot REST API backed by PostgreSQL. Email-based account activation is available locally through MailDev.

## Features

- Register an account, activate it by email, and sign in with JWT authentication
- Add and manage books, including uploading cover images
- Browse books shared by other readers
- Borrow books and track borrowed and returned books
- Request a return and let the book owner approve it
- Leave feedback on books
- Browse books and feedback using paginated API endpoints
- Explore the REST API through Swagger UI

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | Angular 20, TypeScript, Bootstrap, RxJS |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Database | PostgreSQL |
| Authentication | JWT |
| Local email | Spring Mail and MailDev |
| API documentation | OpenAPI / Swagger UI |

## Project layout

```text
.
├── book-network-ui/       # Angular application
├── bookNetworkApi/        # Spring Boot REST API
├── openapi/openapi.json   # OpenAPI document used to generate the Angular API client
├── uploads/               # Uploaded files (created/used by the backend)
└── docker-compose.yml     # Local PostgreSQL and MailDev services
```

## Requirements

- Java 21
- Node.js and npm (use a Node.js release supported by Angular 20)
- Docker Desktop or Docker Engine with Docker Compose

The backend includes a Maven wrapper, so a separate Maven installation is not required.

## Run locally

Run each command from the repository root unless it says otherwise.

### 1. Start PostgreSQL and MailDev

```powershell
docker compose up -d
```

The Compose file exposes:

| Service | Local address |
| --- | --- |
| PostgreSQL | `localhost:5433` |
| MailDev web inbox | `http://localhost:1080` |
| MailDev SMTP | `localhost:1025` |

The development Spring profile connects to this PostgreSQL instance and sends mail to MailDev.

### 2. Start the API

In a new terminal:

```powershell
cd bookNetworkApi
.\mvnw.cmd spring-boot:run
```

The API base URL is `http://localhost:8080/api/v1`. Swagger UI is available at [http://localhost:8080/api/v1/swagger-ui/index.html](http://localhost:8080/api/v1/swagger-ui/index.html).

### 3. Start the web app

In another terminal:

```powershell
cd book-network-ui
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### 4. Activate your account

1. Register from the web app.
2. Open the MailDev inbox at [http://localhost:1080](http://localhost:1080).
3. Open the activation email and follow its link.
4. Sign in, then add a book and mark it as shareable to make it available to other readers.

## Configuration

Local development settings are in:

- `bookNetworkApi/src/main/resources/application.yml` — active profile, API context path, and upload size limit
- `bookNetworkApi/src/main/resources/application-dev.yml` — PostgreSQL, MailDev, JWT, activation URL, and upload directory
- `book-network-ui/src/app/services/api-configuration.ts` — frontend API base URL

The checked-in settings target local development services. Replace development credentials and secrets, and configure appropriate URLs and security settings, before deploying this application outside a local environment.

## API overview

The API is rooted at `/api/v1` and includes:

| Resource | Examples |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/activate-account` |
| Books | `GET /books`, `POST /books`, `POST /books/borrow/{book-id}`, return and sharing operations |
| Feedback | `POST /feedbacks`, `GET /feedbacks/book/{book-id}` |

See Swagger UI for request and response schemas, parameters, and the complete endpoint list.

## Development

### Run backend tests

From `bookNetworkApi/`:

```powershell
.\mvnw.cmd test
```

### Build the frontend

From `book-network-ui/`:

```powershell
npm run build
```

### Run frontend unit tests

From `book-network-ui/`:

```powershell
npm test
```

### Regenerate the Angular API client

The client is generated from `openapi/openapi.json`. From `book-network-ui/`:

```powershell
npm run api-gen
```

Update the OpenAPI document before regenerating if the backend API contract has changed.

## Stopping local services

From the repository root:

```powershell
docker compose down
```

## License

No license file is currently included. Add a license before redistributing this project.
