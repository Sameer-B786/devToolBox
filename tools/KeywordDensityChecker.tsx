import React, { useState } from 'react';
import GeminiTool from '../components/common/GeminiTool';

const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');

  const fullPrompt = `Analyze the following text for keyword density.
Keyword: "${keyword}"
Text: "${text}"
Provide the keyword count, total word count, and keyword density percentage.`;
  
  return (
    <GeminiTool prompt={fullPrompt} userInput="">
      {(_, __) => (
        <div className="space-y-4">
          <div>
              <label htmlFor="keyword-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Keyword
              </label>
              <input
                  type="text"
                  id="keyword-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., SEO"
              />
          </div>
          <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Text to Analyze
              </label>
              <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={8}
                  placeholder="Paste your article or text here..."
              />
          </div>
        </div>
      )}
    </GeminiTool>
  );
};

export default KeywordDensityChecker;
