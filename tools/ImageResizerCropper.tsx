import React, { useState, useCallback } from 'react';
import ActionButton from '../components/common/ActionButton';

const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [resizedUrl, setResizedUrl] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setOriginalUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalDims({ w: img.width, h: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      }
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (keepAspectRatio && originalDims.w > 0) {
      const newHeight = Math.round((parseInt(newWidth, 10) / originalDims.w) * originalDims.h);
      setHeight(newHeight.toString());
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    if (keepAspectRatio && originalDims.h > 0) {
      const newWidth = Math.round((parseInt(newHeight, 10) / originalDims.h) * originalDims.w);
      setWidth(newWidth.toString());
    }
  };
  
  const resizeImage = useCallback(() => {
    if (!file || !width || !height) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setResizedUrl(URL.createObjectURL(blob));
          }
        }, file.type);
      };
    };
  }, [file, width, height]);
  
  return (
    <div>
        <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        </div>

        {originalUrl && (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
                    <input type="number" value={width} onChange={handleWidthChange} placeholder="Width" className="p-2 border rounded-md" />
                    <input type="number" value={height} onChange={handleHeightChange} placeholder="Height" className="p-2 border rounded-md" />
                    <div className="md:col-span-2">
                        <label>
                            <input type="checkbox" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} />
                            Keep aspect ratio
                        </label>
                    </div>
                </div>
                <ActionButton onClick={resizeImage}>Resize</ActionButton>

                {resizedUrl && (
                     <div className="mt-6 text-center">
                        <h3 className="font-semibold">Resized Image</h3>
                        <img src={resizedUrl} alt="Resized" className="max-w-full h-auto rounded-lg mx-auto my-2" style={{ maxWidth: 400 }}/>
                        <a href={resizedUrl} download={`resized-${file?.name}`} className="inline-block mt-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            Download
                        </a>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default ImageResizer;
