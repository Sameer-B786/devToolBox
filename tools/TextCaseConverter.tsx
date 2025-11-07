import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';

const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Type or paste your text here..."
        aria-label="Text input for case conversion"
      ></textarea>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={() => setText(text.toUpperCase())}>UPPERCASE</ActionButton>
        <ActionButton onClick={() => setText(text.toLowerCase())}>lowercase</ActionButton>
        <ActionButton onClick={() => setText(toTitleCase(text))}>Title Case</ActionButton>
        <ActionButton onClick={() => setText(toSentenceCase(text))}>Sentence case</ActionButton>
        <ActionButton onClick={() => copy(text)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
        <ActionButton onClick={() => setText('')} variant="secondary">Clear</ActionButton>
      </div>
    </div>
  );
};

export default TextCaseConverter;
