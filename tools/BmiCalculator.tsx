import React, { useState, useMemo } from 'react';

const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [inches, setInches] = useState('');

  const bmiResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || !h || w <= 0 || h <= 0) return null;

    let bmi;
    if (unit === 'metric') {
      // weight in kg, height in cm
      bmi = w / ((h / 100) * (h / 100));
    } else {
      // weight in lbs, height in feet + inches
      const hInches = h * 12 + (parseFloat(inches) || 0);
      if (hInches <= 0) return null;
      bmi = (w / (hInches * hInches)) * 703;
    }
    
    if (isNaN(bmi) || !isFinite(bmi)) return null;

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    return { value: bmi.toFixed(1), category };
  }, [unit, weight, height, inches]);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <label>
          <input type="radio" name="unit" value="metric" checked={unit === 'metric'} onChange={() => setUnit('metric')} />
          Metric (kg, cm)
        </label>
        <label>
          <input type="radio" name="unit" value="imperial" checked={unit === 'imperial'} onChange={() => setUnit('imperial')} />
          Imperial (lbs, ft, in)
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height ({unit === 'metric' ? 'cm' : 'ft & in'})</label>
          <div className="flex gap-2">
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-2 border rounded-md" placeholder={unit === 'imperial' ? 'feet' : ''} />
            {unit === 'imperial' && <input type="number" value={inches} onChange={e => setInches(e.target.value)} className="w-full p-2 border rounded-md" placeholder="inches" />}
          </div>
        </div>
      </div>
      {bmiResult && (
        <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">Your BMI Result</h3>
            <p className="text-5xl font-bold text-primary my-2">{bmiResult.value}</p>
            <p className="text-xl font-semibold">{bmiResult.category}</p>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
