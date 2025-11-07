import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const WhoisLookup: React.FC = () => {
    const prompt = "Act as a WHOIS lookup tool. Provide the full WHOIS registration data for the following domain.";

    return (
        <GeminiTool prompt={prompt} userInput="google.com">
            {(input, setInput) => (
                <div>
                    <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter domain for WHOIS lookup
                    </label>
                    <input
                        type="text"
                        id="domain-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., example.com"
                    />
                </div>
            )}
        </GeminiTool>
    );
};

export default WhoisLookup;
