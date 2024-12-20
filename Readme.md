# Task Management System

## Overview

This project is a Task Management System built with Node.js, MongoDB, and Express. It allows users to create, manage, and delete tasks, and supports user authentication and role-based task assignment.

## Features

- **User Authentication**: Register and login with secure authentication..
- **Task Creation**: Create new tasks with details such as title, description, due date, and status.
- **Task Assignment**: Assign tasks to specific employees.
- **Task Management**: View, update, and delete tasks.
- **Email Notifications**: Send email notifications when tasks are assigned.

## Technologies Used

- **Backend**:
  - Node.js (v20.12.2)
  - Express.js
  - MongoDB
  - Mongoose
- **Email Service**: Nodemailer (for sending email notifications)

## Setup 

### 1. Clone the repository:

- Clone the repository to your local machine: [Clone Repo](https://github.com/swappy-sutar/Task-Management-System-Backend.git)
- git clone
- cd task-management-system/

### 2. Install dependencies:

- cd task-management-system/Backend
- npm install

### 3. Configuration:

- Create a .env file in the root of the Backend directory.
- Add the following variables:
  - PORT=4000
  - DATABASE_URL="mongodb://localhost:27017/Task_Management_System"
  - MAIL_HOST=smtp.gmail.com
  - MAIL_USER=
  - MAIL_PASSWORD=
  - JWT_SECRET_KEY=Swappy

### 4. Database Setup:

- Ensure MongoDB is running locally or set up a remote MongoDB instance.
- Run database migrations if any (e.g., for database schema updates or initial setup)

### 5. Authentication Setup:

- Integrate a secure authentication mechanism.
- Install necessary packages for handling user registration, login, and authentication (e.g., jsonwebtoken for token handling).
- Configure authentication in app.js or a dedicated authentication middleware module.

### 6. Starting the Server:

- Start the Express server
- npm run dev


## Access Swagger UI:
- Open a web browser and navigate to http://localhost:4000/api-docs
- Swagger UI will be displayed, allowing you to interact with the API endpoints and view documentation.
