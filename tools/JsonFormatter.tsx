import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const JsonFormatter: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [isCopied, copy] = useCopyToClipboard();
    
    const handleFormat = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const formatted = JSON.stringify(parsed, null, 2);
            setJsonInput(formatted);
            setError('');
        } catch (e: any) {
            setError(`Invalid JSON: ${e.message}`);
        }
    };

    return (
        <div>
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-y font-mono"
                placeholder="Paste your JSON here..."
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton onClick={handleFormat}>Format / Validate</ActionButton>
                <ActionButton onClick={() => copy(jsonInput)} variant="secondary">{isCopied ? 'Copied!' : 'Copy'}</ActionButton>
                <ActionButton onClick={() => { setJsonInput(''); setError(''); }} variant="secondary">Clear</ActionButton>
            </div>
        </div>
    );
};

export default JsonFormatter;
