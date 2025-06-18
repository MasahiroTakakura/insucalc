'use client';

import { useState } from 'react';

interface InputRow {
  day: string;
  dose: string;
}

export function InsulinCalculator() {
  const [selectedDrugCode, setSelectedDrugCode] = useState('023524');
  const [inputRows, setInputRows] = useState<InputRow[]>(
    Array.from({ length: 31 }, (_, i) => ({
      day: (i + 1).toString(),
      dose: ''
    }))
  );
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [printComment, setPrintComment] = useState('');

  const updateRow = (index: number, field: keyof InputRow, value: string) => {
    const newRows = [...inputRows];
    newRows[index][field] = value;
    setInputRows(newRows);
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const generateOutput = () => {
    const data: { [key: string]: number[] } = {};
    let hasValidData = false;

    inputRows.forEach(row => {
      const day = parseInt(row.day);
      const dose = parseFloat(row.dose);

      if (!isNaN(day) && !isNaN(dose) && dose > 0) {
        hasValidData = true;
        if (!data[dose]) {
          data[dose] = [];
        }
        data[dose].push(day);
      }
    });

    if (!hasValidData) {
      showMessage('有効なデータが入力されていません。', 'error');
      return;
    }

    let outputText = '';
    const insulinPerKit = 300;

    Object.keys(data)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .forEach(dose => {
        const doseNum = parseFloat(dose);
        const kitVal = Math.round(doseNum / insulinPerKit * 1000) / 1000;
        
        outputText += "'000195\n";
        outputText += `${selectedDrugCode} ${kitVal.toFixed(3)}KT\n`;

        const days = data[dose].sort((a, b) => a - b);
        let startDay = days[0];
        let span = 1;

        for (let i = 1; i < days.length; i++) {
          if (days[i] === days[i-1] + 1) {
            span++;
          } else {
            outputText += `'${startDay}-1-${span}\n`;
            startDay = days[i];
            span = 1;
          }
        }
        outputText += `'${startDay}-1-${span}\n\n`;
      });

    setOutput(outputText);
    showMessage('出力データが生成されました！', 'success');
  };

  const clearDoses = () => {
    setInputRows(inputRows.map(row => ({ ...row, dose: '' })));
    setOutput('');
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="p-6">
      <div className="mb-8 print:hidden">
        <h2 className="text-lg font-medium mb-4 border-l-4 border-[#4facfe] pl-3">薬剤コード選択</h2>
        <div className="flex gap-4">
          <button
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              selectedDrugCode === '023524'
                ? 'border-[#4facfe] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white shadow-lg -translate-y-0.5'
                : 'border-gray-200 hover:border-[#4facfe]'
            }`}
            onClick={() => setSelectedDrugCode('023524')}
          >
            インスリンリスプロ
            <div className="text-sm opacity-75 mt-1">（023524）</div>
          </button>
          <button
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              selectedDrugCode === '089109'
                ? 'border-[#4facfe] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white shadow-lg -translate-y-0.5'
                : 'border-gray-200 hover:border-[#4facfe]'
            }`}
            onClick={() => setSelectedDrugCode('089109')}
          >
            インスリングラルギン
            <div className="text-sm opacity-75 mt-1">（089109）</div>
          </button>
        </div>
      </div>

      <div className="mb-8 print:hidden">
        <h2 className="text-lg font-medium mb-4 border-l-4 border-[#4facfe] pl-3">データ入力</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {inputRows.map((row, index) => (
              <div key={index} className="flex gap-4 mb-4 items-center">
                <div className="w-24 p-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-center">
                  {row.day}日
                </div>
                <input
                  type="number"
                  placeholder="投与量"
                  min="0"
                  step="0.1"
                  value={row.dose}
                  onChange={(e) => updateRow(index, 'dose', e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 print:hidden">
        <button
          onClick={generateOutput}
          className="flex-1 p-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:-translate-y-0.5 transition-transform"
        >
          ✨ 出力データを生成
        </button>
        <button
          onClick={clearDoses}
          className="flex-1 p-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-transform"
        >
          クリア
        </button>
      </div>

      {output && (
        <div className="bg-gray-50 rounded-xl p-6">
          {/* 印刷時のみ表示されるコメント */}
          {printComment && (
            <div className="mb-4 text-base text-gray-700 print:block hidden">
              {printComment}
            </div>
          )}
          <h2 className="text-lg font-medium mb-4 print:hidden">生成結果</h2>
          <div className="bg-white rounded-lg p-4 font-mono text-sm whitespace-pre-line border border-gray-200 max-h-96 overflow-y-auto print:overflow-visible print:max-h-none">
            {output}
          </div>
          <button
            onClick={() => window.print()}
            className="mt-4 p-3 bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] text-gray-800 rounded-lg hover:-translate-y-0.5 transition-transform print:hidden"
          >
            🖨️ 印刷表示
          </button>
        </div>
      )}

      {output && (
        <div className="mb-8 print:hidden">
          <h2 className="text-lg font-medium mb-4 border-l-4 border-[#4facfe] pl-3">印刷用コメント</h2>
          <textarea
            value={printComment}
            onChange={e => setPrintComment(e.target.value)}
            placeholder="印刷時に生成結果の上に表示されるコメントを入力してください"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#4facfe] focus:outline-none resize-none min-h-[60px]"
          />
        </div>
      )}

      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } print:hidden`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
} 