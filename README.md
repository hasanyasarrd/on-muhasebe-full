# Accounting Management System

This project is a simple full-stack accounting system designed to manage persons, 
projects, and their financial relationships. It allows tracking of monthly project income,
individual costs, and profit/loss summaries.

## 🛠️ Technologies Used

- **Backend:** Java 17, Spring Boot, JPA/Hibernate, PostgreSQL
- **Frontend:** Angular 16+, HTML, SCSS, TypeScript
- **Build Tools:** Maven, IntelliJ IDEA, Node.js/NPM

## 🔧 Features

- Person & Project CRUD operations
- Assign persons to projects
- Track monthly income and costs
- Display profit/loss summary
- Responsive Angular UI
- CORS-enabled API

## 📁 Project Structure

### Backend (Spring Boot)
- `/src/main/java/com/project/accounting`
    - `controller`: REST APIs for Person, Project, Assignment
    - `entity`: JPA entities
    - `repository`: JPA repositories
    - `service`: Business logic

### Frontend (Angular)
- `/src/app/components`: Angular standalone components (person, project, assignment)
- `/src/app/services`: HTTP service classes
- `/src/app/models`: TypeScript interfaces for models

## 🔌 How to Run

### 1. Backend

cd accounting-backend
./mvnw spring-boot:run
# Runs on http://localhost:8081

### 2. Frontend
cd on-muhasebe-app
npm install
npm run start
# Runs on http://localhost:4200

Example Endpoints
	•	GET /api/persons
	•	POST /api/projects
	•	POST /api/project-persons → Assign person to project
Developer
Hasan Yaşar Demirci Computer Engineering Student

