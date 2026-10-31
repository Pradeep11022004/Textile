# Aura Textile – Online Textile Shopping Platform

**Aura Textile** is a full-stack textile e-commerce web application developed as a team project. The platform allows customers to explore textile products, browse categories, manage wishlists, place orders, and manage their profiles. It also provides an admin dashboard to manage products, categories, customers, and customer orders.

The application is developed using **React.js, Java Spring Boot, Spring Data JPA, Hibernate, and MySQL**.

---

## Project Information

| Detail | Description |
|---|---|
| Project Name | Aura Textile |
| Project Type | Full-Stack E-Commerce Application |
| Development | Team Project |
| Team Size | 5 Members |
| Frontend | React.js, Vite |
| Backend | Java, Spring Boot |
| Database | MySQL |
| ORM | Hibernate, Spring Data JPA |
| API Architecture | REST APIs |
| Build Tool | Maven |
| API Testing | Postman |

---

## Team Members

This project was developed collaboratively by a team of five members.

| S.No | Team Member |
|---|---|
| 1 | E.Baskar    |
| 2 | Pradeep K   |
| 3 | Bharath     |
| 4 | Sanjay      |
| 5 | Jenish      |

---

## Project Overview

Aura Textile provides an online shopping experience for customers looking for different types of fabrics and textile products.

Customers can browse products, search by name, filter by category, view product details, add products to their wishlist, manage delivery addresses, and place orders.

The application also includes an administrative interface where the store administrator can manage inventory, products, categories, customers, and orders.

---

## Features

### Customer Features

- Customer registration and login.
- Browse available textile products.
- Search products by name.
- Filter products by category.
- View detailed product information.
- Add and remove products from wishlist.
- View personal profile.
- Manage delivery addresses.
- Add, edit, and delete saved addresses.
- View customer orders.
- Track order status.
- Submit and view customer reviews.
- Add products to cart.
- Checkout and place orders using Cash on Delivery.

### Admin Features

- Admin login and dashboard.
- View dashboard statistics.
- View total orders and pending orders.
- View delivered orders.
- View customer information.
- Add new textile products.
- Update existing products.
- Delete products.
- Manage product stock.
- Manage product categories.
- View customer orders.
- Update order status.

### UI/UX Features

- Responsive user interface.
- Modern textile shopping layout.
- Product cards and category sections.
- Navigation and account dropdown.
- Customer and admin-specific navigation.
- Wishlist interaction.
- Mobile-friendly layouts.

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- Fetch API

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate ORM
- RESTful APIs
- Maven

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Eclipse IDE
- Postman
- Git
- GitHub

---

## Application Architecture

The application follows a layered backend architecture.

```text
Aura-Textile/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/textilestore/textile_store/
│           │       ├── config/
│           │       ├── controller/
│           │       ├── dto/
│           │       ├── entity/
│           │       ├── repository/
│           │       └── service/
│           │
│           └── resources/
│               └── application.properties/
│
└── README.md
```

*Note: Update the folder names above if your actual GitHub repository uses a different structure.*

### Backend Architecture

| Layer | Responsibility |
|---|---|
| Controller | Handles HTTP requests and API responses |
| Service | Contains business logic |
| Repository | Communicates with the MySQL database |
| Entity | Represents database tables |
| DTO | Transfers data between application layers |
| Config | Contains application configuration |

---

## Database

The application uses MySQL for persistent data storage.

Main database entities include:

- User
- Product
- Category
- Order
- Wishlist
- Customer Review
- Address

The relationships between entities are managed using Spring Data JPA and Hibernate.

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following software:

- Java JDK 21
- Node.js and npm
- MySQL Server
- Maven
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd Aura-Textile
```

### 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE aura_textile;
```

Update your backend `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aura_textile
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use your actual MySQL username and password.

Do not upload real database passwords or other secrets to GitHub.

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will normally run at:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite frontend will normally run at:

```text
http://localhost:5173
```

---

## API Overview

The backend exposes REST APIs for different application modules.

| Module | API Base Path |
|---|---|
| Authentication | `/api/auth` |
| Users | `/api/users` |
| Products | `/api/products` |
| Categories | `/api/categories` |
| Orders | `/api/orders` |
| Wishlist | `/api/wishlist` |
| Reviews | `/api/reviews` |
| Addresses | `/api/addresses` |
| Admin | `/api/admin` |

API endpoints can be tested using Postman.

---

## Future Improvements

- Implement complete server-side authentication and role-based authorization.
- Integrate online payment gateway.
- Improve order tracking.
- Add product image upload functionality.
- Add advanced product filtering and sorting.
- Improve sales analytics and reporting.
- Add automated testing.
- Deploy the frontend and backend to cloud hosting.

---

## Learning Outcomes

Through this project, the team gained practical experience in:

- Full-stack application development.
- React component-based architecture.
- Java and Spring Boot backend development.
- REST API development and integration.
- Database design and entity relationships.
- Spring Data JPA and Hibernate.
- Frontend and backend integration.
- API testing using Postman.
- Git and GitHub collaboration.
- Building a real-world e-commerce application.

---

## Contributors

Developed with collaboration by the Aura Textile project team.

**Project:** Aura Textile – Online Textile Shopping Platform

**Development Year:** 2026