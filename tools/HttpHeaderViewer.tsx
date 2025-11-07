import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const HttpHeaderViewer: React.FC = () => {
    const prompt = "Act as an HTTP Header analysis tool. Fetch the full HTTP response headers for the following URL and display them. If the URL is invalid or unreachable, state that clearly.";

    return (
        <GeminiTool prompt={prompt} userInput="https://google.com">
            {(input, setInput) => (
                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter URL to check headers
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

export default HttpHeaderViewer;
