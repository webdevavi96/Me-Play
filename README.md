# Me-Play: A Full Stack YouTube Clone Project

Me-Play is a comprehensive video sharing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides features similar to YouTube, allowing users to upload, share, and interact with videos.

## Project Structure

The project is divided into two main parts:

### Client (Frontend)

The frontend is built with React.js and Vite, featuring:

- **Authentication Pages**
  - Login
  - Register
  - Protected Routes

- **Core Features**
  - Video Upload
  - Video Player
  - Video Cards for browsing
  - Dashboard
  - Subscription Management
  - User Settings

- **Components**
  - Navbar
  - Footer
  - Loading States
  - Error Handling
  - Back and Logout Buttons

### Server (Backend)

The backend is built with Node.js and Express.js, providing:

- **API Endpoints**
  - User Management
  - Video Operations
  - Comments System
  - Likes System
  - Subscription Management
  - Dashboard Analytics

- **Core Features**
  - Authentication Middleware
  - File Upload with Multer
  - Cloudinary Integration
  - Error Handling
  - MongoDB Database

## Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Context API for State Management
- Modern JavaScript (ES6+)

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/webdevavi96/Me-Play.git
cd Me-Play
```

2. Install Server Dependencies:

```bash
cd server
npm install
```

3. Configure Server Environment Variables:

   Copy the `.env.sample` file to `.env` in the server directory and update the following variables:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ACCESS_TOKEN_SECRET=your_jwt_secret
   ACCESS_TOKEN_EXPIRY=1d
   ```

4. Install Client Dependencies:

   ```bash
   cd ../client
   npm install
   ```

5. Configure Client Environment Variables:

   Copy the `.env.sample` file to `.env` in the client directory and update the following variables:

   ```env
   VITE_SERVER_URI=http://localhost:8000
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

## Running the Application

To run both the client and server:

1. Start the Server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the Client:

   ```bash
   cd client
   npm run dev
   ```

## Features

- User Authentication
- Video Upload and Management
- Video Playback
- Comments and Likes System
- Channel Subscriptions
- User Dashboard
- Responsive Design
- Protected Routes
- Error Handling
- Loading States

## Project Structure Details

### Client Structure

```tree
client/
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Buttons/
│   │   │   ├── Back.jsx          # Back navigation button component
│   │   │   └── Logout.jsx        # Logout button component
│   │   ├── Cards/
│   │   │   └── VideoCards.jsx    # Video card component for displaying videos
│   │   ├── Error/
│   │   │   └── Error.jsx         # Error handling component
│   │   ├── Footer/
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── Loader/
│   │   │   └── Loader.jsx        # Loading state component
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx        # Navigation bar component
│   │   └── components.js         # Component exports
│   ├── hooks/                    # Custom React hooks
│   ├── layouts/
│   │   └── Layout.jsx           # Main layout component
│   ├── pages/
│   │   ├── AuthPages/
│   │   │   ├── Login/
│   │   │   │   └── Login.jsx    # Login page
│   │   │   └── Register/
│   │   │       └── Register.jsx # Registration page
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx    # User dashboard
│   │   ├── Home/
│   │   │   └── Home.jsx        # Home page
│   │   ├── Landing/
│   │   │   └── Landing.jsx     # Landing page
│   │   ├── Login_Required/
│   │   │   └── Login_Required.jsx # Protected route handler
│   │   ├── Managers/
│   │   │   ├── Subscriptions.jsx  # Subscription management
│   │   │   └── Videos.jsx         # Video management
│   │   ├── Player/
│   │   │   └── VideoPlayer.jsx    # Video player component
│   │   ├── Settings/
│   │   │   └── Settings.jsx       # User settings page
│   │   └── upload/
│   │       └── UploadVideo.jsx    # Video upload page
│   ├── routes/
│   │   └── Route.jsx             # Application routing
│   ├── services/
│   │   ├── authServices.js       # Authentication service
│   │   ├── dashBoardServices.js  # Dashboard API service
│   │   └── videoServices.js      # Video API service
│   ├── utils/
│   │   ├── authContext.jsx       # Authentication context
│   │   ├── capitaliseName.js     # Name formatting utility
│   │   └── ProtectedRoutes.jsx   # Route protection utility
│   ├── App.jsx                   # Main application component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Application entry point
├── .env                          # Environment variables
├── .env.sample                   # Environment variables template
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies and scripts
└── vite.config.js               # Vite configuration
```

This client structure follows a well-organized pattern where:

- **components/**: Reusable UI components
  - **Buttons/**: Navigation and action buttons
  - **Cards/**: Content display components
  - **Error/**: Error handling components
  - **Footer/**: Page footer
  - **Loader/**: Loading states
  - **Navbar/**: Navigation header

- **layouts/**: Page layout templates
  - Main layout with common elements

- **pages/**: All application views
  - **AuthPages/**: Authentication related pages
  - **Dashboard/**: User dashboard
  - **Home/**: Main content view
  - **Landing/**: Welcome page
  - **Managers/**: Content management
  - **Player/**: Video playback
  - **Settings/**: User preferences
  - **upload/**: Content upload

- **services/**: API integration
  - Authentication
  - Dashboard
  - Video management

- **utils/**: Helper functions and contexts
  - Authentication context
  - Route protection
  - Text formatting

### Server Structure

```tree
server/
└── src/
    ├── app.js
    ├── constants.js
    ├── index.js
    ├── config/
    │   └── cloudinary.config.js
    ├── controllers/
    │   ├── comment.controller.js
    │   ├── dashboard.controller.js
    │   ├── like.controller.js
    │   ├── subscription.controller.js
    │   ├── user.controller.js
    │   └── video.controller.js
    ├── db/
    │   └── db.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   └── multer.middleware.js
    ├── models/
    │   ├── comment.model.js
    │   ├── like.model.js
    │   ├── subscription.model.js
    │   ├── user.model.js
    │   └── video.model.js
    ├── routes/
    │   ├── channels.routes.js
    │   ├── comments.routes.js
    │   ├── dashboard.routes.js
    │   ├── likes.routes.js
    │   ├── user.routes.js
    │   └── video.routes.js
    └── utils/
        ├── ApiError.js
        ├── ApiResponse.js
        ├── asyncHandler.js
        ├── cloudinary.js
        └── deleteItem.js
```

## API Endpoints

- **Auth Routes**
  - POST /api/users/register
  - POST /api/users/login
  - GET /api/users/logout

- **Video Routes**
  - POST /api/videos/upload
  - GET /api/videos/:videoId
  - GET /api/videos/
  - PATCH /api/videos/:videoId
  - DELETE /api/videos/:videoId

- **Interaction Routes**
  - POST /api/comments/
  - POST /api/likes/
  - POST /api/subscriptions/

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the terms found in the LICENSE file.

---

Created by [Avinash](https://webdevavi96.netlify.app/)
