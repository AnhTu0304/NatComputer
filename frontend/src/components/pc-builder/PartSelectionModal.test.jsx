import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PartSelectionModal from './PartSelectionModal';
import { api } from '../../services/api';

jest.mock('../../services/api');

describe('PartSelectionModal Component', () => {
  const mockCategory = {
    id: 'cpu',
    name: 'CPU',
    fullName: '1. CPU',
    catKey: 'cat_cpu',
  };

  test('fetches and displays products for category', async () => {
    api.getProducts.mockResolvedValueOnce({
      products: [
        {
          id: 'cpu_1',
          name: 'Intel Core i9 14900K',
          price: 15490000,
          specs: { brand: 'Intel', socket: 'LGA1700' },
          stockQuantity: 10,
        },
      ],
    });

    render(
      <PartSelectionModal
        isOpen={true}
        category={mockCategory}
        onClose={jest.fn()}
        onSelectPart={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Intel Core i9 14900K')).toBeInTheDocument();
      expect(screen.getByText(/15\.490\.000/)).toBeInTheDocument();
    });
  });
});
