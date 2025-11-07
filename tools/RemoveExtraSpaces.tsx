import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const RemoveExtraSpaces: React.FC = () => {
  const [text, setText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleRemoveSpaces = () => {
    const newText = text.replace(/\s+/g, ' ').trim();
    setText(newText);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Paste text with extra spaces here..."
        aria-label="Text input for removing extra spaces"
      ></textarea>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={handleRemoveSpaces}>Remove Extra Spaces</ActionButton>
        <ActionButton onClick={() => copy(text)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
        <ActionButton onClick={() => setText('')} variant="secondary">Clear</ActionButton>
      </div>
    </div>
  );
};

export default RemoveExtraSpaces;
