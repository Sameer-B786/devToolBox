import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

// --- Icon Components ---
const Minimize2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
);
const Maximize2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const CodeMinifierBeautifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');
  const [language, setLanguage] = useState<'javascript' | 'css' | 'html'>('javascript');
  const [isCopied, copy] = useCopyToClipboard();

  const minifyJS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};:,()])\s*/g, '$1')
      .replace(/;\s*}/g, '}')
      .trim();
  };

  const beautifyJS = (code: string) => {
    let result = '';
    let indent = 0;
    const tab = '  ';
    
    code = code.replace(/\s+/g, ' ').trim();
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const next = code[i + 1];
      
      if (char === '{') {
        result += ' {\n';
        indent++;
        result += tab.repeat(indent);
      } else if (char === '}') {
        indent--;
        result += '\n' + tab.repeat(indent) + '}';
        if (next && next !== ';' && next !== ',') {
          result += '\n' + tab.repeat(indent);
        }
      } else if (char === ';') {
        result += ';\n' + tab.repeat(indent);
      } else if (char === ',') {
        result += ',\n' + tab.repeat(indent);
      } else {
        result += char;
      }
    }
    
    return result.replace(/\n\s*\n/g, '\n').trim();
  };

  const minifyCSS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  };

  const beautifyCSS = (code: string) => {
    let result = '';
    let indent = 0;
    const tab = '  ';
    
    code = code.replace(/\s+/g, ' ').trim();
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (char === '{') {
        result = result.trim() + ' {\n';
        indent++;
        result += tab.repeat(indent);
      } else if (char === '}') {
        result = result.trim();
        indent--;
        result += '\n' + tab.repeat(indent) + '}\n' + tab.repeat(indent);
      } else if (char === ';') {
        result += ';\n' + tab.repeat(indent);
      } else {
        result += char;
      }
    }
    
    return result.replace(/\n\s*\n/g, '\n').trim();
  };

  const minifyHTML = (code: string) => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const beautifyHTML = (code: string) => {
    let result = '';
    let indent = 0;
    const tab = '  ';
    const parts = code.split(/(<[^>]+>)/g).filter(p => p);
    
    parts.forEach(part => {
      if (part.match(/<[^>]+>/)) {
        const isClosing = part.match(/^<\//);
        const isSelfClosing = part.match(/\/>$/) || ['<br>', '<hr>', '<img>', '<input>', '<link>', '<meta>'].some(tag => part.startsWith(tag));
        
        if (isClosing) {
          indent--;
          result += '\n' + tab.repeat(indent) + part;
        } else if (isSelfClosing) {
          result += '\n' + tab.repeat(indent) + part;
        } else {
          result += '\n' + tab.repeat(indent) + part;
          indent++;
        }
      } else if (part.trim()) {
        result += '\n' + tab.repeat(indent) + part.trim();
      }
    });
    
    return result.trim();
  };

  const processCode = () => {
    try {
      let result = '';
      
      if (mode === 'minify') {
        switch (language) {
          case 'javascript':
            result = minifyJS(input);
            break;
          case 'css':
            result = minifyCSS(input);
            break;
          case 'html':
            result = minifyHTML(input);
            break;
        }
      } else {
        switch (language) {
          case 'javascript':
            result = beautifyJS(input);
            break;
          case 'css':
            result = beautifyCSS(input);
            break;
          case 'html':
            result = beautifyHTML(input);
            break;
        }
      }
      
      setOutput(result);
    } catch (error: any) {
      setOutput('Error: ' + error.message);
    }
  };

  const copyToClipboard = () => {
    copy(output);
  };

  return (
    <div>
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                    onClick={() => setMode('minify')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    mode === 'minify' ? 'bg-primary text-white shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Minimize2Icon className="w-4 h-4" /> Minify
                </button>
                <button
                    onClick={() => setMode('beautify')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    mode === 'beautify' ? 'bg-primary text-white shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Maximize2Icon className="w-4 h-4" /> Beautify
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                    onClick={() => setLanguage('javascript')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === 'javascript' ? 'bg-yellow-400 text-black shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    JS
                </button>
                <button
                    onClick={() => setLanguage('css')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === 'css' ? 'bg-blue-500 text-white shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    CSS
                </button>
                <button
                    onClick={() => setLanguage('html')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    language === 'html' ? 'bg-orange-500 text-white shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    HTML
                </button>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Input Code</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Paste your ${language} code here...`}
                    className="w-full h-96 bg-gray-50 text-gray-800 p-4 rounded-lg font-mono text-sm border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                    aria-label="Input Code"
                />
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium">Output Code</label>
                    {output && (
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs flex items-center gap-2 transition-all"
                    >
                        {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    )}
                </div>
                <textarea
                    value={output}
                    readOnly
                    placeholder="Formatted code will appear here..."
                    className="w-full h-96 bg-gray-50 text-gray-800 p-4 rounded-lg font-mono text-sm border border-gray-300 resize-y"
                    aria-label="Output Code"
                />
            </div>
        </div>

        <button
            onClick={processCode}
            disabled={!input}
            className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
        >
            {mode === 'minify' ? 'Minify Code' : 'Beautify Code'}
        </button>

        {output && input && (
            <div className="bg-gray-50 rounded-lg p-4 border mt-4">
                <div className="flex justify-between text-gray-700 text-sm">
                    <span>Original: {input.length} characters</span>
                    <span>Formatted: {output.length} characters</span>
                    <span className={output.length < input.length ? 'text-green-600' : 'text-orange-600'}>
                        {output.length < input.length ? '↓' : '↑'} {input.length > 0 ? Math.abs(((output.length - input.length) / input.length * 100)).toFixed(1) : 0}%
                    </span>
                </div>
            </div>
        )}
    </div>
  );
};

export default CodeMinifierBeautifier;
