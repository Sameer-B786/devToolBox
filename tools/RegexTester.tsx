import React, { useState, useMemo } from 'react';
import { escapeHtml } from '../utils/textUtils';

const RegexTester: React.FC = () => {
    const [regex, setRegex] = useState('');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('The quick brown fox jumps over the lazy dog.');
    const [error, setError] = useState('');

    const highlightedText = useMemo(() => {
        if (!regex) return escapeHtml(testString);
        try {
            // matchAll requires the global flag to be set
            const safeFlags = flags.includes('g') ? flags : flags + 'g';
            const re = new RegExp(regex, safeFlags);
            setError('');

            const matches = [...testString.matchAll(re)];
            if (matches.length === 0) return escapeHtml(testString);

            let lastIndex = 0;
            const parts: string[] = [];

            matches.forEach(match => {
                const matchIndex = match.index ?? 0;
                // Add the text before the match, ensuring it's escaped
                if (matchIndex > lastIndex) {
                    parts.push(escapeHtml(testString.substring(lastIndex, matchIndex)));
                }
                // Add the highlighted match, ensuring the content is escaped
                parts.push(`<mark>${escapeHtml(match[0])}</mark>`);
                lastIndex = matchIndex + match[0].length;
            });
            
            // Add the remaining text after the last match
            if (lastIndex < testString.length) {
                parts.push(escapeHtml(testString.substring(lastIndex)));
            }
            
            return parts.join('');
        } catch (e: any) {
            setError(e.message);
            return escapeHtml(testString);
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
                    aria-label="Regular Expression Input"
                />
                <span className="p-2 bg-gray-200">/</span>
                <input
                    type="text"
                    value={flags}
                    onChange={e => setFlags(e.target.value)}
                    placeholder="flags"
                    className="w-16 p-2 border rounded-r-md font-mono"
                    aria-label="Regular Expression Flags"
                />
            </div>
             {error && <p className="text-red-500 text-sm mb-2" role="alert">{error}</p>}
            
            <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-y font-mono"
                placeholder="Test String..."
                aria-label="Test String Input"
            ></textarea>
            
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Result:</h3>
                <div 
                    className="p-4 border bg-gray-50 rounded-lg min-h-[100px] whitespace-pre-wrap font-mono"
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                    aria-live="polite"
                />
            </div>
        </div>
    );
};

export default RegexTester;