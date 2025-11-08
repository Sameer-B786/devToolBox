import React, { useState, useEffect } from 'react';

// SVG Icon components to replace lucide-react
const Search = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
);
const FileText = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
);
const TrendingUp = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
);
const AlertCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);
const BarChart3 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
);
const Hash = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
    </svg>
);


const KeywordDensityChecker = () => {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [showStopWords, setShowStopWords] = useState(false);

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will',
    'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where',
    'who', 'which', 'why', 'how', 'can', 'could', 'would', 'should', 'may', 'might',
    'must', 'shall', 'am', 'been', 'being', 'do', 'does', 'did', 'doing', 'or',
    'if', 'then', 'else', 'so', 'than', 'such', 'no', 'not', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'also', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
    'further', 'once', 'here', 'there', 'all', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'any', 'every', 'i', 'you', 'your', 'we', 'our', 'their'
  ]);

  const analyzeText = () => {
    if (!text.trim()) {
      setResults(null);
      return;
    }

    // Clean and tokenize text
    const cleanedText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanedText.split(' ').filter(word => word.length > 0);
    const totalWords = words.length;

    if (totalWords === 0) {
        setResults(null);
        return;
    }

    // Count word frequencies
    const wordFreq: { [key: string]: number } = {};
    const wordFreqNoStop: { [key: string]: number } = {};

    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
      if (!stopWords.has(word)) {
        wordFreqNoStop[word] = (wordFreqNoStop[word] || 0) + 1;
      }
    });

    // Calculate densities and sort
    const calculateDensity = (freq: { [key: string]: number }, total: number) => {
      return Object.entries(freq).map(([word, count]) => ({
        word,
        count,
        density: ((count / total) * 100).toFixed(2)
      })).sort((a, b) => b.count - a.count);
    };

    const allKeywords = calculateDensity(wordFreq, totalWords);
    const filteredKeywords = calculateDensity(wordFreqNoStop, totalWords);

    // Two-word phrases
    const twoWordPhrases: { [key: string]: number } = {};
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      twoWordPhrases[phrase] = (twoWordPhrases[phrase] || 0) + 1;
    }

    const twoWordResults = Object.entries(twoWordPhrases)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: ((count / (totalWords > 1 ? totalWords - 1 : 1)) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Three-word phrases
    const threeWordPhrases: { [key: string]: number } = {};
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      threeWordPhrases[phrase] = (threeWordPhrases[phrase] || 0) + 1;
    }

    const threeWordResults = Object.entries(threeWordPhrases)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: ((count / (totalWords > 2 ? totalWords - 2 : 1)) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Target keyword analysis
    let targetKeywordData = null;
    if (targetKeyword.trim()) {
      const targetLower = targetKeyword.toLowerCase().trim();
      const targetCount = (cleanedText.match(new RegExp(`\\b${targetLower}\\b`, 'g')) || []).length;
      const targetDensity = ((targetCount / totalWords) * 100).toFixed(2);
      
      targetKeywordData = {
        keyword: targetKeyword,
        count: targetCount,
        density: targetDensity,
        status: parseFloat(targetDensity) < 0.5 ? 'low' : parseFloat(targetDensity) > 3 ? 'high' : 'optimal'
      };
    }

    // Character and sentence count
    const characters = text.length;
    const sentences = (text.match(/[\w|\)][.?!](\s|$)/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    setResults({
      totalWords,
      characters,
      sentences,
      paragraphs,
      allKeywords: allKeywords.slice(0, 20),
      filteredKeywords: filteredKeywords.slice(0, 20),
      twoWordPhrases: twoWordResults,
      threeWordPhrases: threeWordResults,
      targetKeywordData,
      avgWordsPerSentence: sentences > 0 ? (totalWords / sentences).toFixed(1) : 0,
      uniqueWords: Object.keys(wordFreq).length
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(analyzeText, 500);
    return () => clearTimeout(timeoutId);
  }, [text, targetKeyword]);

  const getDensityColor = (density: string) => {
    const d = parseFloat(density);
    if (d < 0.5) return 'text-blue-600';
    if (d < 1) return 'text-green-600';
    if (d < 2) return 'text-yellow-600';
    if (d < 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: 'low' | 'optimal' | 'high') => {
    const badges = {
      low: { color: 'bg-blue-100 text-blue-800', text: 'Too Low' },
      optimal: { color: 'bg-green-100 text-green-800', text: 'Optimal' },
      high: { color: 'bg-red-100 text-red-800', text: 'Too High' }
    };
    const badge = badges[status] || badges.optimal;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 -m-8 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-10 h-10 text-green-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">SEO Keyword Density Checker</h1>
          </div>
          <p className="text-center text-gray-600">
            Analyze your content for keyword optimization and SEO performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Your Content</h2>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your content here to analyze keyword density, word count, and SEO metrics..."
                className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-y"
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Keyword (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Enter your target keyword"
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="stopWords"
                  checked={showStopWords}
                  onChange={(e) => setShowStopWords(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <label htmlFor="stopWords" className="ml-2 text-sm text-gray-700">
                  Include stop words in results
                </label>
              </div>
            </div>

            {results && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
                  Phrase Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Top 2-Word Phrases</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.twoWordPhrases.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700 flex-1 truncate">{item.phrase}</span>
                          <div className="flex items-center ml-2">
                            <span className="text-xs font-semibold text-gray-600 mr-2">
                              {item.count}x
                            </span>
                            <span className={`text-xs font-bold ${getDensityColor(item.density)}`}>
                              {item.density}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Top 3-Word Phrases</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.threeWordPhrases.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700 flex-1 truncate">{item.phrase}</span>
                          <div className="flex items-center ml-2">
                            <span className="text-xs font-semibold text-gray-600 mr-2">
                              {item.count}x
                            </span>
                            <span className={`text-xs font-bold ${getDensityColor(item.density)}`}>
                              {item.density}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Hash className="w-6 h-6 text-blue-600 mr-2" />
                    Content Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Words</span>
                      <span className="font-bold text-blue-600">{results.totalWords}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Unique Words</span>
                      <span className="font-bold text-green-600">{results.uniqueWords}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Characters</span>
                      <span className="font-bold text-purple-600">{results.characters}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Sentences</span>
                      <span className="font-bold text-yellow-600">{results.sentences}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-pink-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Paragraphs</span>
                      <span className="font-bold text-pink-600">{results.paragraphs}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Avg Words/Sentence</span>
                      <span className="font-bold text-indigo-600">{results.avgWordsPerSentence}</span>
                    </div>
                  </div>
                </div>

                {results.targetKeywordData && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Target Keyword</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-800">
                          "{results.targetKeywordData.keyword}"
                        </span>
                        {getStatusBadge(results.targetKeywordData.status)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Count: <span className="font-bold">{results.targetKeywordData.count}</span></span>
                        <span className="text-gray-600">Density: <span className={`font-bold ${getDensityColor(results.targetKeywordData.density)}`}>{results.targetKeywordData.density}%</span></span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Optimal: 0.5% - 2.5%</p>
                      <p>• Below 0.5%: May need more mentions</p>
                      <p>• Above 3%: Risk of keyword stuffing</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Top Keywords {showStopWords ? '(All)' : '(Stop Words Removed)'}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(showStopWords ? results.allKeywords : results.filteredKeywords).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition">
                        <div className="flex items-center flex-1">
                          <span className="text-xs font-bold text-gray-400 mr-3 w-6">{index + 1}</span>
                          <span className="text-sm text-gray-700 truncate">{item.word}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-semibold text-gray-600 mr-3">
                            {item.count}x
                          </span>
                          <span className={`text-sm font-bold ${getDensityColor(item.density)} w-16 text-right`}>
                            {item.density}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Enter your content to see detailed keyword density analysis and SEO metrics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordDensityChecker;
