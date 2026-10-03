"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { apiUrl } from "@/lib/api";

export interface ChatMessage {
  id?: number;
  rideId: number;
  senderId: number;
  senderName: string;
  senderRole: "PASSENGER" | "DRIVER" | "ADMIN";
  content: string;
  sentAt: string;
}

interface RideChatDrawerProps {
  rideId: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const QUICK_REPLIES = [
  "📍 I am at the pickup point",
  "⏱️ Arriving in 2 minutes",
  "🚗 Near the main gate",
  "❓ Where are you waiting?",
  "👍 Thank you!",
];

export default function RideChatDrawer({
  rideId,
  isOpen,
  onClose,
  title = "In-Ride Chat",
}: RideChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState<number | null>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.userId || parsed?.id) return Number(parsed.userId || parsed.id);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Load message history and setup STOMP WebSocket listener
  useEffect(() => {
    if (!isOpen || !rideId) return;

    let isMounted = true;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch historical messages
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl(`/api/rides/${rideId}/chat`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data: ChatMessage[] = await res.json();
          if (isMounted) {
            setMessages(data);
            setTimeout(scrollToBottom, 100);
          }
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchHistory();

    // WebSocket STOMP subscription
    if (token) {
      try {
        const client = new Client({
          webSocketFactory: () => new SockJS(apiUrl("/ws")) as unknown as WebSocket,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 4000,
          onConnect: () => {
            client.subscribe(`/topic/ride/${rideId}/chat`, (message) => {
              try {
                const received: ChatMessage = JSON.parse(message.body);
                if (isMounted) {
                  setMessages((prev) => {
                    if (prev.some((m) => m.id === received.id && m.id !== undefined)) {
                      return prev;
                    }
                    return [...prev, received];
                  });
                  setTimeout(scrollToBottom, 100);
                }
              } catch {
                // ignore
              }
            });
          },
        });

        client.activate();
        stompClientRef.current = client;
      } catch {
        // fallback
      }
    }

    return () => {
      isMounted = false;
      if (stompClientRef.current) {
        void stompClientRef.current.deactivate();
      }
    };
  }, [isOpen, rideId]);

  // 3. Send message handler
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || sending) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setSending(true);
    setInputText("");

    try {
      const res = await fetch(apiUrl(`/api/rides/${rideId}/chat`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (res.ok) {
        const saved: ChatMessage = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === saved.id)) return prev;
          return [...prev, saved];
        });
        setTimeout(scrollToBottom, 100);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="flex h-full w-full max-w-md flex-col bg-white dark:bg-slate-900 shadow-2xl sm:h-[88vh] sm:rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-5 py-4 text-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
              💬
            </span>
            <div>
              <h3 className="text-base font-bold leading-tight">{title}</h3>
              <p className="text-[11px] font-semibold text-emerald-400">● Live in-ride messaging</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
          {loading ? (
            <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
              Loading chat history…
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 text-slate-400">
              <span className="text-4xl mb-2">🚗💬</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-55">
                Coordinate pickup, timing, or updates directly with your co-travelers.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = currentUserId !== null && msg.senderId === currentUserId;
              const isDriver = msg.senderRole === "DRIVER";

              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 px-1 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {isMe ? "You" : msg.senderName}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold ${
                        isDriver
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {msg.senderRole}
                    </span>
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-xs leading-relaxed ${
                      isMe
                        ? "bg-emerald-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  <span className="mt-1 px-1 text-[9px] font-semibold text-slate-400">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="border-t border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 px-3 py-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_REPLIES.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => void handleSend(reply)}
                className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-center gap-2 border-t border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            maxLength={1000}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
