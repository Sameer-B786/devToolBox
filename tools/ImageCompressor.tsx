import React, { useState, useCallback } from 'react';
import ActionButton from '../components/common/ActionButton';

const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [compressedUrl, setCompressedUrl] = useState('');
  const [quality, setQuality] = useState(0.7);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setCompressedUrl('');
      setCompressedSize(0);
    }
  };
  
  const compressImage = useCallback(() => {
    if (!originalFile) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(originalFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
        }, originalFile.type, quality);
      };
    };
  }, [originalFile, quality]);
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB'][i]}`;
  };

  return (
    <div>
      <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        <p className="text-sm text-gray-500">Upload an image to start compression.</p>
      </div>

      {originalUrl && (
        <div>
          <div className="mb-4">
            <label>Compression Quality: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <ActionButton onClick={compressImage}>Compress</ActionButton>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-center">Original ({formatSize(originalSize)})</h3>
              <img src={originalUrl} alt="Original" className="max-w-full h-auto rounded-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-center">Compressed ({formatSize(compressedSize)})</h3>
              {compressedUrl ? (
                <div>
                  <img src={compressedUrl} alt="Compressed" className="max-w-full h-auto rounded-lg" />
                   <a href={compressedUrl} download={`compressed-${originalFile?.name}`} className="block mt-2 text-center bg-primary text-white py-2 rounded-lg hover:bg-blue-700">
                    Download
                  </a>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p>Compressed image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
