import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const TextToBinaryConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const textToBinary = () => {
    setOutput(input.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' '));
  };

  const binaryToText = () => {
    try {
      setOutput(input.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
      }).join(''));
    } catch (e) {
      setOutput("Invalid binary string.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Input</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y"
        placeholder="Enter text or binary string..."
      ></textarea>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton onClick={textToBinary}>Text to Binary</ActionButton>
        <ActionButton onClick={binaryToText}>Binary to Text</ActionButton>
        <ActionButton onClick={() => { setInput(''); setOutput(''); }} variant="secondary">Clear</ActionButton>
      </div>

      {output && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Output</h3>
          <div className="relative">
            <textarea
              readOnly
              value={output}
              className="w-full h-40 p-4 border bg-gray-50 border-gray-200 rounded-lg resize-y"
            ></textarea>
            <button onClick={() => copy(output)} className="absolute top-2 right-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 rounded-md text-xs">
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToBinaryConverter;