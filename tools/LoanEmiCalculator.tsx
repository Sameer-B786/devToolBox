import React, { useState, useMemo } from 'react';

const LoanEmiCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('5'); // in years

  const emiResult = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return null;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - p;
    const totalPayment = emi * n;
    
    if (isNaN(emi)) return null;

    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2)
    };
  }, [principal, rate, tenure]);

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Loan Amount ($)</label>
                <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2 border rounded-md" step="0.1" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Loan Tenure (Years)</label>
                <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
        </div>
        {emiResult && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
                <div className="text-center mb-4">
                    <p className="text-gray-500">Monthly EMI</p>
                    <p className="text-4xl font-bold text-primary">${emiResult.emi}</p>
                </div>
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-gray-500">Total Interest</p>
                        <p className="text-2xl font-semibold">${emiResult.totalInterest}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total Payment</p>
                        <p className="text-2xl font-semibold">${emiResult.totalPayment}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default LoanEmiCalculator;
