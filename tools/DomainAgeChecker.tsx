import React, { useState } from 'react';

// --- Icon Components (to replace lucide-react dependency) ---
const Icon = ({ children, size = 20, className = '' }: { children: React.ReactNode, size?: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {children}
    </svg>
);

const GlobeIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></Icon>;
const CalendarIcon = (props: any) => <Icon {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></Icon>;
const ClockIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const SearchIcon = (props: any) => <Icon {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Icon>;
const LoaderIcon = (props: any) => <Icon {...props} className={`animate-spin ${props.className || ''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>;
const AlertCircleIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></Icon>;
const CheckCircleIcon = (props: any) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></Icon>;
const InfoIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>;


export default function DomainAgeChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractDomain = (input: string) => {
    let cleaned = input.trim().toLowerCase();
    cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, '');
    cleaned = cleaned.replace(/\/.*$/, '');
    return cleaned;
  };

  const calculateAge = (createdDate: string) => {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = (diffDays % 365) % 30;

    return { years, months, days, totalDays: diffDays };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const checkDomainAge = async () => {
    if (!domain) {
      setError('Please enter a domain name');
      return;
    }

    const cleanDomain = extractDomain(domain);
    
    if (!cleanDomain || !cleanDomain.includes('.')) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // NOTE: Using a demo WHOIS API. In a real-world scenario, this might be rate-limited or require a paid key.
      const response = await fetch(`https://api.whoisfreaks.com/v1.0/whois?apiKey=demo&whois=live&domainName=${cleanDomain}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch domain information from API.');
      }

      const data = await response.json();
      
      if (data.create_date || data.created_date) {
        const createdDate = data.create_date || data.created_date;
        const expiryDate = data.expiry_date || data.registry_data?.expiry_date;
        const updatedDate = data.update_date || data.updated_date;
        const registrar = data.registrar_name || data.registrar;
        
        const age = calculateAge(createdDate);

        setResult({
          domain: cleanDomain,
          createdDate: createdDate,
          expiryDate: expiryDate,
          updatedDate: updatedDate,
          registrar: registrar,
          age: age,
          status: data.status || 'Active'
        });
      } else {
        throw new Error('Domain information not found. The domain may not be registered or data is unavailable.');
      }
    } catch (err) {
      console.error('API Error, falling back to demo data:', err);
      
      // Fallback to mock data for demonstration purposes
      const mockCreatedDate = new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000);
      const mockExpiryDate = new Date(Date.now() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
      const age = calculateAge(mockCreatedDate.toISOString());

      setResult({
        domain: cleanDomain,
        createdDate: mockCreatedDate.toISOString(),
        expiryDate: mockExpiryDate.toISOString(),
        updatedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        registrar: 'Sample Registrar Inc.',
        age: age,
        status: 'Active',
        isDemo: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDomainAge();
    }
  };

  const getAgeColor = (years: number) => {
    if (years >= 10) return 'text-green-600';
    if (years >= 5) return 'text-blue-600';
    if (years >= 2) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getTrustScore = (years: number) => {
    if (years >= 10) return { score: 95, label: 'Excellent', color: 'green' };
    if (years >= 5) return { score: 80, label: 'Very Good', color: 'blue' };
    if (years >= 2) return { score: 65, label: 'Good', color: 'yellow' };
    if (years >= 1) return { score: 50, label: 'Moderate', color: 'orange' };
    return { score: 35, label: 'New', color: 'red' };
  };

  const trustScore = result ? getTrustScore(result.age.years) : null;

  return (
    <div className="-m-6 sm:-m-8">
        <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-3">
            <div className="flex-1 relative">
                <GlobeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter domain name (e.g., example.com)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
                />
            </div>
            <button
                onClick={checkDomainAge}
                disabled={loading || !domain}
                className="px-8 py-4 bg-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
                {loading ? (
                <>
                    <LoaderIcon size={20} />
                    Checking...
                </>
                ) : (
                <>
                    <SearchIcon size={20} />
                    Check
                </>
                )}
            </button>
            </div>

            {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircleIcon className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
            </div>
            )}
        </div>

        {/* Results */}
        {result && (
            <div className="space-y-6">
            {result.isDemo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <InfoIcon className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> Could not reach the live WHOIS API. Showing realistic sample data instead.
                </div>
                </div>
            )}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                <CheckCircleIcon size={24} />
                <h2 className="text-2xl font-bold">{result.domain}</h2>
                </div>
                <p className="text-indigo-100">Domain is registered and active</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-indigo-200">
                <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="text-indigo-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Domain Age</h3>
                </div>
                <div className={`text-5xl font-bold mb-2 ${getAgeColor(result.age.years)}`}>
                {result.age.years} {result.age.years === 1 ? 'Year' : 'Years'}
                {result.age.months > 0 && (
                    <span className="text-3xl"> {result.age.months} {result.age.months === 1 ? 'Month' : 'Months'}</span>
                )}
                </div>
                <p className="text-gray-600">
                {result.age.totalDays.toLocaleString()} days old
                </p>
            </div>

            {trustScore && (
                 <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Trust Score</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                            className={`h-full bg-${trustScore.color}-500 transition-all duration-500`}
                            style={{ width: `${trustScore.score}%` }}
                            />
                        </div>
                        </div>
                        <div className="text-right">
                        <div className={`text-2xl font-bold text-${trustScore.color}-600`}>
                            {trustScore.score}%
                        </div>
                        <div className="text-sm text-gray-600">
                            {trustScore.label}
                        </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Older domains are generally considered more trustworthy by search engines.
                    </p>
                </div>
            )}
           

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="text-green-600" size={20} />
                    <h4 className="font-semibold text-gray-700">Created Date</h4>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatDate(result.createdDate)}</p>
                </div>
                {result.expiryDate && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="text-orange-600" size={20} />
                    <h4 className="font-semibold text-gray-700">Expiry Date</h4>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatDate(result.expiryDate)}</p>
                </div>
                )}
                {result.updatedDate && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-gray-700">Last Updated</h4>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatDate(result.updatedDate)}</p>
                </div>
                )}
                {result.registrar && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                    <GlobeIcon className="text-purple-600" size={20} />
                    <h4 className="font-semibold text-gray-700">Registrar</h4>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{result.registrar}</p>
                </div>
                )}
            </div>
            </div>
        )}
    </div>
  );
}
