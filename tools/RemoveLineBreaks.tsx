import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const RemoveLineBreaks: React.FC = () => {
  const [text, setText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleRemoveLineBreaks = () => {
    setText(text.replace(/(\r\n|\n|\r)/gm, " "));
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Paste text with line breaks here..."
        aria-label="Text input for removing line breaks"
      ></textarea>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={handleRemoveLineBreaks}>Remove Line Breaks</ActionButton>
        <ActionButton onClick={() => copy(text)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
        <ActionButton onClick={() => setText('')} variant="secondary">Clear</ActionButton>
      </div>
    </div>
  );
};

export default RemoveLineBreaks;
