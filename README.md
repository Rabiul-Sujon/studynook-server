 # StudyNook - Server Side

Live Site URL: [StudyNook](https://studynook-client-beryl.vercel.app)

## About

This is the backend server for StudyNook - a library study room booking application. Built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT authentication with HTTP-only cookies for secure user sessions
- 🏠 Full CRUD operations for study room management with ownership verification
- 📅 Advanced booking system with time-slot conflict detection using MongoDB operators
- 🔍 Search and filter rooms by name using regex and amenities using $in operator
- 👤 User booking management with $push and $pull array operators
- 🛡️ Protected routes with custom auth middleware for secure API endpoints
- 📦 RESTful API architecture with proper error handling and status codes

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- Cookie Parser
- CORS

## API Routes

### Auth Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google OAuth login
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Room Routes
- GET `/api/rooms` - Get all rooms (with search & filter)
- GET `/api/rooms/latest` - Get latest 6 rooms
- GET `/api/rooms/my-listings` - Get owner's rooms
- GET `/api/rooms/:id` - Get single room
- POST `/api/rooms` - Add new room (private)
- PUT `/api/rooms/:id` - Update room (owner only)
- DELETE `/api/rooms/:id` - Delete room (owner only)

### Booking Routes
- POST `/api/bookings` - Create booking (private)
- GET `/api/bookings/my-bookings` - Get user's bookings
- PATCH `/api/bookings/:id/cancel` - Cancel booking

## Running Locally

Clone the project:

git clone https://github.com/Rabiul-Sujon/studynook-server.git






