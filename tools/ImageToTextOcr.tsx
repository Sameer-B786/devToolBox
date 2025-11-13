import React, { useState } from 'react';
import { GoogleGenAI } from 'https://aistudiocdn.com/google-genai@^0.14.2';
import ActionButton from '../components/common/ActionButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { fileToBase64, getImageMimeType } from '../utils/fileUtils';

const ImageToTextOcr: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setText('');
      setError('');
    }
  };

  const extractText = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const base64Data = await fileToBase64(file);
      const mimeType = getImageMimeType(file);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { text: 'Extract all text from this image. Only output the extracted text.' },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      });
      setText(response.text);
    } catch (e: any) {
      setError(e.message || 'Failed to extract text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        </div>
        {imageUrl && (
            <>
                <ActionButton onClick={extractText} disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Extract Text'}
                </ActionButton>
                {error && <p className="mt-2 text-red-500">{error}</p>}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-center mb-2">Your Image</h3>
                        <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
                    </div>
                    <div className="relative">
                        <h3 className="font-semibold text-center mb-2">Extracted Text</h3>
                        <textarea
                            readOnly
                            value={text}
                            className="w-full h-full p-4 border bg-gray-50 border-gray-200 rounded-lg resize-y min-h-[200px]"
                            placeholder="Extracted text will appear here..."
                        ></textarea>
                        {text && <button onClick={() => copy(text)} className="absolute top-10 right-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 rounded-md text-xs">
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>}
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default ImageToTextOcr;