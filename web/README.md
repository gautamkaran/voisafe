# VoiSafe Frontend

Modern Next.js 14/15 frontend for VoiSafe - Anonymous Grievance SaaS Platform

## 🚀 Features

- ✅ **Multi-step Complaint Submission** - React Hook Form + Zod validation
- ✅ **Anonymous Chat** - Socket.io real-time messaging
- ✅ **Tracking System** - Dynamic routes with status timeline
- ✅ **Server Actions** - Form submission with Next.js Server Actions
- ✅ **Middleware Protection** - Route-based authentication
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript support

## 📁 Folder Structure

```
web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── layout.tsx              # Auth layout
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx      # Dashboard overview
│   │   ├── submit-complaint/page.tsx  # Multi-step form
│   │   ├── my-complaints/page.tsx  # Complaints list
│   │   ├── track/[trackingId]/page.tsx  # Tracking page
│   │   ├── chat/[trackingId]/page.tsx   # Anonymous chat
│   │   └── layout.tsx              # Dashboard layout
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   └── ui/
│       ├── Button.tsx              # Reusable button
│       ├── Input.tsx               # Form input
│       ├── Textarea.tsx            # Textarea
│       └── Card.tsx                # Card component
├── lib/
│   ├── api.ts                      # Axios API client
│   ├── socket.ts                   # Socket.io client
│   ├── auth.ts                     # Auth helpers
│   └── utils.ts                    # Utility functions
├── types/
│   └── index.ts                    # TypeScript types
├── schemas/
│   └── complaint.ts                # Zod schemas
├── middleware.ts                   # Route protection
├── .env.local                      # Environment variables
└── package.json
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 🔐 Anonymous Chat Implementation

### Identity Protection
- Socket.io connections use **trackingId** instead of userId
- Messages show **role** (student/admin) without revealing identity
- No PII stored in chat messages

### Socket.io Events

**Client → Server:**
- `join_chat` - Join complaint chat room
- `send_message` - Send message
- `typing` - Typing indicator

**Server → Client:**
- `chat_history` - Get message history
- `message_received` - New message
- `user_typing` - User is typing

## 📋 Multi-Step Complaint Form

### Steps:
1. **Details** - Title and description
2. **Category** - Select complaint category
3. **Review** - Review before submission
4. **Success** - Display trackingId

### Validation:
- Zod schema validation
- React Hook Form integration
- Real-time error messages

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, tablet, desktop
- **Loading States** - Skeleton screens and spinners
- **Toast Notifications** - Success/error messages (Sonner)
- **Status Badges** - Color-coded complaint status
- **Typing Indicators** - Real-time chat feedback
- **Auto-scroll** - Chat messages

## 🔒 Security

- **JWT Authentication** - Stored in localStorage
- **Axios Interceptors** - Auto-attach tokens
- **Middleware Protection** - Route-based access control
- **Anonymous Submissions** - No identity in complaint data

## 📦 Dependencies

- **next** - React framework
- **react-hook-form** - Form management
- **zod** - Schema validation
- **socket.io-client** - Real-time chat
- **axios** - HTTP client
- **lucide-react** - Icons
- **sonner** - Toast notifications
- **date-fns** - Date formatting
- **tailwindcss** - Styling

## 🎓 For Examiners

### Modern Next.js Best Practices

1. **App Router** - Using Next.js 14/15 App Router
2. **Server Components** - Default for layouts and static pages
3. **Client Components** - Only for interactivity (forms, chat)
4. **Server Actions** - Form submission (can be added)
5. **Middleware** - Route protection
6. **TypeScript** - Full type safety
7. **Modular Code** - Reusable components and utilities

### Key Implementation Highlights

- ✅ **Identity Decoupling** - trackingId-based system
- ✅ **Real-time Chat** - Socket.io with anonymous messaging
- ✅ **Form Validation** - Zod + React Hook Form
- ✅ **Responsive UI** - Tailwind CSS
- ✅ **Error Handling** - Toast notifications
- ✅ **Loading States** - User feedback

---

**VoiSafe Frontend** - Empowering students to speak up safely! 🚀
