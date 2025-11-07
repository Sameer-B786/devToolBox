import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const RemoveDuplicateLines: React.FC = () => {
  const [text, setText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleRemoveDuplicates = () => {
    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)];
    setText(uniqueLines.join('\n'));
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Paste your list here, one item per line..."
        aria-label="Text input for removing duplicate lines"
      ></textarea>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={handleRemoveDuplicates}>Remove Duplicates</ActionButton>
        <ActionButton onClick={() => copy(text)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
        <ActionButton onClick={() => setText('')} variant="secondary">Clear</ActionButton>
      </div>
    </div>
  );
};

export default RemoveDuplicateLines;
