import React, { useState } from 'react';

const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Paste your text here..."
        aria-label="Text input for character counter"
      ></textarea>
      <div className="mt-6 text-center">
        <div className="bg-gray-50 p-4 rounded-lg border inline-block">
          <div className="text-4xl font-bold text-primary">{text.length}</div>
          <div className="text-sm text-gray-500">Characters</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCounter;
