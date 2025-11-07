import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const SitemapGenerator: React.FC = () => {
    const prompt = "Act as an XML sitemap generator. Crawl the following website URL and generate a basic sitemap.xml file content. Include the main pages you can find. The output should be only the XML code.";

    return (
        <GeminiTool prompt={prompt} userInput="https://aistudio.google.com" model="gemini-2.5-pro">
            {(input, setInput) => (
                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Website URL to Generate Sitemap
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

export default SitemapGenerator;
