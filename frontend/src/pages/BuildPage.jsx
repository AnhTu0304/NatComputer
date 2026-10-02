import React from 'react';
import PcBuilderTable from '../components/pc-builder/PcBuilderTable';

export default function BuildPage({ onAddToCart }) {
  return (
    <main className="min-h-screen bg-slate-50/50 py-6 sm:py-10">
      <PcBuilderTable onAddToCart={onAddToCart} />
    </main>
  );
}