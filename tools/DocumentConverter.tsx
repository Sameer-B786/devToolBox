import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// SVG Icon components to replace lucide-react
const FileText = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
const Upload = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const Download = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const Loader2 = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const AlertCircle = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);


const DocumentConverter = () => {
  const { slug } = useParams<{ slug: string }>();

  const slugToTypeMap: Record<string, string> = {
    'pdf-to-word-converter': 'pdf-to-word',
    'pdf-to-ppt-converter': 'pdf-to-ppt',
    'word-to-pdf-converter': 'word-to-pdf',
    'excel-to-pdf-converter': 'excel-to-pdf',
  };

  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [conversionType, setConversionType] = useState(slugToTypeMap[slug ?? ''] ?? 'pdf-to-word');

  const conversions = [
    { id: 'pdf-to-word', label: 'PDF to Word', from: 'PDF', to: 'DOCX' },
    { id: 'pdf-to-ppt', label: 'PDF to PowerPoint', from: 'PDF', to: 'PPTX' },
    { id: 'word-to-pdf', label: 'Word to PDF', from: 'DOCX', to: 'PDF' },
    { id: 'excel-to-pdf', label: 'Excel to PDF', from: 'XLSX', to: 'PDF' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        setError('');
    }
  };

  const convertPdfToWord = async (pdfFile: File) => {
    // Extract text from PDF using a simple approach
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text (basic extraction)
    const textContent = text.match(/\(([^)]+)\)/g)
      ?.map(match => match.slice(1, -1))
      .join(' ') || 'Could not extract text from PDF';

    // Create a simple DOCX-like structure (HTML that can be saved as .docx)
    const docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Converted Document</title>
        </head>
        <body>
          <h1>Converted from PDF</h1>
          <p>${textContent}</p>
        </body>
      </html>
    `;

    const blob = new Blob([docContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return blob;
  };

  const convertPdfToPpt = async (pdfFile: File) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    const textContent = text.match(/\(([^)]+)\)/g)
      ?.map(match => match.slice(1, -1))
      .join(' ') || 'Could not extract text from PDF';

    // Create a simple HTML that represents a presentation
    const pptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Converted Presentation</title>
        </head>
        <body>
          <div style="width: 960px; height: 540px; border: 1px solid #ccc; padding: 20px;">
            <h1>Slide 1: Converted from PDF</h1>
            <p>${textContent}</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([pptContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    return blob;
  };

  const convertWordToPdf = async (wordFile: File) => {
    // Read the Word document
    const arrayBuffer = await wordFile.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    // Create a PDF-style document (HTML that can be printed as PDF)
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Converted to PDF</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            @page { size: A4; margin: 2cm; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return blob;
  };

  const convertExcelToPdf = async (excelFile: File) => {
    const arrayBuffer = await excelFile.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    let htmlContent = '<html><head><style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid black;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style></head><body>';
    
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const htmlTable = XLSX.utils.sheet_to_html(worksheet);
      htmlContent += `<h2>Sheet ${index + 1}: ${sheetName}</h2>${htmlTable}<br/>`;
    });
    
    htmlContent += '</body></html>';

    const blob = new Blob([htmlContent], { type: 'application/pdf' });
    return blob;
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setConverting(true);
    setError('');

    try {
      let blob;
      let filename;

      switch (conversionType) {
        case 'pdf-to-word':
          blob = await convertPdfToWord(file);
          filename = file.name.replace(/\.pdf$/i, '.docx');
          break;
        case 'pdf-to-ppt':
          blob = await convertPdfToPpt(file);
          filename = file.name.replace(/\.pdf$/i, '.pptx');
          break;
        case 'word-to-pdf':
          blob = await convertWordToPdf(file);
          filename = file.name.replace(/\.docx?$/i, '.pdf');
          break;
        case 'excel-to-pdf':
          blob = await convertExcelToPdf(file);
          filename = file.name.replace(/\.xlsx?$/i, '.pdf');
          break;
        default:
          throw new Error('Invalid conversion type');
      }

      // Download the converted file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setFile(null);
    } catch (err: any) {
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 -m-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <FileText className="w-12 h-12 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Document Converter</h1>
        </div>

        {/* Conversion Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Conversion Type
          </label>
          <select
            value={conversionType}
            onChange={(e) => {
              setConversionType(e.target.value);
              setFile(null);
              setError('');
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            {conversions.map((conv) => (
              <option key={conv.id} value={conv.id}>
                {conv.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept={
                conversionType.startsWith('pdf-') ? '.pdf' :
                conversionType === 'word-to-pdf' ? '.doc,.docx' :
                '.xls,.xlsx'
              }
              key={conversionType} // Reset file input when conversion type changes
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {file ? (
              <div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!file || converting}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {converting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Convert & Download
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This converter works in your browser using JavaScript. 
            For PDF conversions, the results may vary depending on the PDF structure. 
            For best results with complex PDFs, consider using dedicated desktop software.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentConverter;