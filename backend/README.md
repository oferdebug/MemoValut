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

## Deployment to Render

1. Create a new account on [Render.com](https://render.com)

2. Create a new Web Service:
   - Connect your GitHub repository
   - Choose the main branch
   - Select "Node" as the runtime
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Set the Node version to 18 or higher

3. Add Environment Variables in Render Dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - Note: No need to set PORT as Render will handle this

4. Important Settings:
   - Root Directory: Leave empty (or set to `/backend` if using monorepo)
   - Node Environment: `production`
   - Auto-Deploy: Yes

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

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Testing the Deployment

After deploying, you can test the API using the health check endpoint:
```bash
curl https://your-app-name.onrender.com/api/health
```

## Troubleshooting

1. If the build fails, check:
   - Node version in package.json
   - All dependencies are listed in package.json
   - Environment variables are set correctly

2. If the app crashes:
   - Check Render logs
   - Verify MongoDB connection string
   - Ensure JWT_SECRET is set

3. For CORS issues:
   - Verify the frontend URL is correctly set in CORS configuration
   - Check if the request includes proper headers
