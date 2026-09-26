const ProductModel = require('../models/ProductModel');
const { generateHardwareAdvice } = require('../services/geminiService');
const CacheService = require('../services/cacheService');

class AiController {
  static async chat(req, res) {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Nội dung câu hỏi (message) là bắt buộc và không được để trống.'
      });
    }

    const trimmedMsg = message.trim();
    const isHistoryEmpty = !history || !Array.isArray(history) || history.length === 0;
    const aiCacheKey = CacheService.generateAiKey(trimmedMsg);

    // If query has no previous chat context, serve from cache if available
    if (isHistoryEmpty) {
      const cached = CacheService.get(aiCacheKey);
      if (cached) {
        return res.json({
          success: true,
          reply: cached.reply,
          recommendedProducts: cached.recommendedProducts || [],
          provider: 'gemini-cache'
        });
      }
    }

    try {
      // Get real product catalog from DB to ground Gemini advice
      const catalog = await ProductModel.getAll();

      const result = await generateHardwareAdvice({
        message: trimmedMsg,
        history: Array.isArray(history) ? history : [],
        catalog: Array.isArray(catalog) ? catalog : []
      });

      // Save to cache for 1 hour (3600s) if standalone question
      if (isHistoryEmpty && result && result.reply) {
        CacheService.set(aiCacheKey, {
          reply: result.reply,
          recommendedProducts: result.recommendedProducts || [],
          provider: result.provider || 'gemini'
        }, 3600);
      }

      return res.json({
        success: true,
        reply: result.reply,
        recommendedProducts: result.recommendedProducts || [],
        provider: result.provider || 'gemini'
      });
    } catch (err) {
      console.error('AiController chat error:', err.message);
      return res.status(500).json({
        error: 'Lỗi xử lý phản hồi từ Trợ lý AI.',
        details: err.message
      });
    }
  }
}

module.exports = AiController;
