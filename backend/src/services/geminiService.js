/**
 * Google Gemini AI Hardware Advisor Service
 * Connects to Gemini 3.6 Flash / 3.5 Flash Lite with Fallback Engine
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

/**
 * Format currency VND for prompts
 */
function fmtVND(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
}

/**
 * Intelligent Rule-Based Fallback Engine
 */
function generateFallbackResponse(query, catalog = []) {
  const lower = query.toLowerCase();
  let matchedProducts = [];
  let reply = '';

  if (
    lower.includes('gaming') ||
    lower.includes('chơi game') ||
    lower.includes('wukong') ||
    lower.includes('valorant') ||
    lower.includes('cs2') ||
    lower.includes('gta') ||
    lower.includes('fps') ||
    lower.includes('20') ||
    lower.includes('25') ||
    lower.includes('30')
  ) {
    matchedProducts = catalog.filter(p => (p.category || '').toLowerCase() === 'gaming').slice(0, 2);
    if (matchedProducts.length === 0) matchedProducts = catalog.slice(0, 2);
    reply = `Dựa trên nhu cầu chiến Game mượt mà ở độ phân giải 2K / 4K với các tựa game nặng như Black Myth: Wukong, Valorant, Cyberpunk 2077, NAT Computer gợi ý dàn máy tối ưu hiệu năng/giá thành với CPU Intel Core i7 / Ultra 7 kết hợp Card đồ họa NVIDIA GeForce RTX 4070 / RTX 5070:
- **CPU**: Xung nhịp cao, đa nhân mạnh mẽ không nghẽn cổ chai.
- **GPU**: Hỗ trợ DLSS 3.5 và Ray Tracing cho khung hình ổn định trên 100+ FPS.
- **RAM & SSD**: 32GB DDR5 Bus cao + 1TB NVMe Gen4 load game tức thì.`;
  } else if (
    lower.includes('đồ họa') ||
    lower.includes('workstation') ||
    lower.includes('render') ||
    lower.includes('3d') ||
    lower.includes('premiere') ||
    lower.includes('autocad') ||
    lower.includes('maya') ||
    lower.includes('3dsmax')
  ) {
    matchedProducts = catalog.filter(p => (p.category || '').toLowerCase() === 'workstation').slice(0, 2);
    if (matchedProducts.length === 0) matchedProducts = catalog.slice(1, 3);
    reply = `Để phục vụ công việc Đồ họa chuyên nghiệp (3DsMax, Maya, Premiere Pro, After Effects Render 4K), hệ thống cần ưu tiên độ ổn định tuyệt đối và bộ nhớ lớn:
- **CPU**: Intel Core i7/i9 hoặc AMD Ryzen 9 với từ 16 nhân trở lên giúp Render mượt mà.
- **RAM**: Tối thiểu 32GB - 64GB DDR5 tránh tràn bộ nhớ khi xử lý timeline phức tạp.
- **Nguồn & Tản nhiệt**: Bộ nguồn 750W-850W chuẩn 80 Plus Gold kèm tản nhiệt nước AIO 240mm/360mm hoạt động 24/7 mát mẻ.`;
  } else if (
    lower.includes('văn phòng') ||
    lower.includes('học tập') ||
    lower.includes('kế toán') ||
    lower.includes('dưới 10') ||
    lower.includes('nhỏ gọn') ||
    lower.includes('giá rẻ')
  ) {
    matchedProducts = catalog.filter(p => (p.category || '').toLowerCase() === 'office').slice(0, 2);
    if (matchedProducts.length === 0) matchedProducts = [catalog[catalog.length - 1] || catalog[0]].filter(Boolean);
    reply = `Với nhu cầu Văn phòng, Học tập, Kế toán đa nhiệm hàng chục tab Chrome và bảng tính Excel lớn, NAT Computer khuyến nghị dàn máy văn phòng bền bỉ:
- **CPU**: Intel Core i3 / i5 thế hệ mới đáp ứng tác vụ nhanh nhạy.
- **Linh kiện chuẩn**: 16GB RAM đa nhiệm mượt, ổ cứng SSD NVMe khởi động máy trong 5 giây.
- **Bảo hành**: 36 tháng 1 đổi 1 tận nơi an tâm sử dụng.`;
  } else {
    matchedProducts = catalog.slice(0, 2);
    reply = `Cảm ơn bạn đã liên hệ NAT Computer! Về câu hỏi "${query}", chúng tôi xin tư vấn cấu hình phần cứng tối ưu nhất kèm chế độ bảo hành 36 tháng chính hãng. Bạn có thể tham khảo các bộ máy tiêu biểu bán chạy hàng đầu dưới đây hoặc chia sẻ thêm mức ngân sách dự kiến để chuyên viên hỗ trợ chi tiết hơn!`;
  }

  return {
    reply,
    recommendedProducts: matchedProducts,
    provider: 'fallback'
  };
}

/**
 * Call Gemini API with System Prompt and Product Catalog
 */
async function generateHardwareAdvice({ message, history = [], catalog = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'invalid_mock_key' || apiKey.startsWith('re_mock_')) {
    return generateFallbackResponse(message, catalog);
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  // Build product catalog summary for Gemini context
  const catalogSummary = (catalog || []).slice(0, 10).map((p, idx) => {
    const specsStr = Object.entries(p.specs || {})
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join(', ');
    return `${idx + 1}. [ID: ${p.id}] ${p.name} - Giá: ${fmtVND(p.price)} (${specsStr || 'Bảo hành 36 tháng'})`;
  }).join('\n');

  const systemInstruction = `Bạn là Chuyên gia tư vấn kỹ thuật phần cứng PC và build máy tính hàng đầu của thương hiệu "NAT Computer".
Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Việt thân thiện, am hiểu kỹ thuật sâu, nhiệt tình, có cấu trúc rõ ràng (sử dụng bullet points, in đậm tên linh kiện quan trọng).
2. Phân tích chi tiết linh kiện: CPU (Intel Core Ultra / AMD Ryzen X3D), GPU (NVIDIA RTX 40 / 50 series), RAM DDR5, SSD NVMe, Tản nhiệt AIO và Nguồn chuẩn 80 Plus.
3. Giải đáp so sánh hiệu năng, ước tính FPS game hoặc thời gian render đồ họa thực tế.
4. Ưu tiên tham khảo và gợi ý các cấu hình máy có sẵn của shop NAT Computer dưới đây:
--- DANH MỤC SẢN PHẨM NAT COMPUTER ---
${catalogSummary}
-------------------------------------
Nếu cấu hình của shop phù hợp, hãy nhắc tên sản phẩm và mã ID tương ứng để khách hàng dễ chọn mua.`;

  // Build Gemini Chat Contents
  const contents = [];

  // Add past conversation turns
  if (Array.isArray(history) && history.length > 0) {
    for (const item of history.slice(-6)) {
      if (item.text) {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      }
    }
  }

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2500
    }
  };

  const primaryModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const modelsToTry = [primaryModel];
  if (!modelsToTry.includes('gemini-3.5-flash-lite')) {
    modelsToTry.push('gemini-3.5-flash-lite');
  }

  for (const currentModel of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Gemini model ${currentModel} returned status ${response.status}, trying next option...`);
        continue;
      }

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!replyText) {
        console.warn(`Gemini model ${currentModel} returned empty candidate, trying next option...`);
        continue;
      }

      // Match recommended products from catalog mentioned in reply or relevant by category
      const matchedProducts = [];
      for (const prod of catalog) {
        if (
          replyText.toLowerCase().includes((prod.id || '').toLowerCase()) ||
          replyText.toLowerCase().includes((prod.name || '').toLowerCase())
        ) {
          matchedProducts.push(prod);
        }
      }

      // If none specifically mentioned, pick top 2 relevant products
      const finalRecommendations = matchedProducts.length > 0
        ? matchedProducts.slice(0, 3)
        : catalog.slice(0, 2);

      return {
        reply: replyText.trim(),
        recommendedProducts: finalRecommendations,
        provider: 'gemini',
        model: currentModel
      };
    } catch (modelErr) {
      clearTimeout(timeoutId);
      console.warn(`Gemini model ${currentModel} failed:`, modelErr.message);
    }
  }

  return generateFallbackResponse(message, catalog);
}

module.exports = {
  generateHardwareAdvice,
  generateFallbackResponse
};
