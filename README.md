# Golbahar Backend

This is the backend service for the Golbahar project, built using Node.js, Express, TypeScript, MongoDB, JWT for authentication, and Stripe for payment processing.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Backend Locally](#running-the-backend-locally)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (you can use a local instance or MongoDB Atlas for a cloud database)
- [Stripe Account](https://stripe.com/) (for payment processing)

## Installation

1. **Clone the repository:**

   ```bash
   https://github.com/SardarAmiri/golbahar-server.git
   cd golbahar-server

2. Install the dependencies:
   npm install
   
3. Set up your MongoDB database:
   If using MongoDB locally, make sure it is running.
   If using MongoDB Atlas, create a cluster and obtain the connection string.
4. Set up Stripe:
   Create a Stripe account and get your API keys for payment processing.


## Environment Variables
Create a .env file in the root directory of the backend project. Here are the required environment variables:

  PORT=5000
  MONGO_URI=your-mongodb-connection-string
  JWT_SECRET=your-secret-key
  STRIPE_SECRET_KEY=your-stripe-secret-key
  STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

Ensure to replace the placeholder values (your-mongodb-connection-string, etc.) with the actual values.


## Running the Backend Locally

1. Run the backend development server:'
   nodemon server
   
   This will start the server at http://localhost:5000. The backend API will be served at this URL.
   
3. Testing API Endpoints:

You can test the API endpoints using tools like Postman or through the frontend once it is connected.


## API Documentation

The API exposes routes for authentication, product management, payments, etc. For example:

  POST /api/auth/login - User login
  POST /api/auth/register - User registration
  GET /api/products - Fetch all products
  POST /api/checkout - Stripe payment
  
Refer to the routes/ directory for more information on all available routes.



## Contributing
We welcome contributions! Feel free to submit pull requests, open issues, or suggest improvements. Please follow our coding standards and test your changes before submitting.
