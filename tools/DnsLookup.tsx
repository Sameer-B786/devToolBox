import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const DnsLookup: React.FC = () => {
    const prompt = "Act as a DNS lookup tool. Perform a DNS lookup for the following domain and provide common records like A, CNAME, MX, and NS. Format the output clearly.";

    return (
        <GeminiTool prompt={prompt} userInput="google.com">
            {(input, setInput) => (
                <div>
                    <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter domain to look up
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

export default DnsLookup;
