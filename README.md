# Role-Based Admin Dashboard

A full-stack Role-Based Admin Dashboard built using **NestJS (Backend)** and **Next.js (Frontend)**.  
It includes secure authentication, JWT authorization, and role-based access control for Admin and User.

---

## 🚀 Features

- 🔐 User Authentication (Login/Register with OTP verification)
- 🛡️ JWT Token-based Authorization
- 👑 Role-based Access Control (Admin & User)
- 📋 Employee Management (CRUD operations)
- 👤 Users can only view their own created employees
- 👨‍💼 Admin can view, update, and delete all employees
- 🎨 Clean and responsive UI using Next.js

---

## 🏗️ Tech Stack

**Frontend:**
- Next.js
- React
- Tailwind CSS
- Axios

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication

---

## 📁 Project Structure
Role-Based-Admin-Dashboard/
backend/
frontend/

## 🔐 Role Logic

- **Admin**
  - Can view all employees
  - Can edit and delete any employee

- **User**
  - Can only view employees created by themselves

---
## 👨‍💻 Author

- Developed by: Your Name