import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const TextReverser: React.FC = () => {
  const [text, setText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const reverseCharacters = () => setText(text.split('').reverse().join(''));
  const reverseWords = () => setText(text.split(/\s+/).reverse().join(' '));
  const reverseLines = () => setText(text.split('\n').reverse().join('\n'));

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Enter text to be reversed..."
        aria-label="Text input for reversing text"
      ></textarea>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={reverseCharacters}>Reverse Characters</ActionButton>
        <ActionButton onClick={reverseWords}>Reverse Words</ActionButton>
        <ActionButton onClick={reverseLines}>Reverse Lines</ActionButton>
        <ActionButton onClick={() => copy(text)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
        <ActionButton onClick={() => setText('')} variant="secondary">Clear</ActionButton>
      </div>
    </div>
  );
};

export default TextReverser;
