import React, { useState, useMemo } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

// A sample list of words. In a real app, this could be much larger.
const wordList = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yuzu", "zucchini", "technology", "computer", "internet", "software", "hardware", "network", "database", "security", "programming", "development"];

const RandomWordGenerator: React.FC = () => {
  const [count, setCount] = useState(10);
  const [words, setWords] = useState<string[]>([]);
  const [isCopied, copy] = useCopyToClipboard();

  const generatedWordsText = useMemo(() => words.join(' '), [words]);

  const generateWords = () => {
    const newWords: string[] = [];
    for (let i = 0; i < count; i++) {
      newWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    setWords(newWords);
  };

  return (
    <div>
        <div className="flex items-center gap-4 mb-4">
            <label htmlFor="word-count">Number of Words:</label>
            <input
                type="number"
                id="word-count"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
                className="w-24 p-2 border border-gray-300 rounded-md"
                min="1"
            />
            <ActionButton onClick={generateWords}>Generate</ActionButton>
            <ActionButton onClick={() => copy(generatedWordsText)} variant="secondary" disabled={words.length === 0}>
              {isCopied ? 'Copied!' : 'Copy'}
            </ActionButton>
        </div>
        {words.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                <p className="text-lg leading-relaxed">{generatedWordsText}</p>
            </div>
        )}
    </div>
  );
};

export default RandomWordGenerator;
