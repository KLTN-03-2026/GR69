import { useState, useRef, useEffect, useCallback } from "react";
import "./ChatBox.css";
import { productService } from "../../services/user/productService";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// Imports từ các files đã tách
import type { Message, ProductItem, ConversationState, LocalResponse } from "./types/types";
import { getLocalResponse, buildSystemPrompt } from "./services/botLogic";
import { useDraggable } from "./hooks/useDraggable";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
let genAI: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here") {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

let msgIdCounter = 1;

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgIdCounter++,
      role: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý AI của **FishMarket**. Tôi có thể giúp gì cho bạn?",
      timestamp: new Date(),
      quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [usingGemini, setUsingGemini] = useState(!!genAI);

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { renderPos, handleMouseDown } = useDraggable();

  // REFS QUAN TRỌNG
  const chatSessionRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convStateRef = useRef<ConversationState>({ stage: "idle", cart: [] });

  useEffect(() => {
    async function checkModels() {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`
      );

      const data = await res.json();

      console.log(
        data.models.map((m: any) => ({
          name: m.name,
          methods: m.supportedGenerationMethods,
        }))
      );
    }

    checkModels();
  }, []);
  const lastSendRef = useRef<number>(0); // Rate limit
  const messageCountRef = useRef<number>(0); // Quản lý độ dài session

  // 1. Hàm khởi tạo/cập nhật Session (Reset khi cart đổi)
  const initChatSession = useCallback(() => {
    if (!genAI || products.length === 0) return;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    chatSessionRef.current = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: buildSystemPrompt(products, convStateRef.current.cart) }],
        },
        {
          role: "model",
          parts: [{ text: "Chào bạn! Tôi đã nắm rõ thông tin sản phẩm và giỏ hàng hiện tại của bạn. Tôi có thể giúp gì thêm?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.6,
      },
    });
    messageCountRef.current = 0; // Reset bộ đếm khi tạo session mới
  }, [products]);

  // Fetch sản phẩm ban đầu
  useEffect(() => {
    const fetchProds = async () => {
      try {
        const res = await productService.getHome();
        const data = res.data?.data || res.data;
        const list = [...(data.best_sellers || []), ...(data.fresh || []), ...(data.shellfish || []), ...(data.shrimp || [])];
        setProducts(Array.from(new Map(list.map(p => [p.id, p])).values()));
      } catch (err) {
        console.error("Failed to load products for chatbox");
      }
    };
    fetchProds();
  }, []);

  // Khởi tạo session khi có sản phẩm
  useEffect(() => {
    if (products.length > 0) initChatSession();
  }, [products, initChatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function mergeState(prev: ConversationState, next?: Partial<ConversationState>): ConversationState {
    if (!next) return prev;
    return { ...prev, ...next, cart: next.cart ?? prev.cart };
  }

  // 2. Xử lý logic Local và đồng bộ Cart (Có reset AI Session)
  function processLocalAndSyncCart(trimmedText: string): LocalResponse {
    const local = getLocalResponse(trimmedText, products, convStateRef.current);
    if (local.newState) {
      const oldCartSize = convStateRef.current.cart?.length || 0;
      const newCartSize = local.newState.cart?.length || oldCartSize;

      if (newCartSize !== oldCartSize) {
        if (newCartSize > oldCartSize && local.newState.cart) {
          const addedItems = local.newState.cart.slice(oldCartSize);
          addedItems.forEach((item) => {
            let foundProduct = products.find((p) => p.name.toLowerCase().includes(item.name.toLowerCase()));
            const qtyNum = Math.max(1, parseFloat(item.qty.replace(/[^0-9.]/g, "")) || 1);
            addToCart(foundProduct || { id: Date.now() + Math.random(), name: item.name, price: item.price }, qtyNum);
          });
        }
        // BUG FIX: Reset AI session để cập nhật context giỏ hàng mới nhất
        convStateRef.current = mergeState(convStateRef.current, local.newState);
        initChatSession();
      } else {
        convStateRef.current = mergeState(convStateRef.current, local.newState);
      }
    }
    return local;
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();

    // 3. Rate limit (1.2s)
    const now = Date.now();
    if (now - lastSendRef.current < 1200) return;
    if (!trimmed || isTyping) return;
    lastSendRef.current = now;

    if (trimmed.toLowerCase().includes("xem giỏ hàng")) {
      navigate("/shoping-cart");
      setOpen(false);
      return;
    }

    const userMsg: Message = { id: msgIdCounter++, role: "user", text: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      let responseText: string;
      let quickReplies: string[] | undefined;

      const local = processLocalAndSyncCart(trimmed);

      if (local.text !== "") {
        responseText = local.text;
        quickReplies = local.quickReplies;
      } else if (usingGemini && chatSessionRef.current) {
        // 4. Reset session nếu quá dài (> 25 tin nhắn) để tránh tốn token/chậm
        messageCountRef.current++;
        if (messageCountRef.current > 25) {
          initChatSession();
        }

        const result = await chatSessionRef.current.sendMessage(trimmed);
        responseText = result.response.text();
        quickReplies = getQuickReplies(trimmed);
      } else {
        responseText = "Mình chuyên hỗ trợ về hải sản 🦐\n👉 Bạn muốn:\n• Xem sản phẩm\n• Tư vấn món ăn?";
        quickReplies = ["Xem sản phẩm", "Tư vấn món ăn"];
      }

      setMessages((prev) => [...prev, { id: msgIdCounter++, role: "bot", text: responseText, timestamp: new Date(), quickReplies }]);
    } catch (err) {
      console.warn("Gemini Error, auto-recovery in 30s", err);

      // 5. Auto-recovery: Tắt AI tạm thời và bật lại sau 30s
      setUsingGemini(false);
      setTimeout(() => {
        setUsingGemini(true);
        initChatSession();
      }, 30000);

      setMessages((prev) => [
        ...prev,
        {
          id: msgIdCounter++,
          role: "bot",
          text: "Hệ thống AI đang bảo trì nhẹ và sẽ quay lại sau 30 giây. Bạn dùng tạm thực đơn hỗ trợ nhé! 🙏",
          timestamp: new Date(),
          quickReplies: ["Xem sản phẩm", "Công thức nấu ăn"]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function getQuickReplies(msg: string): string[] {
    const m = msg.toLowerCase();
    let replies = ["Xem sản phẩm", "Công thức nấu ăn"];
    if (convStateRef.current.cart.length > 0) replies.unshift("🛒 Thanh toán");
    if (/giao hàng|ship/.test(m)) return ["Freeship thế nào?", "Liên hệ"];
    return replies.slice(0, 3);
  }

  function renderText(text: string) {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) return <strong key={j}>{part.slice(2, -2)}</strong>;
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) return <a key={j} href={linkMatch[2]} style={{ color: "#0ea5e9", textDecoration: "underline" }}>{linkMatch[1]}</a>;
          return part;
        })}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  }

  return (
    <div className="chatbox-wrapper" style={{ transform: `translate(${renderPos.x}px, ${renderPos.y}px)` }}>
      <button className={`chatbox-toggle ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)} onMouseDown={handleMouseDown}>
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
        )}
      </button>

      <div className={`chatbox-window ${open ? "visible" : ""}`}>
        <div className="chatbox-header" onMouseDown={handleMouseDown} style={{ cursor: "grab" }}>
          <div className="chatbox-header-avatar">🐟</div>
          <div className="chatbox-header-info">
            <div className="chatbox-header-name">FishMarket AI</div>
            <div className="chatbox-header-status"><span className="status-dot" />{usingGemini ? "Gemini AI" : "Trợ lý Local"}</div>
          </div>
          <button className="chatbox-close-btn" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              {msg.role === "bot" && <div className="bot-avatar">🐟</div>}
              <div className="message-content">
                <div className="message-bubble">{renderText(msg.text)}</div>
                {msg.quickReplies?.length ? (
                  <div className="quick-replies">
                    {msg.quickReplies.map((qr) => (
                      <button key={qr} className="quick-reply-btn" onClick={() => sendMessage(qr)}>{qr}</button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="bot-avatar">🐟</div>
              <div className="message-bubble typing-indicator"><span /><span /><span /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbox-input-area">
          <input
            type="text"
            className="chatbox-input"
            placeholder="Hỏi bất kỳ điều gì..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            disabled={isTyping}
          />
          <button className="chatbox-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}