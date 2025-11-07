import React, { useState, useCallback } from 'react';
import ActionButton from '../components/common/ActionButton';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const ImageFormatConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState('');
    const [convertedUrl, setConvertedUrl] = useState('');
    const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/png');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setOriginalUrl(URL.createObjectURL(selectedFile));
            setConvertedUrl('');
        }
    };

    const convertImage = useCallback(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
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
                        setConvertedUrl(URL.createObjectURL(blob));
                    }
                }, targetFormat, 0.95);
            };
        };
    }, [file, targetFormat]);

    const getFileExtension = (mimeType: ImageFormat) => {
        return mimeType.split('/')[1];
    }

    return (
        <div>
            <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
            </div>

            {originalUrl && (
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <label>Convert to:</label>
                        <select value={targetFormat} onChange={e => setTargetFormat(e.target.value as ImageFormat)} className="p-2 border rounded-md">
                            <option value="image/png">PNG</option>
                            <option value="image/jpeg">JPEG</option>
                            <option value="image/webp">WEBP</option>
                        </select>
                        <ActionButton onClick={convertImage}>Convert</ActionButton>
                    </div>

                    {convertedUrl && (
                        <div className="mt-6 text-center">
                            <h3 className="font-semibold">Converted Image</h3>
                            <img src={convertedUrl} alt="Converted" className="max-w-full h-auto rounded-lg mx-auto my-2 border" style={{ maxWidth: 400 }}/>
                            <a href={convertedUrl} download={`converted.${getFileExtension(targetFormat)}`} className="inline-block mt-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                Download
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageFormatConverter;
