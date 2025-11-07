import React, { useState, useRef, useEffect } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const ImageColorPicker: React.FC = () => {
    const [fileUrl, setFileUrl] = useState('');
    const [hoveredColor, setHoveredColor] = useState({ hex: '', rgb: '' });
    const [pickedColor, setPickedColor] = useState({ hex: '#ffffff', rgb: 'rgb(255, 255, 255)' });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isHexCopied, copyHex] = useCopyToClipboard();
    const [isRgbCopied, copyRgb] = useCopyToClipboard();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    };

    useEffect(() => {
        if (!fileUrl || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const img = new Image();
        img.src = fileUrl;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    }, [fileUrl]);
    
    const pickColor = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        const hex = "#" + ("000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6);
        
        return { hex, rgb };
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const color = pickColor(e);
        if (color) setHoveredColor(color);
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const color = pickColor(e);
        if (color) setPickedColor(color);
    }

    return (
        <div>
            <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {fileUrl && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                         <canvas ref={canvasRef} onMouseMove={handleMouseMove} onClick={handleClick} className="max-w-full h-auto cursor-crosshair border"></canvas>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Picked Color</h3>
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <div style={{ backgroundColor: pickedColor.hex }} className="w-16 h-16 rounded-md border"></div>
                            <div>
                                <div className="font-mono text-sm mb-1">
                                    {pickedColor.hex} 
                                    <button onClick={() => copyHex(pickedColor.hex)} className="ml-2 text-xs bg-gray-200 px-1 rounded">{isHexCopied ? 'Copied' : 'Copy'}</button>
                                </div>
                                <div className="font-mono text-sm">
                                    {pickedColor.rgb}
                                    <button onClick={() => copyRgb(pickedColor.rgb)} className="ml-2 text-xs bg-gray-200 px-1 rounded">{isRgbCopied ? 'Copied' : 'Copy'}</button>
                                </div>
                            </div>
                        </div>
                         <h3 className="font-semibold mb-2 mt-4">Hovered Color</h3>
                        <div className="flex items-center gap-4 p-2">
                            <div style={{ backgroundColor: hoveredColor.hex }} className="w-8 h-8 rounded-full border"></div>
                            <div className="font-mono text-xs">{hoveredColor.hex}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageColorPicker;
