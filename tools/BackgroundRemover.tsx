import React, { useState } from 'react';
import { GoogleGenAI, Modality } from 'https://aistudiocdn.com/google-genai@^0.14.2';
import ActionButton from '../components/common/ActionButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fileToBase64, getImageMimeType } from '../utils/fileUtils';

const BackgroundRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setResultUrl('');
      setError('');
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResultUrl('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const base64Data = await fileToBase64(file);
      const mimeType = getImageMimeType(file);

      const imagePart = {
        inlineData: { data: base64Data, mimeType },
      };
      const textPart = { text: "Remove the background from this image, making it transparent. The main subject should be perfectly preserved. Output only the resulting image." };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          setResultUrl(`data:image/png;base64,${base64ImageBytes}`);
          break;
        }
      }

    } catch (e: any) {
      setError(e.message || 'Failed to remove background.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
      </div>
      {originalUrl && (
        <>
          <ActionButton onClick={removeBackground} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Remove Background'}
          </ActionButton>
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-center">Original</h3>
              <img src={originalUrl} alt="Original" className="max-w-full h-auto rounded-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-center">Result</h3>
              {resultUrl ? (
                <div>
                  <img src={resultUrl} alt="Background Removed" className="max-w-full h-auto rounded-lg bg-gray-200" style={{ backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)', backgroundSize: '20px 20px'}}/>
                   <a href={resultUrl} download={`bg-removed-${file?.name}.png`} className="block mt-2 text-center bg-primary text-white py-2 rounded-lg hover:bg-blue-700">
                    Download
                  </a>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p>Result will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BackgroundRemover;