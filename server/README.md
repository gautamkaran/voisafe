# VoiSafe Backend

A secure Node.js and Express.js backend implementing **Identity Decoupling** for anonymous complaint filing.

## 📁 Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── socket.js            # Socket.io configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── complaintController.js  # Complaint operations (IDENTITY DECOUPLING)
│   │   └── chatController.js    # Chat operations
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & RBAC
│   │   └── errorHandler.js      # Centralized error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Complaint.js         # Complaint schema (NO userId field)
│   │   ├── ComplaintTracking.js # Identity mapping (encrypted)
│   │   └── ChatMessage.js       # Anonymous chat messages
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   └── complaintRoutes.js   # Complaint endpoints
│   ├── sockets/
│   │   └── chatHandler.js       # Socket.io chat handlers
│   ├── utils/
│   │   ├── encryption.js        # AES-256 encryption utilities
│   │   └── trackingIdGenerator.js  # Secure tracking ID generation
│   └── server.js                # Main entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and secrets
   ```

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

Server runs on `http://localhost:5000`

## 🔐 Identity Decoupling Architecture

The core innovation: **Complaint documents NEVER contain userId**

- Students file complaints anonymously
- Unique `trackingId` generated for each complaint
- Identity mapping stored separately (encrypted)
- Database-level anonymity

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints (Student)
- `POST /api/complaints` - File anonymous complaint
- `GET /api/complaints/track/:trackingId` - Track complaint
- `GET /api/complaints/my-complaints` - Get my complaints

### Complaints (Admin)
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id/status` - Update status
- `POST /api/complaints/:id/notes` - Add admin note
- `POST /api/complaints/:id/reveal-identity` - Reveal identity (admin only)

## 🔌 Socket.io Events

### Client → Server
- `join_chat` - Join complaint chat room
- `send_message` - Send message
- `typing` - Typing indicator

### Server → Client
- `chat_history` - Get message history
- `message_received` - New message
- `user_typing` - User is typing

## 🔒 Security Features

- ✅ Identity Decoupling (no userId in complaints)
- ✅ AES-256 encryption for identity mapping
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Multi-tenant isolation

## 🛠️ Technologies

- Express.js
- Socket.io
- Mongoose (MongoDB)
- JWT
- bcryptjs
- Helmet
- CORS

---

**VoiSafe** - Empowering students to speak up safely and anonymously.
