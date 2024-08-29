---

# SATSQUARE APP
### Description:
SatSquare is a progressive web application (PWA) that is innovative and inclusive, designed to enhance user engagement. By integrating blockchain technology with interactive games, SatSquare offers a unique experience where users can engage in fun activities while contributing to charitable causes.

### Getting Started with SatSquare

This guide explains how to get started with the SatSquare application locally for development, testing environments, and production, with or without Docker.

---

## 1. **Prerequisites**

### A. **Required Tools**
- **Node.js**: Version 16 or higher.
- **NPM**: Typically comes with Node.js.
- **Docker**: For container management (optional if you do not want to use Docker).
- **Git**: For cloning the repository.

### B. **Cloning the Repository**
To begin, clone the SatSquare repository from GitHub using the following commands:
```bash
git clone https://github.com/Ismail-Mouyahada/master-satsquare-app.git
cd master-satsquare-app
```
This repository link points directly to the master branch of your app, ensuring you're working with the latest version.

---

## 2. **Local Startup (Development)**

### A. **Setting up Environment Variables**

Create a file named `.env.local` at the root of the project with the following contents:
```env
POSTGRES_USER=postgres_dev
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=sat_square_dev_db
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
NEXTAUTH_SECRET="your_dev_secret_key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="ws://localhost:5157"
```

### B. **Starting without Docker**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database** (ensure PostgreSQL is running):
   ```bash
   npx prisma migrate dev
   ```

3. **Start the application**:
   ```bash
   npm run all-dev
   ```

### C. **Starting with Docker**

1. **Create a `docker-compose.dev.yml` file** (or use the provided one):
   ```yaml
   version: '3.8'
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.dev
       ports:
         - "3000:3000"
         - "5157:5157"
       env_file:
         - .env.local
       volumes:
         - .:/app
         - /app/node_modules
       command: npm run all-dev

     db:
       image: postgres:13
       environment:
         POSTGRES_USER: postgres_dev
         POSTGRES_PASSWORD: dev_password
         POSTGRES_DB: sat_square_dev_db
       ports:
         - "5432:5432"
   ```

2. **Start the containers**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**: The application will be available at `http://localhost:3000`.

---

Continue this process for testing and production environments as needed, updating paths and environment variables according to your project's requirements.
