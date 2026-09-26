import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AiPage from './AiPage';
import api from '../services/api';

jest.mock('../services/api', () => ({
  getProducts: jest.fn().mockResolvedValue({
    products: [
      { id: 'pc-1', name: 'PC Gaming RTX 4070', price: 25000000, category: 'gaming', image: 'test.jpg' }
    ]
  }),
  sendAiChat: jest.fn().mockResolvedValue({
    success: true,
    reply: 'Chào bạn, dàn PC Gaming RTX 4070 là lựa chọn xuất sắc trong tầm giá 25 triệu!',
    recommendedProducts: [
      { id: 'pc-1', name: 'PC Gaming RTX 4070', price: 25000000, image: 'test.jpg' }
    ],
    provider: 'gemini'
  })
}));

describe('AiPage (Google Gemini Chatbot)', () => {
  beforeEach(() => {
    api.getProducts.mockResolvedValue({
      products: [
        { id: 'pc-1', name: 'PC Gaming RTX 4070', price: 25000000, category: 'gaming', image: 'test.jpg' }
      ]
    });
    api.sendAiChat.mockResolvedValue({
      success: true,
      reply: 'Chào bạn, dàn PC Gaming RTX 4070 là lựa chọn xuất sắc trong tầm giá 25 triệu!',
      recommendedProducts: [
        { id: 'pc-1', name: 'PC Gaming RTX 4070', price: 25000000, image: 'test.jpg' }
      ],
      provider: 'gemini'
    });
  });

  test('renders AI chatbot header and suggested prompts', async () => {
    render(
      <MemoryRouter>
        <AiPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/TRỢ LÝ AI TƯ VẤN CẤU HÌNH PC BÁN HÀNG/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Google Gemini AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Tư vấn PC Gaming 20 - 30 triệu/i)).toBeInTheDocument();
  });

  test('sends query and displays Gemini AI response and recommended product card', async () => {
    render(
      <MemoryRouter>
        <AiPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Hỏi AI về chọn PC/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Tư vấn PC 25 triệu' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.sendAiChat).toHaveBeenCalledWith(
        'Tư vấn PC 25 triệu',
        expect.any(Array)
      );
    });

    expect(await screen.findByText(/Google Gemini 3.6 Flash/i)).toBeInTheDocument();
    expect(screen.getByText(/dàn PC Gaming RTX 4070 là lựa chọn xuất sắc/i)).toBeInTheDocument();
  });
});
