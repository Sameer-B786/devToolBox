import { useState, useCallback } from 'react';

export const useCopyToClipboard = (
  resetInterval: number = 2000
): [boolean, (text: string) => void] => {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (text: string) => {
      if (typeof text === 'string' || typeof text === 'number') {
        navigator.clipboard.writeText(text.toString()).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), resetInterval);
        });
      } else {
        console.error(
          `Cannot copy typeof ${typeof text} to clipboard, must be a string or number.`
        );
      }
    },
    [resetInterval]
  );

  return [isCopied, handleCopy];
};