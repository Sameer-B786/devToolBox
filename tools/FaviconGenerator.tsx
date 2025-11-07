import React, { useState, useCallback } from 'react';
import ActionButton from '../components/common/ActionButton';

const SIZES = [16, 32, 48, 64, 128, 192];

const FaviconGenerator: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [favicons, setFavicons] = useState< {size: number, url: string}[] >([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            generateFavicons(selectedFile);
        }
    };
    
    const generateFavicons = (sourceFile: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(sourceFile);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const generated: {size: number, url: string}[] = [];
                SIZES.forEach(size => {
                    const canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, size, size);
                    generated.push({ size, url: canvas.toDataURL('image/png') });
                });
                setFavicons(generated);
            };
        };
    }

    return (
        <div>
            <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                <p className="text-sm text-gray-500">Upload a square image for best results.</p>
            </div>

            {favicons.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Generated Favicons:</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {favicons.map(({ size, url }) => (
                            <div key={size} className="text-center">
                                <img src={url} alt={`Favicon ${size}x${size}`} className="border mx-auto" />
                                <p className="text-sm mt-1">{size}x{size}</p>
                                <a href={url} download={`favicon-${size}x${size}.png`} className="text-xs text-primary hover:underline">
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaviconGenerator;
