# Ports and Adapters (Hexagonal Architecture) Practice

A simple banking application designed to practice **Hexagonal Architecture (Ports and Adapters)** and **DDD (Domain-Driven Design)** principles, keeping the Core Domain completely decoupled from the Infrastructure layer.

## How to Run

### 1. Spin up the Database
Start the PostgreSQL database container:
```bash
docker compose up -d
```

### 2. Sync the Database Schema
Push the Drizzle ORM schema to the PostgreSQL database:
```bash
npx drizzle-kit push
```

### 3. Start the Application
Install dependencies and run the NestJS server in development mode:
```bash
npm install
npm run start:dev
```
