import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Dynamically import from an ESM-friendly CDN
let jsPDF: any;
import('https://esm.sh/jspdf').then(module => {
  jsPDF = module.default;
}).catch(err => {
    console.error("Failed to load jspdf library", err);
});

const ImageToPdfConverter: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
        setError('');
    };
    
    const convertToPdf = async () => {
        if (!files || files.length === 0) {
            setError('Please select at least one image file.');
            return;
        }
        if (!jsPDF) {
            setError('PDF library is not loaded yet. Please try again in a moment.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Default is portrait A4
            const doc = new (jsPDF as any)();
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) continue;

                const addImagePromise = new Promise<void>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target?.result as string;
                        img.onload = () => {
                            if (i > 0) {
                                doc.addPage();
                            }
                            const pageWidth = doc.internal.pageSize.getWidth();
                            const pageHeight = doc.internal.pageSize.getHeight();
                            const widthRatio = pageWidth / img.width;
                            const heightRatio = pageHeight / img.height;
                            const ratio = Math.min(widthRatio, heightRatio);
                            
                            const imgWidth = img.width * ratio;
                            const imgHeight = img.height * ratio;

                            const x = (pageWidth - imgWidth) / 2;
                            const y = (pageHeight - imgHeight) / 2;
                            
                            const fileExtension = file.type.split('/')[1] || 'jpeg';
                            doc.addImage(img.src, fileExtension.toUpperCase(), x, y, imgWidth, imgHeight);
                            resolve();
                        }
                        img.onerror = reject;
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                
                await addImagePromise;
            }
            
            doc.save('converted-images.pdf');
            
        } catch (e: any) {
            setError(e.message || "Failed to convert images to PDF.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <div className="mb-4 p-4 border-2 border-dashed rounded-lg text-center">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-2" />
                <p className="text-sm text-gray-500">Upload one or more images to combine into a PDF.</p>
            </div>
            
            {files && files.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold">Selected Files:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                        {Array.from(files).map(f => <li key={f.name}>{f.name} ({f.type})</li>)}
                    </ul>
                </div>
            )}

            <ActionButton onClick={convertToPdf} disabled={loading || !files || files.length === 0}>
                {loading ? <LoadingSpinner /> : 'Create PDF'}
            </ActionButton>
            
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default ImageToPdfConverter;
