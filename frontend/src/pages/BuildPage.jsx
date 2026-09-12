import React from 'react';
import ThreeDBuilderSection from '../components/ThreeDBuilderSection';

export default function BuildPage({ onAddToCart }) {
  return (
    <main className="build-page-main wrap">
      <ThreeDBuilderSection onAddToCart={onAddToCart} />
    </main>
  );
}