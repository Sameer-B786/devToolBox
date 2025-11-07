import React, { useState, useEffect } from 'react';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' }
  ];

  // Static exchange rates for demonstration
  const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.12, MXN: 17.15, USD: 1 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, AUD: 1.66, CAD: 1.48, CHF: 0.96, CNY: 7.88, INR: 90.35, MXN: 18.65, EUR: 1 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.20, AUD: 1.94, CAD: 1.72, CHF: 1.12, CNY: 9.18, INR: 105.20, MXN: 21.70, GBP: 1 },
    JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, AUD: 0.010, CAD: 0.0091, CHF: 0.0059, CNY: 0.048, INR: 0.56, MXN: 0.11, JPY: 1 },
    AUD: { USD: 0.65, EUR: 0.60, GBP: 0.52, JPY: 97.70, CAD: 0.89, CHF: 0.58, CNY: 4.73, INR: 54.25, MXN: 11.20, AUD: 1 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 109.93, AUD: 1.12, CHF: 0.65, CNY: 5.32, INR: 61.09, MXN: 12.61, CAD: 1 },
    CHF: { USD: 1.14, EUR: 1.04, GBP: 0.89, JPY: 169.89, AUD: 1.72, CAD: 1.54, CNY: 8.23, INR: 94.45, MXN: 19.49, CHF: 1 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.65, AUD: 0.21, CAD: 0.19, CHF: 0.12, INR: 11.48, MXN: 2.37, CNY: 1 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087, MXN: 0.21, INR: 1 },
    MXN: { USD: 0.058, EUR: 0.054, GBP: 0.046, JPY: 8.72, AUD: 0.089, CAD: 0.079, CHF: 0.051, CNY: 0.42, INR: 4.83, MXN: 1 }
  };

  const convertCurrency = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      setResult(null);
      return;
    }

    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
        const rate = exchangeRates[fromCurrency][toCurrency];
        const converted = (numAmount * rate).toFixed(2);
        setResult(converted);
      } else {
        setError('Conversion rate not available.');
        setResult(null);
      }
      setLoading(false);
    }, 300);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter amount"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-md"
            aria-label="Swap currencies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 2.1l4 4-4 4"/>
              <path d="M21 6.1H7"/>
              <path d="M7 21.9l-4-4 4-4"/>
              <path d="M3 17.9h14"/>
            </svg>
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {(loading || (result && !error)) && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white text-center">
            {loading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : (
              <>
                <div className="text-sm opacity-90 mb-1">Converted Amount</div>
                <div className="text-3xl font-bold">
                  {currencies.find(c => c.code === toCurrency)?.symbol} {result}
                </div>
                <div className="text-sm opacity-90 mt-2">
                  {amount} {fromCurrency} = {result} {toCurrency}
                </div>
              </>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center pt-4">
          Exchange rates are approximate and for demonstration purposes
        </div>
      </div>
    </div>
  );
}