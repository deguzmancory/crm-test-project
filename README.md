# Developer Setup Guide
This guide provides step-by-step instructions for setting up the development environment, running the application, and troubleshooting common issues.

---
## **Tech Stack**
### **Backend (NestJS)**
- **[NestJS](https://nestjs.com/)** - Backend framework (TypeScript-based)
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[Prisma](https://www.prisma.io/)** - ORM for database management
- **[JWT](https://jwt.io/)** - Authentication and authorization
- **[Passport.js](https://www.passportjs.org/)** - User authentication

### **Frontend (Next.js)**
- **[Next.js](https://nextjs.org/)** - Frontend framework (React-based)
- **[TailwindCSS](https://tailwindcss.com/)** - Styling
- **[Axios](https://axios-http.com/)** - API requests

### **Development Tools**
- **Docker** - Containerization
- **Nodemon** - Backend hot reloading
- **Swagger** - API Documentation

---

## Prerequisites
Before setting up the project, ensure you have the following installed on your machine:
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- [Node.js (v18+) & npm](https://nodejs.org/en/download)

---

1. ### Clone the Repository
```
git clone https://github.com/deguzmancory/crm-test-project.git
cd crm-project
```

2. ### Configure the Environment
- Copy the `.env` file template and update it iwth your values
```
cp .env.example .env
```
- Ensure your `.env` file contains:
```
DATABASE_URL="postgresql://postgres:password@postgres:port_number/database"
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name

JWT_SECRET="your_jwt_secret"
```

3. ### Start the Application
- Run the following command to build and start all services:
```
docker-compose up --build -d
```
This will:
- Start PostgreSQL
- Run Prisma migrations
- Launch NestJS (backend)
- Launch Next.js (frontend)

4. ### Verify Swagger API Documentation
Once the backend is running, open Swagger UI to explore the API:
`localhost:3000/api/docs`

5. ### Running Prisma Migrations
If you need to reset or apply migrations, run:
```
docker exec -it backend sh
npx prisma migrate reset --force
```
This will:
- Drop the database
- Reapply all migrations

6. ### Stopping and Restarting the App
To Stop All Containers
```
docker-compose down
```
To Restart the App
```
docker-compose up -d
```

7. ### Common Issues and Fixes
Changes Not Reflecting in the Backend
Run:
```
docker-compose restart backend
```
Database Errors (`relation "User" does not exist`)
Run:
```
docker exec -it backend sh
npx prisma migrate deploy
```

---

### Final Checklist for Developers
1. Clone the repository
2. Copy `.env.example` and configure environment variables.
3. Run `docker compose up --build -d` to start services.
4. Access Swagger UI at `localhost:3000/api/docs`.
5. Verify hot reloading works (`nodemon` restarts the server on changes)