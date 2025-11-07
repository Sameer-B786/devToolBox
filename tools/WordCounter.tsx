import React, { useState, useMemo } from 'react';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) {
        return { words: 0, characters: 0, sentences: 0, paragraphs: 0 };
    }
    
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/) : [];
    const characters = text.length;
    const sentences = trimmedText ? (trimmedText.match(/[\w|\)][.?!](\s|$)/g) || []).length : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

    return {
      words: words.length,
      characters,
      sentences: sentences > 0 ? sentences : (trimmedText ? 1 : 0),
      paragraphs,
    };
  }, [text]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Paste your text here..."
        aria-label="Text input for word counter"
      ></textarea>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-3xl font-bold text-primary">{stats.words}</div>
          <div className="text-sm text-gray-500">Words</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-3xl font-bold text-primary">{stats.characters}</div>
          <div className="text-sm text-gray-500">Characters</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-3xl font-bold text-primary">{stats.sentences}</div>
          <div className="text-sm text-gray-500">Sentences</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-3xl font-bold text-primary">{stats.paragraphs}</div>
          <div className="text-sm text-gray-500">Paragraphs</div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
