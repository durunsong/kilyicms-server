<div align="center">
  <img alt="Kilyicms Logo" width="120" height="120" src="https://kilyicms-server.vercel.app/images/logo.png">
  <h1>Kilyicms</h1>
  <span>English | <a href="./README.md">中文</a></span>
</div>

## kilyicms-server

This is the backend project for KilyiCMS, developed using **Node.js**, **Express**, **Neon** cloud database, **CORS**, **JWT**, and **Bcrypt**. The project is serverlessly deployed via **Vercel** and aims to provide a simple and easily extensible backend API.

## 🎯 Features

- 🔒 **User Authentication**: Implements user registration, login, and authorization using JWT.
- 🔑 **Password Encryption**: Secures user passwords with Bcrypt.
- 🌐 **CORS Support**: Integrates CORS for cross-origin requests.
- 📅 **Time Management**: Handles date and time formatting using Moment.js.
- 🗄️ **Cloud Database**: Utilizes Neon as a serverless PostgreSQL solution.
- 🔧 **Logging**: Uses Morgan and Debug for logging in development and production environments.
- 🧰 **Environment Variables**: Loads environment configurations with Dotenv.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Lightweight web application framework
- **Neon**: Cloud-based PostgreSQL database
- **JWT (jsonwebtoken)**: For API authentication
- **Bcrypt**: For password encryption
- **CORS**: Middleware for Cross-Origin Resource Sharing
- **EJS**: Template engine
- **Morgan**: HTTP request logging middleware

## 📦 Project Structure

```mariadb
kilyicms-db/
├── index.js # Entry point
├── bin/ # Controllers/State Management
├── models/ # Database models
├── routes/ # Route configurations
├── middlewares/ # Middleware functions
├── config/ # Configuration files
├── db/  # Database connection configuration
├── utils/ # Utility functions
├── public/ # Static resource management
├── views/ # Special page handling (redirect pages)
├── sql/  # Neon database file examples
├── .env # Environment variables configuration file
└── README.md # Project documentation
```

## 🔧 Environment Variables Configuration

The project uses a `.env` file to configure environment variables. Here is an example:

```mariadb
PORT=3000
DATABASE_URL=postgres://username:password@neon.example.com/dbname
APP_SECRET=your_jwt_secret_key
```

## Database Documentation and Console

https://console.neon.tech/

### 🚀 Installation and Startup

```pnpm
1. Clone the project
git clone https://github.com/durunsong/kilyicms-db.git
cd kilyicms-db

2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the project root directory and add the configurations as shown in the example above.

4. Start the development server
npm run start

5. Deploy to Vercel
Import the project to Vercel and configure the environment variables from the .env file.
```

### 📌 API Design

```pnpm
# Follows RESTful style
/    ---get
/api/users  ---get post put delete
/db-version ---get
api/users/login  ---post
/api/users/register ---post
/api/users/userInfo  ---get
/api/users/deleteList ---get post put delete
/api/users/restore  ---post

# Status codes
200 -- Success
401 -- Unauthorized
403 -- Forbidden
404 -- Not Found
409 -- Custom Error Status
500 -- Server Error
....
```

### 🗂️ Database Design

#### Users Table (users)

| Column Name    | Type           | Description        |
|----------------|----------------|--------------------|
| `uuid`         | `UUID`         | Primary key        |
| `user_name`    | `VARCHAR(255)` | Username           |
| `password`     | `VARCHAR(255)` | Password (encrypted) |
| `created_time` | `TIMESTAMP`    | Creation time      |
| `roles`        | `JSONB`        | Roles              |
| `......`       | `......`       | .....              |

## 💕 Support by Starring

Getting stars for small projects is not easy. If you like this project, please consider supporting it with a star! It's the author's only motivation for continuous maintenance (whisper: after all, it's free).

