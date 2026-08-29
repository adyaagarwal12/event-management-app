# 🎓 Campus Event Management System

## Cloud Computing Digital Assignment

A full-stack web application developed as a **Digital Assignment for the Cloud Computing course**.

The objective of this assignment is to design and develop a functional **CRUD (Create, Read, Update, Delete) web application** and understand the integration of a frontend, backend, and database.

The **Campus Event Management System** provides a centralized platform for managing and viewing campus events. Organizers can create, view, update, and delete events, while students can browse and search for events happening on campus.

---

## 📌 Assignment Details

**Course:** Cloud Computing  
**Assignment Type:** Digital Assignment  
**Project Type:** Full-Stack CRUD Web Application  

### Assignment Objective

The objective of this assignment is to develop a web application implementing the fundamental **CRUD operations**:

- **Create** – Add a new event
- **Read** – View and retrieve events
- **Update** – Modify existing event details
- **Delete** – Remove an event

The project demonstrates the integration of different components required to build a complete web application.

---

# 💡 Project Overview

Campus events such as workshops, hackathons, technical events, cultural programs, and seminars are often announced through multiple platforms. This can make it difficult for students to find and keep track of upcoming events.

The **Campus Event Management System** provides a single platform where events can be managed and viewed conveniently.

The application contains two main modules:

### 👨‍🎓 Student Module

Students can:

- View events happening today
- View events happening within the next seven days
- View upcoming events
- View past events
- Search for events
- Filter events by category
- View detailed information about an event
- Access a registration option for events

### 👨‍💼 Organizer Module

Organizers can:

- Create new events
- View all events
- Edit event details
- Delete events
- View the total number of events
- View upcoming event count
- View past event count

---

# ⚙️ CRUD Operations

The application implements all four basic CRUD operations.

| Operation | Description | HTTP Method |
|---|---|---|
| Create | Add a new event | `POST` |
| Read | Retrieve events | `GET` |
| Update | Edit an existing event | `PUT` |
| Delete | Remove an event | `DELETE` |

---

# 🛠️ Technologies Used

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Development Tools

- Nodemon
- Dotenv
- Git
- GitHub

---

# 🏗️ Application Architecture

The application follows a basic client-server architecture.

```text
User
  │
  ▼
Frontend
HTML + CSS + JavaScript
  │
  │ HTTP Requests
  ▼
Backend Server
Node.js + Express.js
  │
  │ Mongoose
  ▼
MongoDB Database