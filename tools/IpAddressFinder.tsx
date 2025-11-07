import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ActionButton from '../components/common/ActionButton';
import LoadingSpinner from '../components/common/LoadingSpinner';

const IpAddressFinder: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const findIp = async () => {
        setLoading(true);
        setError('');
        setResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: "What is my public IP address? Also provide any available location information like city, region, and country. Format the result cleanly.",
            });
            setResult(response.text);
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <ActionButton onClick={findIp} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Find My IP Address'}
            </ActionButton>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {result && (
                <div className="mt-6">
                    <pre className="bg-gray-50 p-4 rounded-lg border text-sm whitespace-pre-wrap font-mono">
                        <code>{result}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default IpAddressFinder;
