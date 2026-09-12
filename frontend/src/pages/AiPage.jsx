import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Zap,
  Cpu,
  Gamepad2,
  Monitor,
  CheckCircle2,
  ShoppingCart,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  {
    icon: Gamepad2,
    text: 'Tư vấn PC Gaming 20 - 30 triệu mượt Valorant, Black Myth Wukong',
    categoryKey: 'pc-gaming',
  },
  {
    icon: Cpu,
    text: 'Cấu hình Workstation làm đồ họa 3DsMax, Premiere 4K Render',
    categoryKey: 'workstation',
  },
  {
    icon: Zap,
    text: 'So sánh chip Intel Core Ultra 7 vs AMD Ryzen 7 7800X3D',
    categoryKey: 'pc-amd',
  },
  {
    icon: Monitor,
    text: 'PC Văn phòng học tập nhỏ gọn dưới 10 triệu bền bỉ',
    categoryKey: 'pc-office',
  },
];

export default function AiPage({ onAddToCart }) {
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);

  // Default initial welcome conversation
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý AI tư vấn cấu hình phần cứng của NAT Computer. Bạn đang tìm cấu hình PC cho mục đích Gaming, Làm Đồ Họa / Render 3D, hay Văn phòng với mức ngân sách khoảng bao nhiêu triệu?',
      time: 'Vừa xong',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProducts().then(res => {
      if (isMounted && res && res.products && res.products.length > 0) {
        setLiveProducts(res.products);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const pcCatalog = liveProducts;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current && typeof chatBottomRef.current.scrollIntoView === 'function') {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const queryText = textToSend || inputMsg;
    if (!queryText.trim()) return;

    const userMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: queryText.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    // AI Knowledge Matching Algorithm
    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let matchedProducts = [];
      let botResponseText = '';

      if (lower.includes('gaming') || lower.includes('chơi game') || lower.includes('wukong') || lower.includes('valorant') || lower.includes('20') || lower.includes('30')) {
        matchedProducts = pcCatalog.slice(0, 2);
        botResponseText = 'Dựa trên nhu cầu Gaming mượt mà ở độ phân giải 2K / 4K với các tựa game nặng như Black Myth Wukong, Valorant, GTA V, tôi xin khuyến nghị dàn PC Gaming trang bị Intel Core i7 / Ultra 7 kết hợp Card đồ họa NVIDIA RTX 4070 / RTX 5070 tối ưu hiệu năng/giá thành nhất cho bạn:';
      } else if (lower.includes('đồ họa') || lower.includes('workstation') || lower.includes('render') || lower.includes('3d') || lower.includes('premiere')) {
        matchedProducts = [pcCatalog[1], pcCatalog[2]].filter(Boolean);
        botResponseText = 'Để làm công việc Đồ họa chuyên sâu 3DsMax, Maya, Premiere Pro Render video 4K không bị giật lag, bạn cần hệ thống trang bị nhiều nhân thực CPU (16 Cores+) cùng RAM 32GB DDR5 Bus cao. Dưới đây là cấu hình Workstation tối ưu cho công việc của bạn:';
      } else if (lower.includes('so sánh') || lower.includes('intel') || lower.includes('amd') || lower.includes('7800x3d') || lower.includes('ultra 7')) {
        matchedProducts = [pcCatalog[0], pcCatalog[2]].filter(Boolean);
        botResponseText = 'Về so sánh vi xử lý: **Intel Core Ultra 7 270K** nổi bật với khả năng xử lý đa nhiệm 16 nhân 24 luồng vượt trội cho cả gaming lẫn làm việc nặng. Trong khi đó, **AMD Ryzen 7 7800X3D** với bộ nhớ đệm 3D V-Cache là "ông vua" tối ưu khung hình FPS tối đa cho game thủ eSports. Dưới đây là 2 bộ máy tương ứng:';
      } else if (lower.includes('văn phòng') || lower.includes('học tập') || lower.includes('dưới 10') || lower.includes('nhỏ gọn')) {
        matchedProducts = [pcCatalog[3] || pcCatalog[0]];
        botResponseText = 'Với nhu cầu công việc Văn phòng, Học tập, Kế toán mượt mở hàng chục tab Chrome và file Excel nặng, cấu hình PC Mini / Văn phòng trang bị SSD NVMe tốc độ cao và bộ nguồn chuẩn 80 Plus sẽ đảm bảo máy chạy êm ái, bền bỉ suốt 5-10 năm:';
      } else {
        matchedProducts = pcCatalog.slice(0, 2);
        botResponseText = `Cảm ơn câu hỏi của bạn về "${queryText}". Dựa trên phân tích tương thích phần cứng của NAT Computer, tôi xin đề xuất cho bạn dòng PC bán chạy nhất với cấu hình chuẩn bảo hành 36 tháng chính hãng:`;
      }

      const botMsgObj = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        recommendedProducts: matchedProducts,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsgObj]);
      setIsTyping(false);
    }, 1000);
  };

  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <main className="ai-page-root wrap">
      {/* Top AI Page Title Header */}
      <div className="ai-page-header">
        <div className="ai-header-badge">
          <Sparkles size={16} color="#1c69d4" />
          <span>NAT AI HARDWARE ENGINE 2.0</span>
        </div>
        <h1 className="ai-page-title">TRỢ LÝ AI TƯ VẤN CẤU HÌNH PC BÁN HÀNG</h1>
        <p className="ai-page-desc">
          Đặt bất kỳ câu hỏi nào về chọn linh kiện, ngân sách, so sánh hiệu năng CPU/VGA. Trợ lý AI sẽ ngay lập tức giải đáp và đề xuất bộ máy tối ưu nhất!
        </p>
      </div>

      {/* Main Chat Assistant Container */}
      <div className="ai-chat-container">
        {/* Chat Header Bar */}
        <div className="ai-chat-bar-head">
          <div className="bot-info-flex">
            <div className="bot-avatar-circle">
              <Bot size={24} color="#ffffff" />
            </div>
            <div>
              <h3 className="bot-name">NAT AI EXPERT ADVISOR</h3>
              <span className="bot-status">● Đang hoạt động trực tuyến 24/7</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() =>
              setMessages([
                {
                  id: Date.now(),
                  sender: 'bot',
                  text: 'Hội thoại đã được làm mới. Hãy cho tôi biết nhu cầu chọn PC mới của bạn!',
                  time: 'Vừa xong',
                },
              ])
            }
          >
            <RefreshCw size={14} /> Làm mới trò chuyện
          </button>
        </div>

        {/* Quick Suggested Prompts List */}
        <div className="ai-quick-prompts-bar">
          <span className="prompts-label">Gợi ý câu hỏi phổ biến:</span>
          <div className="prompts-scroll-wrap">
            {QUICK_PROMPTS.map((qp, idx) => {
              const IconComp = qp.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  className="quick-prompt-pill"
                  onClick={() => handleSendMessage(qp.text)}
                >
                  <IconComp size={14} color="#1c69d4" />
                  <span>{qp.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages Body Area */}
        <div className="ai-chat-messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
              <div className="message-avatar-circle">
                {msg.sender === 'bot' ? <Bot size={18} color="#ffffff" /> : <User size={18} color="#ffffff" />}
              </div>

              <div className="message-bubble-content">
                <div className="message-text">{msg.text}</div>

                {/* Recommended Product Cards inside AI Message */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="ai-product-recommendations-grid">
                    {msg.recommendedProducts.map((prod) => (
                      <div key={prod.id} className="ai-product-card-item">
                        <img src={prod.image} alt={prod.name} className="ai-prod-thumb" />
                        <div className="ai-prod-info">
                          <h4 className="ai-prod-title">{prod.name}</h4>
                          <div className="ai-prod-price-row">
                            <span className="current-price">{fmt(prod.price)}</span>
                            {prod.originalPrice && <span className="old-price">{fmt(prod.originalPrice)}</span>}
                          </div>
                          {prod.specifications && (
                            <ul className="ai-prod-specs-list">
                              {prod.specifications.slice(0, 2).map((s, i) => (
                                <li key={i}>✓ {s}</li>
                              ))}
                            </ul>
                          )}
                          <div className="ai-prod-card-btns">
                            <button
                              type="button"
                              className="btn btn-red btn-sm hover-btn-effect"
                              onClick={() => {
                                onAddToCart?.(prod);
                                navigate('/checkout', { state: { directBuyItem: prod } });
                              }}
                            >
                              <Zap size={14} /> Mua Ngay
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => onAddToCart?.(prod)}
                            >
                              <ShoppingCart size={14} /> Thêm Giỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <span className="message-time-stamp">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-message-row bot typing">
              <div className="message-avatar-circle">
                <Bot size={18} color="#ffffff" />
              </div>
              <div className="message-bubble-content typing-bubble">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          className="ai-chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Hỏi AI về chọn PC Gaming, card VGA, CPU, ngân sách 15tr, 20tr..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-red ai-send-btn hover-btn-effect"
            disabled={!inputMsg.trim()}
          >
            <Send size={16} />
            <span>GỬI CÂU HỎI</span>
          </button>
        </form>
      </div>
    </main>
  );
}