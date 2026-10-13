# Book Social Network

A place for readers to share the books they own, borrow from each other, and
say what they thought. I built it to get comfortable with Spring Security,
JWT auth, and the full flow from backend to frontend.

## What it does

- Sign up, confirm your email, log in
- Add books you own, with a cover image
- Borrow and return books, with approval from the owner
- Rate and leave feedback on books
- Browse other readers' shelves

## Status

This is still a work in progress. The backend is mostly done: auth, books,
borrowing and feedback all work and are documented in Swagger. The Angular
frontend is what I'm working on now, so some screens are missing or rough.

**Working**
- Registration, email confirmation, login (JWT)
- Adding and managing books
- Borrow / return flow
- Ratings and feedback

**In progress**
- Some features in the front part still under the test.

## Stack

- Backend: Java 21, Spring Boot, Spring Security (JWT), PostgreSQL
- Frontend: Angular
- Docs: Swagger / OpenAPI
- Other: Docker Compose, MailDev for local emails

## Running it locally

```bash
git clone https://github.com/MObinXIV/bookSocialNetwork.git
cd bookSocialNetwork
docker compose up -d      # database + mail server
```

Then start the API from `book-network/` and open
`http://localhost:<port>/swagger-ui/index.html`.

Activation emails show up in MailDev at `http://localhost:<maildev-port>`.

For the frontend:

```bash
cd book-network-ui
npm install
ng serve
```

