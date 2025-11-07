import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ActionButton from '../components/common/ActionButton';
import { fileToBase64, getImageMimeType } from '../utils/fileUtils';

const ImageToBase64: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [isCopied, copy] = useCopyToClipboard();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const base64String = await fileToBase64(selectedFile);
      const mimeType = getImageMimeType(selectedFile);
      setBase64(`data:${mimeType};base64,${base64String}`);
    }
  };

  return (
    <div>
        <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        </div>
        
        {base64 && (
            <div>
                <h3 className="text-lg font-medium mb-2">Base64 String:</h3>
                <div className="relative">
                    <textarea
                        readOnly
                        value={base64}
                        className="w-full h-40 p-4 border bg-gray-50 border-gray-200 rounded-lg resize-y font-mono text-sm"
                    ></textarea>
                    <ActionButton onClick={() => copy(base64)} className="absolute top-2 right-2 !py-1 !px-2 text-xs">
                        {isCopied ? 'Copied!' : 'Copy'}
                    </ActionButton>
                </div>

                <h3 className="text-lg font-medium mt-4 mb-2">Image Preview:</h3>
                <img src={base64} alt="Preview" className="max-w-full h-auto rounded-lg border" />
            </div>
        )}
    </div>
  );
};

export default ImageToBase64;
