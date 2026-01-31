import { io, Socket } from "socket.io-client";

/**
 * SOCKET.IO CLIENT FOR ANONYMOUS CHAT
 * 
 * Features:
 * - JWT authentication
 * - Automatic reconnection
 * - Event handlers for chat
 */

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

/**
 * Initialize Socket.io connection
 */
export const initializeSocket = (): Socket => {
    if (socket && socket.connected) {
        return socket;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    // Create socket connection with auth
    socket = io(SOCKET_URL, {
        auth: {
            token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    // Connection event handlers
    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
    });

    return socket;
};

/**
 * Get existing socket instance
 */
export const getSocket = (): Socket | null => {
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Join chat room for a complaint
 */
export const joinChatRoom = (trackingId: string): void => {
    if (!socket) {
        throw new Error("Socket not initialized");
    }

    socket.emit("join_chat", { trackingId });
};

/**
 * Leave chat room
 */
export const leaveChatRoom = (trackingId: string): void => {
    if (!socket) return;

    socket.emit("leave_chat", { trackingId });
};

/**
 * Send message
 */
export const sendMessage = (trackingId: string, message: string): void => {
    if (!socket) {
        throw new Error("Socket not initialized");
    }

    socket.emit("send_message", { trackingId, message });
};

/**
 * Send typing indicator
 */
export const sendTyping = (trackingId: string, isTyping: boolean): void => {
    if (!socket) return;

    socket.emit("typing", { trackingId, isTyping });
};

/**
 * Socket event listeners
 */
export const socketEvents = {
    onChatHistory: (callback: (data: any) => void) => {
        socket?.on("chat_history", callback);
    },

    onMessageReceived: (callback: (data: any) => void) => {
        socket?.on("message_received", callback);
    },

    onUserTyping: (callback: (data: any) => void) => {
        socket?.on("user_typing", callback);
    },

    onUserJoined: (callback: (data: any) => void) => {
        socket?.on("user_joined", callback);
    },

    onUserLeft: (callback: (data: any) => void) => {
        socket?.on("user_left", callback);
    },

    onError: (callback: (data: any) => void) => {
        socket?.on("error", callback);
    },

    // Remove listeners
    off: (event: string, callback?: any) => {
        socket?.off(event, callback);
    },
};
