import React, { useState, useEffect, useRef } from 'react';
import ActionButton from '../components/common/ActionButton';

// Dynamically import from an ESM-friendly CDN
let QRCode: any;
import('https://esm.sh/qrcode').then(module => {
  QRCode = module.default;
});

const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://aistudio.google.com');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (QRCode && canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, { width: 256 }, (error: any) => {
        if (error) console.error(error);
      });
    }
  }, [text]);
  
  const downloadQR = () => {
    if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    }
  }

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Enter URL or text to encode"
      />
      <div className="flex flex-col items-center">
        <canvas ref={canvasRef} className="border"></canvas>
        {text && <ActionButton onClick={downloadQR} className="mt-4">Download QR Code</ActionButton>}
      </div>
    </div>
  );
};

export default QrCodeGenerator;
