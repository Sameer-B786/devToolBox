import React, { useState, useMemo } from 'react';

type CalcMode = 'percentOf' | 'isWhatPercent' | 'increaseDecrease';

const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('percentOf');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const result = useMemo(() => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    if (isNaN(num1) || isNaN(num2)) return '';

    switch (mode) {
      case 'percentOf':
        return (num2 / 100) * num1;
      case 'isWhatPercent':
        if (num2 === 0) return 'Cannot divide by zero';
        return (num1 / num2) * 100;
      case 'increaseDecrease':
        if (num1 === 0) return 'Cannot calculate from zero';
        return ((num2 - num1) / num1) * 100;
      default:
        return '';
    }
  }, [mode, val1, val2]);
  
  const renderInputs = () => {
    switch(mode) {
        case 'percentOf':
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="p-2 border rounded-md w-24" />
                    <span>% of</span>
                    <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="p-2 border rounded-md w-24" />
                </div>
            );
        case 'isWhatPercent':
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="p-2 border rounded-md w-24" />
                    <span>is what percent of</span>
                    <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="p-2 border rounded-md w-24" />
                    <span>?</span>
                </div>
            )
        case 'increaseDecrease':
            return (
                 <div className="flex items-center gap-2 flex-wrap">
                    <span>Percentage increase/decrease from</span>
                    <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="p-2 border rounded-md w-24" />
                    <span>to</span>
                    <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="p-2 border rounded-md w-24" />
                </div>
            )
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 border-b">
        <button onClick={() => setMode('percentOf')} className={`px-4 py-2 ${mode === 'percentOf' ? 'border-b-2 border-primary text-primary' : ''}`}>Percentage of</button>
        <button onClick={() => setMode('isWhatPercent')} className={`px-4 py-2 ${mode === 'isWhatPercent' ? 'border-b-2 border-primary text-primary' : ''}`}>X is % of Y</button>
        <button onClick={() => setMode('increaseDecrease')} className={`px-4 py-2 ${mode === 'increaseDecrease' ? 'border-b-2 border-primary text-primary' : ''}`}>Increase/Decrease</button>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        {renderInputs()}
      </div>

      {result !== '' && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <p className="text-3xl font-bold text-primary p-4 bg-gray-50 rounded-lg border">
              {typeof result === 'number' ? result.toFixed(2) : result}
              {mode !== 'percentOf' && typeof result === 'number' && '%'}
            </p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculator;
