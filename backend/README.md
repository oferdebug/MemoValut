# MemoVault Backend

This is the backend server for the MemoVault application.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your values:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Deployment to Render.com

1. Create a new account on [Render.com](https://render.com)

2. Create a new Web Service:
   - Connect your GitHub repository
   - Choose the main branch
   - Select "Node" as the runtime
   - Set the build command: `npm install`
   - Set the start command: `npm start`

3. Add Environment Variables:
   - `PORT`: Will be automatically set by Render
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

4. Deploy!

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

### Protected Routes

#### Get Protected Data
```http
GET /api/protected
Authorization: Bearer your_jwt_token
```

### Health Check

#### Check Server Status
```http
GET /api/health
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
