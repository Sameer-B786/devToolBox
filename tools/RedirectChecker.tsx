import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const RedirectChecker: React.FC = () => {
    const prompt = "Act as a URL redirect checker. Trace the full redirect path for the following URL, showing each step and status code, and the final destination URL.";

    return (
        <GeminiTool prompt={prompt} userInput="http://google.com">
            {(input, setInput) => (
                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter URL to check for redirects
                    </label>
                    <input
                        type="text"
                        id="url-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., http://t.co/aBcDeFg"
                    />
                </div>
            )}
        </GeminiTool>
    );
};

export default RedirectChecker;
