import React, { useState, useEffect } from 'react';

// Basic conversion functions
const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ... HSL conversions are more complex, so we'll omit for simplicity or use a library.
// For this example, we'll focus on HEX <=> RGB.

const ColorCodeConverter: React.FC = () => {
    const [hex, setHex] = useState('#2563eb');
    const [rgb, setRgb] = useState('rgb(37, 99, 235)');

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setHex(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex) || /^#[0-9A-F]{3}$/i.test(newHex)) {
            setRgb(hexToRgb(newHex));
        }
    };
    
    const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRgb = e.target.value;
        setRgb(newRgb);
        const match = newRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const [_, r, g, b] = match.map(Number);
            setHex(rgbToHex(r,g,b));
        }
    }
    
    const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleHexChange(e);
    }

    return (
        <div className="flex flex-wrap gap-8 items-center">
            <input type="color" value={hex} onChange={handleColorPicker} className="w-24 h-24 rounded-lg border-none cursor-pointer" />
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">HEX</label>
                    <input type="text" value={hex} onChange={handleHexChange} className="w-full p-2 border rounded-md font-mono" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">RGB</label>
                    <input type="text" value={rgb} onChange={handleRgbChange} className="w-full p-2 border rounded-md font-mono" />
                </div>
            </div>
        </div>
    );
};

export default ColorCodeConverter;
