import React, { useState, useCallback } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const loremIpsumParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LoremIpsumGenerator: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(5);
  const [generatedText, setGeneratedText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const generate = useCallback(() => {
    const text = Array(paragraphs).fill(loremIpsumParagraph).join('\n\n');
    setGeneratedText(text);
  }, [paragraphs]);
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="paragraphs">Number of Paragraphs:</label>
        <input
          type="number"
          id="paragraphs"
          value={paragraphs}
          onChange={(e) => setParagraphs(Math.max(1, parseInt(e.target.value, 10)))}
          className="w-24 p-2 border border-gray-300 rounded-md"
          min="1"
        />
        <ActionButton onClick={generate}>Generate</ActionButton>
        <ActionButton onClick={() => copy(generatedText)} variant="secondary" disabled={!generatedText}>
          {isCopied ? 'Copied!' : 'Copy'}
        </ActionButton>
      </div>
      {generatedText && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-lg max-h-96 overflow-y-auto">
          {generatedText.split('\n\n').map((p, i) => <p key={i} className="mb-4 last:mb-0">{p}</p>)}
        </div>
      )}
    </div>
  );
};

export default LoremIpsumGenerator;
