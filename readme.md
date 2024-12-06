
# CompleteIt - Task Manager

CompleteIt is a task management system where managers assign tasks to users, who can then mark them as completed. Notifications are sent to both the manager and the user when tasks are assigned or completed.

## Features
- **User Management**: Admin and user roles with separate permissions.
- **Task Management**: Create, assign, and track tasks.
- **Real-Time Notifications**: Use of Socket.IO to notify users and managers about task assignments and completions.
- **Project Management**: Assign tasks to projects and manage them collectively.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM
- **Real-Time Notifications**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Prisma

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/ibrahimabdalrhman/CompleteIt.git
cd CompleteIt
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file at the root of the project and set the following variables:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret"
```

### 4. Run migrations
Run Prisma migrations to set up the database schema:
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Start the development server
```bash
npm start
```

The server should now be running on `http://localhost:5000`. You can interact with the API using tools like Postman or Insomnia.

## API Endpoints

### Authentication
- `POST /auth/login` - Login a user and get JWT token.
- `POST /auth/register` - Register a new user.

### Users
- `GET /users/{id}` - Get user information by ID.
- `GET /users` - Get a list of all users (Admin only).

### Tasks
- `POST /tasks` - Create a new task (Admin only).
- `GET /tasks` - Get all tasks for a project or user.
- `PUT /tasks/{id}` - Update the task status (e.g., mark as completed).

### Projects
- `POST /projects` - Create a new project (Admin only).
- `GET /projects` - Get all projects.

### Notifications
- `GET /notifications` - Get a list of notifications for a user.
- `POST /notifications` - Create a new notification.

## Real-Time Features
- The project uses Socket.IO for real-time notifications.
- Clients will automatically receive notifications when tasks are assigned or completed.

## License
MIT License
