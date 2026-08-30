# Brundavan Publications

A full-stack e-commerce website for **Brundavan Publications**, built to showcase and sell preparation books for Jawahar Navodaya Vidyalaya entrance examinations.

The application provides a customer-facing shopping experience with book browsing, medium selection, cart management, UPI payment submission, order placement, and an administrative dashboard for managing books and customer orders.

## Project Overview

Brundavan Publications is a book-publishing and e-commerce platform designed around preparation materials for Navodaya entrance examinations.

The project includes:

* Customer book catalog
* Book detail pages
* Medium selection
* Shopping cart
* Checkout and delivery details
* UPI QR-code payment flow
* UPI transaction/UTR submission
* Order creation
* Stock validation and reduction
* Admin book management
* Admin order management
* Payment status management
* Order status management
* Responsive and glassmorphism-based UI

## Features

### Customer Features

* Browse available preparation books
* View individual book details
* Select preferred medium
* Add books to cart
* Increase or decrease quantities
* Remove items from cart
* View order summary
* Enter delivery information
* Pay through UPI using a QR code
* Submit UPI Transaction ID / UTR
* Place an order
* View order-success information

### Admin Features

* Add books
* Edit book information
* Update prices and discounts
* Update stock
* Configure supported mediums
* Activate and deactivate books
* View customer orders
* View customer contact and shipping details
* View order items and totals
* Update payment status
* Update order status

### Stock Management

New orders are validated against the available stock on the backend.

When an order is successfully created:

```text
Available Stock
      ↓
Validate Requested Quantity
      ↓
Order Accepted
      ↓
Stock Reduced
```

Orders requesting more copies than available are rejected.

## Payment Flow

The current payment implementation uses a manual UPI confirmation flow instead of a third-party payment gateway.

```text
Customer Checkout
       ↓
Delivery Details
       ↓
UPI QR Code
       ↓
Customer Completes UPI Payment
       ↓
Customer Enters UTR / Transaction ID
       ↓
Order Submitted
       ↓
Payment Status = PENDING
```

The administrator can later update the payment status from the Admin Orders page.

## Order Status Flow

Orders support the following statuses:

```text
PLACED
   ↓
PROCESSING
   ↓
SHIPPED
   ↓
DELIVERED
```

Payment statuses:

```text
PENDING
PAID
FAILED
```

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3
* React Router
* Browser localStorage

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* REST APIs
* Maven

### Database

* MySQL

### Development Tools

* VS Code
* Git
* GitHub
* IntelliJ IDEA

## Application Architecture

```text
                    ┌───────────────────────┐
                    │      React / Vite     │
                    │    Customer Website   │
                    └───────────┬───────────┘
                                │
                                │ REST API
                                ▼
                    ┌───────────────────────┐
                    │     Spring Boot       │
                    │      REST API         │
                    └───────────┬───────────┘
                                │
                                │ JPA / Hibernate
                                ▼
                    ┌───────────────────────┐
                    │        MySQL          │
                    │    brundavan_db       │
                    └───────────────────────┘
```

## Main Customer Flow

```text
Home
  ↓
Books
  ↓
Book Details
  ↓
Select Medium
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Delivery Details
  ↓
UPI Payment
  ↓
UTR Submission
  ↓
Order Creation
  ↓
Order Success
```

## Main Admin Flow

```text
Admin Dashboard
      ├── Books
      │     ├── Add
      │     ├── Edit
      │     ├── Deactivate
      │     └── Reactivate
      │
      └── Orders
            ├── View customer details
            ├── View payment details
            ├── Update payment status
            └── Update order status
```

## Project Structure

```text
Brundavan-Publications/
│
├── brundavan-backend/
│   └── brundavan-backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── brundavan_backend/
│       │   │   │       ├── controller/
│       │   │   │       ├── entity/
│       │   │   │       └── repository/
│       │   │   │
│       │   │   └── resources/
│       │   │       └── application.properties.example
│       │   │
│       │   └── test/
│       │
│       ├── pom.xml
│       └── mvnw
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   │   ├── books/
│   │   └── payment/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Important API Endpoints

### Books

```text
GET    /api/books
GET    /api/books/{id}
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
```

The delete operation is implemented as a book deactivation rather than a hard delete.

### Orders

```text
GET  /api/orders
POST /api/orders
```

### Order Management

```text
PUT /api/orders/{id}/payment-status
PUT /api/orders/{id}/status
```

## Local Development Setup

### Prerequisites

Install:

* Java
* Maven
* Node.js and npm
* MySQL
* Git

### Backend

Navigate to:

```text
brundavan-backend/brundavan-backend
```

Then run:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

### Frontend

From the project root:

```bash
npm install
npm run dev
```

The Vite development server may use an available local port such as:

```text
http://localhost:5174
```

or:

```text
http://localhost:5175
```

### Database

Create a MySQL database:

```sql
CREATE DATABASE brundavan_db;
```

Configure local database credentials in your local Spring Boot configuration.

Do not commit real database credentials to GitHub.

The repository contains:

```text
application.properties.example
```

as a configuration template.

## Environment and Security

Sensitive local configuration is intentionally excluded from version control.

The following should remain local:

```text
application.properties
.env
database passwords
production credentials
```

Never publish real database passwords, API keys, or payment credentials in the repository.

## UI Design

The application uses a premium visual style based on:

* Purple and gold brand colors
* Glassmorphism
* Translucent cards
* Backdrop blur
* Rounded components
* Responsive layouts
* Mobile-friendly navigation
* Book-cover-focused presentation

## Screenshots
Suggested screenshots:
```text
1. Home page:
![image alt](https://github.com/abhishekshivaraj-boop/Brundavan-Publications/blob/41fa500f070189069a69672599a790d01189b5c9/Screenshot%202026-08-30%20162920.png![image alt](image url)![image alt])
2. Books catalog
![image alt]https://github.com/abhishekshivaraj-boop/Brundavan-Publications/blob/a77a887c048bc33a5abf70a04713dbe82c1786a5/Screenshot%202026-08-30%20163915.png
3. Book details
4. Cart
5. Checkout / UPI payment
6. Order success
7. Admin dashboard
8. Admin orders
```

## Current Development Status

The core application is implemented and working locally.

Completed:

* Customer-facing website
* Book catalog
* Medium selection
* Cart
* Checkout
* UPI payment flow
* Order creation
* Stock validation
* Stock reduction
* Admin book management
* Admin order management
* Payment status management
* Order status management
* Responsive UI
* Glassmorphism UI
* GitHub repository

Remaining project work:

* Final production configuration
* Deployment
* Production API/database configuration
* Live environment testing
* Final documentation screenshots

## Future Improvements

Potential future enhancements include:

* Online payment gateway integration
* Customer order tracking
* Email notifications
* Automated invoice generation
* Authentication and role-based access
* Advanced inventory reporting
* Search and filtering
* Production analytics
* Shipping integration
## Author

**Abhishek Shivaraj Swami**

GitHub:

`https://github.com/abhishekshivaraj-boop`

Repository:

`https://github.com/abhishekshivaraj-boop/Brundavan-Publications`


