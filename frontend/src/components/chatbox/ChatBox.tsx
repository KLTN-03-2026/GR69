import { useState, useRef, useEffect } from "react";
import "./ChatBox.css";
import { productService } from "../../services/user/productService";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// Imports từ các files đã tách
import type { Message, ProductItem, ConversationState, LocalResponse } from "./types/types";
import { getLocalResponse, buildSystemPrompt } from "./services/botLogic";
// import { isProductQuery } from "./utils/chatUtils";
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
  const { renderPos, handleMouseDown } = useDraggable(); // Custom hook kéo thả

  // History & State
  const chatHistoryRef = useRef<{ role: "user" | "model"; parts: { text: string }[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convStateRef = useRef<ConversationState>({ stage: "idle", cart: [] });

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function mergeState(prev: ConversationState, next?: Partial<ConversationState>): ConversationState {
    if (!next) return prev;

    return {
      ...prev,
      ...next,
      cart: next.cart ?? prev.cart,
    };
  }
  function processLocalAndSyncCart(trimmedText: string): LocalResponse {
    const local = getLocalResponse(trimmedText, products, convStateRef.current);
    if (local.newState) {
      const oldCartSize = convStateRef.current.cart?.length || 0;
      const newCartSize = local.newState.cart?.length || oldCartSize;

      if (newCartSize > oldCartSize && local.newState.cart) {
        const addedItems = local.newState.cart.slice(oldCartSize);
        addedItems.forEach((item) => {
          let foundProduct = products.find((p) => p.name.toLowerCase().includes(item.name.toLowerCase()));
          if (!foundProduct) {
            foundProduct = { id: Date.now() + Math.random(), name: item.name, price: item.price };
          }
          const qtyNum = Math.max(1, parseFloat(item.qty.replace(/[^0-9.]/g, "")) || 1);
          addToCart(foundProduct, qtyNum);
        });
      }
      convStateRef.current = mergeState(convStateRef.current, local.newState);
    }
    return local;
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

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

      // 1. LUÔN CHẠY LOCAL LOGIC TRƯỚC
      // Hàm này sẽ kiểm tra 9 Intents cố định (Giỏ hàng, giá, tìm kiếm, khiếu nại...)
      const local = processLocalAndSyncCart(trimmed);

      // 2. KIỂM TRA KẾT QUẢ LOCAL
      if (local.text !== "") {
        // Nếu Local bắt được keyword -> Dùng luôn kết quả của Local
        responseText = local.text;
        quickReplies = local.quickReplies;

      } else if (usingGemini) {
        // 3. INTENT 10 (FALLBACK) -> GỌI GEMINI AI XỬ LÝ
        const model = genAI!.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: buildSystemPrompt(products, convStateRef.current.cart) }] },
            { role: "model", parts: [{ text: "Xin chào! Tôi đã sẵn sàng tư vấn." }] },
            ...chatHistoryRef.current,
          ],
          generationConfig: { maxOutputTokens: 300, temperature: 0.6 },
        });

        const result = await chat.sendMessage(trimmed);
        responseText = result.response.text();

        chatHistoryRef.current.push(
          { role: "user", parts: [{ text: trimmed }] },
          { role: "model", parts: [{ text: responseText }] }
        );
        if (chatHistoryRef.current.length > 12) chatHistoryRef.current = chatHistoryRef.current.slice(-12);

        quickReplies = getQuickReplies(trimmed);

      } else {
        // 4. TRƯỜNG HỢP KHÔNG CÓ GEMINI MÀ LOCAL CŨNG KHÔNG HIỂU
        responseText = "Mình chuyên hỗ trợ về hải sản 🦐\n👉 Bạn muốn:\n• Xem sản phẩm\n• Tư vấn món ăn\n• Kiểm tra đơn hàng?";
        quickReplies = ["Xem sản phẩm", "Tư vấn món ăn"];
      }

      // 5. CẬP NHẬT GIAO DIỆN
      setMessages((prev) => [...prev, { id: msgIdCounter++, role: "bot", text: responseText, timestamp: new Date(), quickReplies }]);

    } catch (err) {
      console.warn("Gemini Error, switching to Local Fallback", err);
      setUsingGemini(false);

      // Lỗi do Gemini API (hết quota, rớt mạng...)
      setMessages((prev) => [
        ...prev,
        {
          id: msgIdCounter++,
          role: "bot",
          text: "Xin lỗi, hiện tại trợ lý AI đang bận quá tải 🙏\nBạn có thể chọn các menu bên dưới nhé: 🦐",
          timestamp: new Date(),
          quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function getQuickReplies(msg: string): string[] {
    const m = msg.toLowerCase();
    let replies = ["Xem sản phẩm", "Công thức nấu ăn"];

    if (convStateRef.current.cart.length > 0) {
      replies.unshift("🛒 Thanh toán", "Mua thêm"); // Đẩy lên đầu nếu có đồ trong giỏ
    }

    if (/giao hàng|ship/.test(m)) return ["Freeship thế nào?", "Liên hệ"];
    if (/công thức|nấu/.test(m)) return ["Nấu tôm", "Nấu cá", "Mua nguyên liệu"];

    return replies.slice(0, 3); // Giữ tối đa 3 nút để UI không bị rối
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