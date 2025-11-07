import React, { useState, useMemo } from 'react';

const DiscountCalculator: React.FC = () => {
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');

    const result = useMemo(() => {
        const p = parseFloat(price);
        const d = parseFloat(discount);

        if (!p || !d || p <= 0 || d < 0) return null;

        const saved = (p * d) / 100;
        const finalPrice = p - saved;

        return {
            finalPrice: finalPrice.toFixed(2),
            saved: saved.toFixed(2)
        };
    }, [price, discount]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Original Price ($)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Discount (%)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
            </div>
            {result && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border text-center">
                    <div className="mb-4">
                        <p className="text-gray-500">Final Price</p>
                        <p className="text-4xl font-bold text-primary">${result.finalPrice}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">You Saved</p>
                        <p className="text-2xl font-semibold">${result.saved}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCalculator;
