"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

import { ChatMessage } from "@/types";
import {
    initializeSocket,
    joinChatRoom,
    sendMessage,
    sendTyping,
    socketEvents,
    disconnectSocket
} from "@/lib/socket";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";

export default function ChatPage() {
    const params = useParams();
    const trackingId = params.trackingId as string;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Initialize socket connection
        try {
            initializeSocket();
            setIsConnected(true);

            // Join chat room
            joinChatRoom(trackingId);

            // Set up event listeners
            socketEvents.onChatHistory((data) => {
                setMessages(data.messages);
            });

            socketEvents.onMessageReceived((data) => {
                setMessages((prev) => [...prev, data]);
            });

            socketEvents.onUserTyping((data) => {
                if (data.role !== "student") {
                    setIsTyping(data.isTyping);
                }
            });

            socketEvents.onError((data) => {
                toast.error(data.message);
            });

            return () => {
                disconnectSocket();
            };
        } catch (error: unknown) {
            toast.error((error as Error).message || "Failed to connect to chat");
        }
    }, [trackingId]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            sendMessage(trackingId, newMessage.trim());
            setNewMessage("");
        } catch (error: unknown) {
            toast.error((error as Error).message || "Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = (value: string) => {
        setNewMessage(value);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Send typing indicator
        sendTyping(trackingId, true);

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(trackingId, false);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Anonymous Chat</h1>
                <p className="text-gray-600">
                    Chat with administrators about your complaint. Your identity remains anonymous.
                </p>
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Messages</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span className="text-sm text-gray-600">
                                {isConnected ? "Connected" : "Disconnected"}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isStudent = message.senderRole === "student";

                            return (
                                <div
                                    key={message._id}
                                    className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${isStudent
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        {!isStudent && message.senderName && (
                                            <p className="text-xs font-medium mb-1 opacity-75">
                                                {message.senderName} (Admin)
                                            </p>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                        <p className={`text-xs mt-1 ${isStudent ? "text-blue-100" : "text-gray-500"}`}>
                                            {formatDateTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <textarea
                            value={newMessage}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message... (Press Enter to send)"
                            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            disabled={!isConnected}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending || !isConnected}
                            className="self-end"
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
