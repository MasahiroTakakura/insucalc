'use client';

import { InsulinCalculator } from '@/components/InsulinCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white p-8 text-center">
          <h1 className="text-2xl font-light mb-2">🏥 インスリン入力生成</h1>
          <p className="opacity-90 text-sm">日付と投与量から薬剤入力データを自動生成</p>
        </div>
        <InsulinCalculator />
      </div>
    </main>
  );
}
