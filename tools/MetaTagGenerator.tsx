import React, { useState } from 'react';

// --- Icon Components (to replace lucide-react dependency) ---
const Icon = ({ children, size = 20, className = '' }: { children: React.ReactNode, size?: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {children}
    </svg>
);
  
const TagsIcon = (props: any) => <Icon {...props}><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L12 24l-8-8 .9-.9"/><path d="m8 16 4-4"/><path d="m21.9 11.9-8.4-8.4A2.4 2.4 0 0 0 11.8 3H5a2 2 0 0 0-2 2v6.8a2.4 2.4 0 0 0 .7 1.7Z"/></Icon>;
const GlobeIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></Icon>;
const CopyIcon = (props: any) => <Icon {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></Icon>;
const CheckIcon = (props: any) => <Icon {...props}><path d="M20 6 9 17l-5-5"/></Icon>;
const LoaderIcon = (props: any) => <Icon {...props} className={`animate-spin ${props.className || ''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>;
const CheckCircleIcon = (props: any) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></Icon>;
const XCircleIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></Icon>;
const AlertCircleIcon = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></Icon>;


export default function MetaTagAndStatusChecker() {
  const getSlugFromHash = () => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    return parts[parts.length - 1];
  };
  
  const initialTab = getSlugFromHash() === 'website-status-checker' ? 'status' : 'meta';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Meta Tag Generator State
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    siteName: '',
    twitterHandle: '',
    themeColor: '#ffffff',
    robots: 'index, follow'
  });
  const [copied, setCopied] = useState(false);

  // Website Status Checker State
  const [statusUrl, setStatusUrl] = useState('');
  const [statusResult, setStatusResult] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const handleMetaChange = (field: string, value: string) => {
    setMetaData({ ...metaData, [field]: value });
  };

  const generateMetaTags = () => {
    const tags = [];
    
    // Basic Meta Tags
    if (metaData.title) {
      tags.push(`<title>${metaData.title}</title>`);
      tags.push(`<meta name="title" content="${metaData.title}">`);
    }
    if (metaData.description) {
      tags.push(`<meta name="description" content="${metaData.description}">`);
    }
    if (metaData.keywords) {
      tags.push(`<meta name="keywords" content="${metaData.keywords}">`);
    }
    if (metaData.author) {
      tags.push(`<meta name="author" content="${metaData.author}">`);
    }
    tags.push(`<meta name="robots" content="${metaData.robots}">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<meta charset="UTF-8">`);
    if (metaData.themeColor) {
      tags.push(`<meta name="theme-color" content="${metaData.themeColor}">`);
    }

    // Open Graph Tags
    if (metaData.title) tags.push(`<meta property="og:title" content="${metaData.title}">`);
    if (metaData.description) tags.push(`<meta property="og:description" content="${metaData.description}">`);
    if (metaData.image) tags.push(`<meta property="og:image" content="${metaData.image}">`);
    if (metaData.url) tags.push(`<meta property="og:url" content="${metaData.url}">`);
    if (metaData.siteName) tags.push(`<meta property="og:site_name" content="${metaData.siteName}">`);
    tags.push(`<meta property="og:type" content="website">`);

    // Twitter Card Tags
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (metaData.title) tags.push(`<meta name="twitter:title" content="${metaData.title}">`);
    if (metaData.description) tags.push(`<meta name="twitter:description" content="${metaData.description}">`);
    if (metaData.image) tags.push(`<meta name="twitter:image" content="${metaData.image}">`);
    if (metaData.twitterHandle) tags.push(`<meta name="twitter:site" content="@${metaData.twitterHandle}">`);

    return tags.join('\n');
  };

  const copyToClipboard = () => {
    const tags = generateMetaTags();
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkWebsiteStatus = async () => {
    if (!statusUrl) return;

    setChecking(true);
    setStatusResult(null);

    try {
      let url = statusUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const startTime = Date.now();
      // Using 'no-cors' mode for basic reachability check due to browser security.
      // We can't read the status code, but a resolved promise indicates the site is likely up.
      await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      const responseTime = Date.now() - startTime;

      setStatusResult({
        url: url,
        status: 'online',
        responseTime: responseTime,
        accessible: true,
        timestamp: new Date().toLocaleString()
      });
    } catch (error: any) {
      setStatusResult({
        url: statusUrl,
        status: 'offline',
        accessible: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden -m-6 sm:-m-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('meta')}
          className={`flex-1 py-4 px-6 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'meta'
              ? 'bg-primary text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TagsIcon size={20} />
          Meta Tag Generator
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-4 px-6 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'status'
              ? 'bg-primary text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <GlobeIcon size={20} />
          Website Status Checker
        </button>
      </div>

      {/* Meta Tag Generator */}
      {activeTab === 'meta' && (
        <div className="p-8">
          <p className="text-gray-600 mb-6">Generate SEO-friendly meta tags for your website.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title *</label>
              <input type="text" value={metaData.title} onChange={(e) => handleMetaChange('title', e.target.value)} placeholder="Your awesome website title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea value={metaData.description} onChange={(e) => handleMetaChange('description', e.target.value)} placeholder="Brief description of your website (150-160 characters recommended)" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"/>
              <div className="text-xs text-gray-500 mt-1">{metaData.description.length} characters</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" value={metaData.keywords} onChange={(e) => handleMetaChange('keywords', e.target.value)} placeholder="keyword1, keyword2, keyword3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input type="text" value={metaData.author} onChange={(e) => handleMetaChange('author', e.target.value)} placeholder="Your name or company" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input type="url" value={metaData.url} onChange={(e) => handleMetaChange('url', e.target.value)} placeholder="https://yourwebsite.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
              <input type="url" value={metaData.image} onChange={(e) => handleMetaChange('image', e.target.value)} placeholder="https://yourwebsite.com/image.jpg" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"/>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generated Meta Tags</h3>
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto"><code>{generateMetaTags() || '<!-- Fill in the fields above to generate meta tags -->'}</code></pre>
          </div>
        </div>
      )}

      {/* Website Status Checker */}
      {activeTab === 'status' && (
        <div className="p-8">
          <p className="text-gray-600 mb-6">Check if a website is online and accessible.</p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 mb-8">
              <input type="text" value={statusUrl} onChange={(e) => setStatusUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && checkWebsiteStatus()} placeholder="Enter website URL (e.g., google.com)" className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"/>
              <button onClick={checkWebsiteStatus} disabled={checking || !statusUrl} className="px-8 py-4 bg-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2">
                {checking ? (<><LoaderIcon size={20} /> Checking...</>) : (<><GlobeIcon size={20} /> Check</>)}
              </button>
            </div>
            {statusResult && (
              <div className={`rounded-xl p-6 border-2 ${statusResult.accessible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-4">
                  {statusResult.accessible ? (<CheckCircleIcon className="text-green-600 flex-shrink-0" size={32} />) : (<XCircleIcon className="text-red-600 flex-shrink-0" size={32} />)}
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${statusResult.accessible ? 'text-green-800' : 'text-red-800'}`}>{statusResult.accessible ? 'Website is Online' : 'Website is Offline or Unreachable'}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">URL:</span><span className="text-gray-600 break-all">{statusResult.url}</span></div>
                      <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Status:</span><span className={`font-semibold ${statusResult.accessible ? 'text-green-600' : 'text-red-600'}`}>{statusResult.status.toUpperCase()}</span></div>
                      {statusResult.responseTime && (<div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Response Time:</span><span className="text-gray-600">{statusResult.responseTime}ms</span></div>)}
                      {statusResult.error && (<div className="flex items-start gap-2"><span className="font-semibold text-gray-700">Error:</span><span className="text-red-600">{statusResult.error}</span></div>)}
                      <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Checked at:</span><span className="text-gray-600">{statusResult.timestamp}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircleIcon className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800"><strong>Note:</strong> Due to browser security restrictions (CORS), this checker performs a basic reachability test. A successful check means the website is accessible, but specific HTTP status codes cannot be retrieved.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
