import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ActionButton from './ActionButton';
import LoadingSpinner from './LoadingSpinner';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface GeminiToolProps {
  prompt: string;
  userInput: string;
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  children: (input: string, setInput: (value: string) => void) => React.ReactNode;
  buttonText?: string;
}

const GeminiTool: React.FC<GeminiToolProps> = ({ prompt, userInput, model = 'gemini-2.5-flash', children, buttonText = "Check" }) => {
  const [input, setInput] = useState(userInput);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleSubmit = async () => {
    // Allow empty input if the prompt is self-contained, and conditionally construct the prompt.
    if (!input && !prompt) {
      setError('Please provide an input.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const contents = input ? `${prompt}: "${input}"` : prompt;
      const response = await ai.models.generateContent({
        model,
        contents,
      });
      setResult(response.text);
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching the result.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {children(input, setInput)}
      <div className="mt-4 flex gap-2">
        <ActionButton onClick={handleSubmit} disabled={loading}>
          {loading ? <LoadingSpinner /> : buttonText}
        </ActionButton>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-50 p-4 rounded-lg border text-sm whitespace-pre-wrap font-mono relative">
            <code>{result}</code>
            <button
              onClick={() => copy(result)}
              className="absolute top-2 right-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 rounded-md text-xs"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </pre>
        </div>
      )}
    </div>
  );
};

export default GeminiTool;