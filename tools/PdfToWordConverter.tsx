
import React, { useState } from 'react';
import { GoogleGenAI } from 'https://aistudiocdn.com/google-genai@^0.14.2';
import { fileToBase64 } from '../utils/fileUtils';

// --- Icon Components (to avoid external dependencies) ---
const Icon = ({ children, size = 24, className = '' }: { children: React.ReactNode, size?: number, className?: string }) => (
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
const FileText = (props: any) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></Icon>;
const Download = (props: any) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></Icon>;
const Upload = (props: any) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></Icon>;
const AlertCircle = (props: any) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></Icon>;


export default function PDFToWordConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const convertToWord = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setConverting(true);
    setError('');
    setSuccess(false);

    try {
      const base64Data = await fileToBase64(file);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const pdfPart = {
          inlineData: {
              mimeType: 'application/pdf',
              data: base64Data,
          },
      };

      const textPart = {
          text: "Extract all the text content from this PDF document. Preserve the formatting as much as possible, including paragraphs, headings, and line breaks. Return only the extracted text without any additional commentary."
      };
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [pdfPart, textPart] },
      });

      const extractedText = response.text;
      
      if (!extractedText || !extractedText.trim()) {
        throw new Error('No text could be extracted from the PDF, or the PDF is empty.');
      }
      
      // Create a simple Word-compatible document (RTF format)
      // Escaping curly braces and backslashes for RTF
      const sanitizedText = extractedText
        .replace(/\\/g, '\\\\')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}');

      const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
\\f0\\fs24
${sanitizedText.replace(/\n/g, '\\par\n')}
}`;
      
      // Create blob and download
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '.rtf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err.message || 'An error occurred during conversion. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl -m-6 sm:-m-8 p-8 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          PDF to Word Converter
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Convert your PDF files to an editable Word format (.rtf) using Gemini
        </p>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-700 mb-1">
                Click to upload PDF
              </span>
              <span className="text-xs text-gray-500">
                or drag and drop
              </span>
            </label>
          </div>

          {file && (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-700 font-medium truncate">
                  {file.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <Download className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">
                File converted and downloaded successfully!
              </span>
            </div>
          )}

          <button
            onClick={convertToWord}
            disabled={!file || converting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {converting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Convert & Download</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your files are processed securely and are not stored on our servers.
          </p>
        </div>
    </div>
  );
}