# VoiSafe Server - Folder Structure

## ✅ Final Structure (Updated)

```
server/
├── src/                         # All source code
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
│   │   ├── Complaint.js         # Complaint schema (NO userId field) ⭐
│   │   ├── ComplaintTracking.js # Identity mapping (encrypted) ⭐
│   │   └── ChatMessage.js       # Anonymous chat messages
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   └── complaintRoutes.js   # Complaint endpoints
│   ├── sockets/
│   │   └── chatHandler.js       # Socket.io chat handlers
│   ├── utils/
│   │   ├── encryption.js        # AES-256 encryption utilities
│   │   └── trackingIdGenerator.js  # Secure tracking ID generation
│   └── server.js                # Main entry point ⭐
├── public/                      # Static files (if any)
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json                 # Dependencies (updated to src/server.js)
├── package-lock.json
└── README.md                    # Documentation
```

## 🚀 Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Both commands now run `src/server.js`

## 📝 Key Changes

1. ✅ All code moved to `src/` folder
2. ✅ `server.js` now in `src/server.js`
3. ✅ `package.json` updated to point to `src/server.js`
4. ✅ Cleaner root directory (only config files)

## 🔐 Identity Decoupling Files

The core anonymity implementation:
- `src/models/Complaint.js` - NO userId field
- `src/models/ComplaintTracking.js` - Encrypted identity mapping
- `src/controllers/complaintController.js` - Identity decoupling logic
- `src/utils/trackingIdGenerator.js` - Secure tracking IDs
- `src/utils/encryption.js` - AES-256 encryption
