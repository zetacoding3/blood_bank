# Blood Bank Management System

A comprehensive MERN stack application for managing blood donations, inventory, and hospital requests.

## Features

- **User Authentication**: Secure login and registration for donors, hospitals, and organizations
- **Role-Based Access Control**: Different interfaces and permissions for donors, hospitals, and administrators
- **Blood Inventory Management**: Track blood donations, requests, and current stock levels
- **Analytics Dashboard**: Visualize blood donation trends and inventory statistics
- **Organization Management**: Connect donors with blood banks and hospitals
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd Blood-Bank-Mern-Stack-Project

# Install dependencies
npm install

# Create .env file
touch .env

# Add the following environment variables to .env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Start the backend server
npm run server
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend-latest

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

## Usage

1. Register as a donor, hospital, or organization
2. Log in with your credentials
3. Navigate through the dashboard to:
   - View blood inventory
   - Make donation requests (hospitals)
   - Record blood donations (donors)
   - View analytics and reports

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login existing user

### Inventory
- `GET /api/v1/inventory/get-inventory` - Get blood inventory
- `POST /api/v1/inventory/create-inventory` - Add new inventory record
- `GET /api/v1/inventory/get-recent-inventory` - Get recent transactions
- `GET /api/v1/inventory/get-orgnaisation` - Get all organizations
- `GET /api/v1/inventory/get-orgnaisation-for-hospital` - Get organizations for hospitals

### Analytics
- `GET /api/v1/analytics/bloodGroups-data` - Get blood group analytics
- `GET /api/v1/analytics/recent-blood-records` - Get recent blood records

## Project Structure

```
Blood-Bank-Mern-Stack-Project/
├── controllers/         # Backend controllers
├── middlewares/         # Express middlewares
├── models/              # MongoDB models
├── routes/              # API routes
├── frontend-latest/     # Next.js frontend
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   └── public/          # Static assets
└── server.js            # Express server entry point
```

