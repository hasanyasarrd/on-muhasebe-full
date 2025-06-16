# Accounting Management System

A comprehensive full-stack accounting system designed to manage persons, projects, and their financial relationships. The system provides capabilities for tracking monthly project income, individual costs, and generating profit/loss summaries.

## 🚀 Features

- 👥 **Person Management** - Complete CRUD operations for team members
- 📋 **Project Management** - Create and manage projects with income tracking
- 🔗 **Assignment System** - Assign persons to projects with cost tracking
- 💰 **Financial Tracking** - Monthly income and expense management
- 📊 **Reporting** - Profit/loss summary and financial analytics
- 🎨 **Responsive UI** - Modern Angular-based user interface
- 🌐 **REST API** - CORS-enabled backend services
- 🗄️ **Database** - PostgreSQL integration for data persistence

## 🛠️ Technologies

### Backend Stack
- **Java 17** - Programming language
- **Spring Boot** - Application framework
- **JPA/Hibernate** - Object-relational mapping
- **PostgreSQL** - Database management system
- **Maven** - Build automation tool

### Frontend Stack
- **Angular 16+** - Frontend framework
- **TypeScript** - Programming language
- **HTML/SCSS** - Markup and styling
- **Node.js/NPM** - Package management

### Development Tools
- **IntelliJ IDEA** - Integrated development environment
- **Git** - Version control system

## 📁 Project Structure

### Backend (Spring Boot)
```
accounting-backend/
└── src/main/java/com/project/accounting/
    ├── controller/     # REST API controllers
    ├── entity/         # JPA entities (Person, Project, Assignment)
    ├── repository/     # JPA repositories
    └── service/        # Business logic layer
```

### Frontend (Angular)
```
on-muhasebe-app/
└── src/app/
    ├── components/     # Angular standalone components
    │   ├── person/     # Person management
    │   ├── project/    # Project management
    │   └── assignment/ # Person-project assignments
    ├── services/       # HTTP service classes
    └── models/         # TypeScript interfaces
```

## ⚙️ Installation and Setup

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd accounting-backend
   ```

2. **Configure database in `application.properties`:**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/accounting
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

   **Backend URL:** http://localhost:8081

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd on-muhasebe-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run start
   ```

   **Frontend URL:** http://localhost:4200

## 📡 API Endpoints

### Person Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/persons` | List all persons |
| `POST` | `/api/persons` | Create new person |
| `PUT` | `/api/persons/{id}` | Update person |
| `DELETE` | `/api/persons/{id}` | Delete person |

### Project Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create new project |
| `PUT` | `/api/projects/{id}` | Update project |
| `DELETE` | `/api/projects/{id}` | Delete project |

### Assignment Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/project-persons` | List all assignments |
| `POST` | `/api/project-persons` | Assign person to project |
| `PUT` | `/api/project-persons/{id}` | Update assignment |
| `DELETE` | `/api/project-persons/{id}` | Remove assignment |

## 💡 Usage Examples

### Create a Person
```bash
curl -X POST http://localhost:8081/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyCost": 5000
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:8081/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Platform",
    "monthlyIncome": 15000,
    "description": "Online shopping platform development"
  }'
```

### Assign Person to Project
```bash
curl -X POST http://localhost:8081/api/project-persons \
  -H "Content-Type: application/json" \
  -d '{
    "personId": 1,
    "projectId": 1,
    "assignmentDate": "2025-01-01"
  }'
```

## 🔧 Key Features

### Person Management
- ✅ Add, edit, and delete team members
- ✅ Track individual monthly costs
- ✅ View person assignments across projects

### Project Management
- ✅ Create and manage projects
- ✅ Set monthly income targets
- ✅ Monitor project profitability

### Financial Tracking
- ✅ Calculate project costs based on assigned personnel
- ✅ Generate profit/loss reports
- ✅ Track monthly financial performance

## 🗄️ Database Schema

### Core Tables
- **`persons`** - Employee/contractor information
- **`projects`** - Project details and income
- **`project_persons`** - Many-to-many relationship with assignments

## 📝 Development Notes

- CORS configuration enables frontend-backend communication
- PostgreSQL provides production-grade data persistence
- Angular standalone components offer modern, efficient architecture
- RESTful API design ensures scalability and maintainability


