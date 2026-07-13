# Student Management System

A full-stack student management system built with **React (Vite)** on the frontend and **Spring Boot** on the backend.

## Project Structure

```
studentdb_frontend/
├── student-management-ui/      # React + Vite frontend
└── student_management_system/  # Spring Boot backend
```

## Backend — Spring Boot

**Tech stack:** Java 17, Spring Boot, Spring Data JPA, MySQL, Lombok

### Setup

1. Create MySQL database:
   ```sql
   CREATE DATABASE student_management;
   ```

2. Copy the config template and fill in your credentials:
   ```bash
   cp student_management_system/src/main/resources/application.properties.example \
      student_management_system/src/main/resources/application.properties
   ```

3. Run the backend:
   ```bash
   cd student_management_system
   ./mvnw spring-boot:run
   ```

The API runs on `http://localhost:8080`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students (supports `?name=` and `?department=` filters) |
| GET | `/students/{id}` | Get student by USN |
| POST | `/students` | Register new student |
| PUT | `/students` | Update student |
| DELETE | `/students/{id}` | Delete student |

## Frontend — React + Vite

**Tech stack:** React 19, Vite, Axios

### Setup

```bash
cd student-management-ui
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

> Make sure the Spring Boot backend is running before starting the frontend.

## Student Schema

| Field | Type | Constraints |
|-------|------|-------------|
| usn | Integer | Primary key, required |
| name | String | 2–50 characters |
| department | String | Required |
| gender | String | Required |
| email | String | Valid email format |
| phoneNumber | String | Exactly 10 digits |
| cgpa | Double | 0.0 – 10.0 |
