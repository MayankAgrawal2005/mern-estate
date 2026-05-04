# MERN Estate - Modern Real Estate Marketplace

A full-stack real estate application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to list properties for rent or sale, search for listings with advanced filters, and manage their profiles with secure authentication.

##  Features

- **Advanced Authentication**: JWT-based login/signup with secure cookie storage.
- **Google OAuth**: One-click login using Firebase Authentication.
- **Property Management**: Users can create, update, and delete their own property listings.
- **Image Uploads**: Integrated with Cloudinary for efficient property and profile image management.
- **Advanced Search**:
    - Search by keyword (case-insensitive).
    - Filter by type (Sale, Rent, or All).
    - Filter by amenities (Parking, Furnished).
    - Filter by special offers.
    - Sorting by newest, oldest, price (high to low), and price (low to high).
    - Pagination support for search results.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across all devices.
- **State Management**: Redux Toolkit and Redux Persist for persistent user sessions.
- **Interactive UI**: Swiper for image sliders and React Icons for a modern look.

##  Tech Stack

**Frontend:**
- React.js
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- React Router Dom (Routing)
- Vite (Build tool)
- Firebase (Google OAuth)
- Cloudinary (Image Hosting)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose (Database)
- JSON Web Token (Authentication)
- Cookie-parser

##  Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Firebase](https://console.firebase.google.com/) account (for OAuth)
- [Cloudinary](https://cloudinary.com/) account (for images)

##  Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mern-estate
   ```

2. **Install dependencies (Root):**
   ```bash
   npm install
   ```

3. **Install Client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

##  Environment Variables

Create a `.env` file in the **root** directory:

```env
MONGO = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret

# Note: The following are present in the project but not currently implemented in the logic:
# MAIL_HOST = smtp.gmail.com
# EMAIL = your_email@gmail.com
# EMAIL_PASSWORD = your_app_password

```

Create a `.env` file in the **client** directory:

```env
VITE_FIREBASE_API_KEY = your_firebase_api_key
```

## Running the App

### Development Mode

Run the backend (from root):
```bash
npm run dev
```

Run the frontend (from `client` directory):
```bash
npm run dev
```

### Production Build

To build the project for production:
```bash
npm run build
```


