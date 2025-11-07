import React, { useState, useMemo } from 'react';

const TipCalculator: React.FC = () => {
    const [bill, setBill] = useState('');
    const [tipPercent, setTipPercent] = useState('15');
    const [people, setPeople] = useState('1');

    const result = useMemo(() => {
        const b = parseFloat(bill);
        const t = parseFloat(tipPercent);
        const p = parseInt(people, 10);

        if (!b || b <= 0 || !t || t < 0 || !p || p < 1) return null;

        const tipAmount = (b * t) / 100;
        const totalBill = b + tipAmount;
        const perPerson = totalBill / p;
        
        return {
            tipAmount: tipAmount.toFixed(2),
            totalBill: totalBill.toFixed(2),
            perPerson: perPerson.toFixed(2)
        };
    }, [bill, tipPercent, people]);

    return (
        <div className="md:flex md:gap-8">
            <div className="md:w-1/2">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Bill Amount ($)</label>
                    <input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tip Percentage (%)</label>
                    <div className="flex gap-2">
                        {[5, 10, 15, 20, 25].map(p => (
                            <button key={p} onClick={() => setTipPercent(p.toString())} className={`flex-1 py-2 rounded-md ${tipPercent === p.toString() ? 'bg-primary text-white' : 'bg-gray-200'}`}>{p}%</button>
                        ))}
                    </div>
                     <input type="number" value={tipPercent} onChange={e => setTipPercent(e.target.value)} className="w-full p-2 border rounded-md mt-2" placeholder="Custom Tip" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Number of People</label>
                    <input type="number" value={people} onChange={e => setPeople(e.target.value)} className="w-full p-2 border rounded-md" min="1" />
                </div>
            </div>
             <div className="md:w-1/2 mt-6 md:mt-0">
                {result ? (
                    <div className="p-6 bg-blue-50 rounded-lg border border-primary h-full flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Tip Amount</span>
                                <span className="text-2xl font-bold text-primary">${result.tipAmount}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Total Bill</span>
                                <span className="text-2xl font-bold text-primary">${result.totalBill}</span>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                             <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Per Person</span>
                                <span className="text-3xl font-bold text-primary">${result.perPerson}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-gray-100 rounded-lg h-full flex items-center justify-center">
                        <p className="text-gray-500">Enter bill details to see the result.</p>
                    </div>
                )}
             </div>
        </div>
    );
};

export default TipCalculator;
