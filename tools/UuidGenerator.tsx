import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [isCopied, copy] = useCopyToClipboard();
  
  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  };
  
  const uuidText = uuids.join('\n');
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="uuid-count">Number to generate:</label>
        <input
          type="number"
          id="uuid-count"
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
          className="w-24 p-2 border border-gray-300 rounded-md"
          min="1"
        />
        <ActionButton onClick={generateUuids}>Generate</ActionButton>
        <ActionButton onClick={() => copy(uuidText)} variant="secondary" disabled={uuids.length === 0}>
            {isCopied ? 'Copied!' : 'Copy'}
        </ActionButton>
      </div>

      {uuids.length > 0 && (
        <textarea
          readOnly
          value={uuidText}
          className="w-full h-64 p-4 border bg-gray-50 border-gray-200 rounded-lg resize-y font-mono"
        ></textarea>
      )}
    </div>
  );
};

export default UuidGenerator;
