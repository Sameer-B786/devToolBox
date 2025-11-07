import React, { useState, useMemo } from 'react';
import ActionButton from '../components/common/ActionButton';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface Rule {
  userAgent: string;
  type: 'Allow' | 'Disallow';
  path: string;
}

const RobotsTxtGenerator: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([{ userAgent: '*', type: 'Disallow', path: '/private' }]);
  const [sitemap, setSitemap] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const addRule = () => {
    setRules([...rules, { userAgent: '*', type: 'Disallow', path: '' }]);
  };

  const updateRule = (index: number, field: keyof Rule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };
  
  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  }

  const generatedText = useMemo(() => {
    let text = rules.map(r => `User-agent: ${r.userAgent}\n${r.type}: ${r.path}`).join('\n\n');
    if (sitemap) {
        text += `\n\nSitemap: ${sitemap}`;
    }
    return text;
  }, [rules, sitemap]);

  return (
    <div>
        {rules.map((rule, index) => (
            <div key={index} className="flex gap-2 items-center mb-2 p-2 border rounded-md">
                <input value={rule.userAgent} onChange={e => updateRule(index, 'userAgent', e.target.value)} placeholder="User-agent" className="p-1 border rounded w-24" />
                <select value={rule.type} onChange={e => updateRule(index, 'type', e.target.value)} className="p-1 border rounded">
                    <option>Allow</option>
                    <option>Disallow</option>
                </select>
                <input value={rule.path} onChange={e => updateRule(index, 'path', e.target.value)} placeholder="Path" className="p-1 border rounded flex-grow" />
                <button onClick={() => removeRule(index)} className="text-red-500 hover:text-red-700">X</button>
            </div>
        ))}
        <ActionButton onClick={addRule} variant="secondary">Add Rule</ActionButton>
        <div className="mt-4">
            <label className="block text-sm font-medium">Sitemap URL (optional)</label>
            <input value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" className="p-2 border rounded w-full mt-1" />
        </div>
        <div className="mt-6">
            <h3 className="font-semibold mb-2">Generated robots.txt</h3>
            <div className="relative">
                <textarea readOnly value={generatedText} className="w-full h-48 p-2 border bg-gray-50 rounded font-mono text-sm"></textarea>
                <button onClick={() => copy(generatedText)} className="absolute top-2 right-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 rounded-md text-xs">{isCopied ? 'Copied' : 'Copy'}</button>
            </div>
        </div>
    </div>
  );
};

export default RobotsTxtGenerator;
