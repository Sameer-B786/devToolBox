import React, { useState, useMemo } from 'react';

const RegexTester: React.FC = () => {
    const [regex, setRegex] = useState('');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('The quick brown fox jumps over the lazy dog.');
    const [error, setError] = useState('');

    const highlightedText = useMemo(() => {
        if (!regex) return testString;
        try {
            const re = new RegExp(regex, flags);
            setError('');
            return testString.replace(re, (match) => `<mark>${match}</mark>`);
        } catch (e: any) {
            setError(e.message);
            return testString;
        }
    }, [regex, flags, testString]);

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <span className="p-2 bg-gray-200 rounded-l-md">/</span>
                <input
                    type="text"
                    value={regex}
                    onChange={e => setRegex(e.target.value)}
                    placeholder="Regular Expression"
                    className="flex-grow p-2 border-t border-b border-gray-300 font-mono"
                />
                <span className="p-2 bg-gray-200">/</span>
                <input
                    type="text"
                    value={flags}
                    onChange={e => setFlags(e.target.value)}
                    placeholder="flags"
                    className="w-16 p-2 border rounded-r-md font-mono"
                />
            </div>
             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-y font-mono"
                placeholder="Test String..."
            ></textarea>
            
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Result:</h3>
                <div 
                    className="p-4 border bg-gray-50 rounded-lg min-h-[100px] whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
            </div>
        </div>
    );
};

export default RegexTester;
