import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const PageSpeedTest: React.FC = () => {
    const prompt = "Act as a page speed analysis expert. Analyze the following website URL and provide a summary of its performance. Include key metrics if possible (like LCP, FCP) and provide at least 3 actionable recommendations to improve its loading speed. Format the output using markdown.";

    return (
        <GeminiTool prompt={prompt} userInput="https://aistudio.google.com" model="gemini-2.5-pro">
            {(input, setInput) => (
                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Website URL to Test
                    </label>
                    <input
                        type="text"
                        id="url-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., https://example.com"
                    />
                </div>
            )}
        </GeminiTool>
    );
};

export default PageSpeedTest;
