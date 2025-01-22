# Backend for Playit

Welcome to the **Backend for Playit** repository! This project provides the backend services for the Playit application, a platform designed to enhance the user experience for media playback and content management.

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Media Management**: APIs for managing media files, playlists, and user preferences.
- **Scalable Architecture**: Built with scalability and maintainability in mind.

## Technologies Used

- **Node.js**: Runtime environment for building server-side applications.
- **Express.js**: Framework for creating robust APIs.
- **MongoDB**: NoSQL database for storing application data.
- **JWT**: Secure authentication mechanism.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ayu-Rawat/Backend-for-Playit.git
   cd Backend-for-Playit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will run at `http://localhost:5000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive a token.

### Media Management

- `GET /api/media`: Fetch all media files.
- `POST /api/media`: Upload a new media file.
- `DELETE /api/media/:id`: Delete a media file.

### Playlists

- `GET /api/playlists`: Fetch user playlists.
- `POST /api/playlists`: Create a new playlist.
- `DELETE /api/playlists/:id`: Delete a playlist.

<!--### Real-Time Updates

- WebSocket URL: `ws://localhost:5000` (for real-time notifications).-->

## Folder Structure

```
Backend-for-Playit/
├── src/
│   ├── controllers/       # Business logic for API routes
│   ├── models/            # Database models
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Middleware functions
│   ├── utils/             # Utility functions
│   └── app.js             # Main application file
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # Documentation
```

## Contributing

Contributions are welcome! If you have suggestions or want to report a bug, feel free to open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add feature-name"
   ```

4. Push to the branch:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any queries, please contact [Ayu-Rawat](https://github.com/Ayu-Rawat).

---

Thank you for checking out the **Backend for Playit** project! We hope you find it useful and look forward to your contributions.
