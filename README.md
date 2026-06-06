# Enterprise Expense Management System

A comprehensive full-stack expense management solution designed for enterprises to track, manage, and analyze employee expenses efficiently. Built with React + Vite frontend and Java Spring Boot backend.

## 📋 Project Overview

**Enterprise Expense Management System** is a professional-grade application that helps organizations streamline their expense management process. It provides tools for employees to submit expenses, managers to review and approve them, and administrators to gain insights into spending patterns.

## 🏗️ Project Structure

```
Enterprise-Expense-Management-System/
├── FrontEnd/                     # React + Vite frontend application
│   ├── src/                      # React components and pages
│   ├── public/                   # Static assets
│   ├── package.json              # npm dependencies
│   ├── package-lock.json         # Dependency lock file
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS styling
│   ├── eslint.config.js          # ESLint rules
│   ├── postcss.config.js         # PostCSS configuration
│   ├── index.html                # HTML entry point
│   └── .gitignore                # Git ignore rules
│
├── BackEnd/                      # Java Spring Boot backend
│   └── expenseManagement/
│       ├── src/                  # Java source code
│       ├── .mvn/                 # Maven wrapper
│       ├── .idea/                # IntelliJ IDE config
│       ├── pom.xml               # Maven dependencies
│       ├── uploads/              # File upload directory
│       ├── target/               # Build output
│       ├── env_check.py          # Environment validation
│       ├── rebuild_and_run.py    # Build automation
│       ├── reproduce_error.py    # Error reproduction
│       └── restore_project.py    # Project restoration
│
├── diagnose_env.py               # Environment diagnostics
├── test-register.js              # Registration tests
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library for building interactive interfaces
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript
- **ESLint** - Code quality and style checking

### Backend
- **Java 11+** - Programming language
- **Spring Boot 2.7+** - Microservices framework
- **Spring Data JPA** - Data persistence layer
- **Maven** - Build and dependency management
- **MySQL/MariaDB** - Relational database
- **Hibernate** - ORM framework

### Language Composition
- **JavaScript: 100%** (Primary development language)

## 🚀 Getting Started

### Prerequisites

**Frontend Requirements:**
- Node.js 14+ and npm/yarn
- Modern web browser

**Backend Requirements:**
- Java 11 or higher
- Maven 3.6+
- MySQL 5.7+ or MariaDB
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd FrontEnd

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

**Environment Variables:**
Create a `.env` file in the `FrontEnd` directory:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Expense Management System
```

### Backend Setup

```bash
# Navigate to backend directory
cd BackEnd/expenseManagement

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Build for production
mvn clean package
```

**Database Configuration:**
Update `application.properties` in `src/main/resources/`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_management
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

**Create Database:**
```sql
CREATE DATABASE expense_management;
USE expense_management;
```

## 📁 Key Components

### Frontend Structure
- **Components** - Reusable UI components
- **Pages** - Page-level components
- **Services** - API communication layer
- **Hooks** - Custom React hooks
- **Context** - Global state management
- **Utils** - Helper functions

### Backend Structure
- **Controllers** - REST API endpoints
- **Services** - Business logic
- **Repositories** - Data access layer
- **Models/Entities** - Database entities
- **DTOs** - Data transfer objects
- **Config** - Application configuration

## 📦 Available Scripts

### Frontend

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm test             # Run test suite
npm run lint         # Check code quality
```

### Backend

```bash
mvn clean install         # Install dependencies
mvn spring-boot:run       # Run application
mvn clean package         # Create JAR
mvn test                 # Run tests
mvn rebuild_and_run.py   # Rebuild and run (Python automation)
```

## 🎯 Key Features

### Employee Features
✅ **Expense Submission** - Submit and categorize expenses  
✅ **Receipt Upload** - Attach supporting documents  
✅ **Expense Tracking** - View submission status  
✅ **History** - Access past expense reports  
✅ **Mobile Friendly** - Responsive design  

### Manager Features
✅ **Approval Dashboard** - Review pending expenses  
✅ **Filtering & Sorting** - Find specific expenses  
✅ **Comments & Notes** - Add feedback on submissions  
✅ **Batch Approvals** - Process multiple expenses  
✅ **Reports** - View team spending patterns  

### Admin Features
✅ **User Management** - Create and manage accounts  
✅ **Category Management** - Define expense categories  
✅ **Policy Configuration** - Set expense limits  
✅ **Analytics** - Comprehensive spending analytics  
✅ **Audit Logs** - Track all system activities  

## 🔌 API Endpoints

### Expense Management
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/{id}` - Get expense details
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Approval Workflow
- `GET /api/expenses/pending` - Get pending approvals
- `POST /api/expenses/{id}/approve` - Approve expense
- `POST /api/expenses/{id}/reject` - Reject expense

### User Management
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/users` - List users
- `PUT /api/users/{id}` - Update user profile

### File Upload
- `POST /api/upload` - Upload receipt/document
- `GET /api/uploads/{id}` - Download file

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts (employees, managers, admins)
- **expenses** - Expense records
- **categories** - Expense categories
- **approvals** - Approval workflow tracking
- **files** - Uploaded documents/receipts
- **audit_logs** - System activity tracking

## 🔐 Security Features

- **Role-Based Access Control (RBAC)** - Three-tier user roles
- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - Bcrypt password hashing
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request control
- **Audit Logging** - Track all modifications

## 📊 Configuration

### Frontend Configuration
- **Port**: 5173 (Vite default)
- **Hot Module Replacement**: Enabled
- **Environment**: Development/Production

### Backend Configuration
- **Port**: 8080 (Spring Boot default)
- **Context Path**: `/api`
- **Database**: MySQL/MariaDB

### Utility Scripts

**Environment Check** (`env_check.py`):
```bash
python BackEnd/expenseManagement/env_check.py
```

**Rebuild and Run** (`rebuild_and_run.py`):
```bash
python BackEnd/expenseManagement/rebuild_and_run.py
```

**Restore Project** (`restore_project.py`):
```bash
python BackEnd/expenseManagement/restore_project.py
```

## 🐛 Troubleshooting

### Frontend Issues
- **Dependencies conflict**: Clear `node_modules` and reinstall
- **Port 5173 in use**: Change port in `vite.config.js`
- **Build failures**: Check Node.js version compatibility

### Backend Issues
- **Database connection error**: Verify MySQL is running and credentials are correct
- **Port 8080 in use**: Change `server.port` in `application.properties`
- **Maven build failure**: Run `mvn clean install -DskipTests`

### Common Solutions
- Run `diagnose_env.py` to check environment setup
- Check logs in `BackEnd/expenseManagement/target/`
- Verify all environment variables are set
- Ensure both frontend and backend services are running

## 📝 Testing

### Frontend Testing
```bash
npm test                 # Run tests
npm run test:watch     # Watch mode
```

### Backend Testing
```bash
mvn test                # Run all tests
mvn test -Dtest=TestClass  # Run specific test
```

### API Testing
Use `test-register.js` for testing user registration endpoint:
```bash
node test-register.js
```

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source. Check the repository for license details.

## 👨‍💻 Developer Information

**Repository Owner**: Pallabis52  
**Repository**: Enterprise-Expense-Management-System  
**Created**: February 8, 2025  
**Last Updated**: March 2, 2026  
**Open Issues**: 1

## 📞 Support & Documentation

For assistance:
1. Check existing issues and documentation
2. Review troubleshooting section above
3. Open a new GitHub issue with detailed information
4. Include environment details and error logs

## 🎯 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Advanced expense analytics with charts
- [ ] Multi-currency support
- [ ] Email notifications and reminders
- [ ] Integration with accounting software
- [ ] Budget forecasting and alerts
- [ ] Payment gateway integration
- [ ] Two-factor authentication
- [ ] Real-time notifications
- [ ] Advanced reporting features

## 📈 Project Statistics

- **Repository Size**: ~11.8 MB
- **Primary Language**: JavaScript
- **Created**: February 2025
- **Last Push**: March 2026

---

**Start managing expenses efficiently! 🚀**

For more information, visit the [GitHub repository](https://github.com/Pallabis52/Enterprise-Expense-Management-System).
