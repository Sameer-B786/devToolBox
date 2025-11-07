import React, { useState, useRef, useEffect } from 'react';
import ActionButton from '../components/common/ActionButton';

const MemeGenerator: React.FC = () => {
    const [fileUrl, setFileUrl] = useState('');
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileUrl(URL.createObjectURL(file));
        }
    };
    
    useEffect(() => {
        if (!fileUrl || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = Math.floor(canvas.width / 100);
            ctx.textAlign = 'center';

            // Top text
            let fontSize = canvas.width / 10;
            ctx.font = `${fontSize}px Impact`;
            ctx.textBaseline = 'top';
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, 10);
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 10);

            // Bottom text
            ctx.textBaseline = 'bottom';
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
        }

    }, [fileUrl, topText, bottomText]);

    const downloadMeme = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = 'meme.jpg';
        link.href = canvasRef.current.toDataURL('image/jpeg');
        link.click();
    };

    return (
        <div>
            <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <input type="text" value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top Text" className="p-2 border rounded-md" />
                 <input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom Text" className="p-2 border rounded-md" />
            </div>

            {fileUrl && <ActionButton onClick={downloadMeme}>Download Meme</ActionButton>}
            
            <div className="mt-4">
                <canvas ref={canvasRef} className="max-w-full h-auto border"></canvas>
            </div>
        </div>
    );
};

export default MemeGenerator;
