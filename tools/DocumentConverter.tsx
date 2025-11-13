import React from 'react';
import { useParams } from 'react-router-dom';
import GeminiTool from '../components/common/GeminiTool';

const DocumentConverter: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const toolConfig = {
        'pdf-to-word-converter': {
            prompt: "I need to convert a PDF file to an editable Word document (.docx). What are the best, most reliable, and secure methods to do this? Explain a few options, such as using online converters or software like Adobe Acrobat. Emphasize the pros and cons of each, especially regarding privacy and formatting preservation. Format the output using markdown for readability.",
            buttonText: "Get PDF to Word Conversion Advice",
            description: "Direct file conversion is complex and best handled by specialized tools. Click the button below to get expert advice from Gemini on the best and safest ways to convert your PDF to a Word document."
        },
        'word-to-pdf-converter': {
            prompt: "I need to convert a Word document (.docx) to a PDF. What are the best and easiest ways to do this for free? Explain common methods like using the 'Save as PDF' feature in Microsoft Word or Google Docs, and also mention reliable online tools. Discuss the benefits of each method.",
            buttonText: "Get Word to PDF Conversion Advice",
            description: "There are many easy ways to convert Word documents to PDF. Click the button below to get advice from Gemini on the best methods, from using your existing software to free online tools."
        },
        'pdf-to-ppt-converter': {
            prompt: "I need to convert a PDF file to a PowerPoint presentation (.pptx). What are the most effective methods to do this? Please explain options like online converters or specialized software. Discuss the trade-offs, focusing on maintaining layout, images, and text editability. Format the output using markdown.",
            buttonText: "Get PDF to PowerPoint Conversion Advice",
            description: "Converting a PDF to an editable PowerPoint presentation can be challenging. Click the button below to get expert advice from Gemini on the best tools and methods to preserve your document's formatting."
        },
        'excel-to-pdf-converter': {
            prompt: "I want to convert an Excel spreadsheet (.xlsx) to a PDF file. What are the best ways to do this, especially for multi-sheet workbooks? Explain the built-in 'Save as PDF' options in Excel and Google Sheets, as well as reliable online converters. Focus on tips for preserving formatting, page layout, and print areas.",
            buttonText: "Get Excel to PDF Conversion Advice",
            description: "Properly converting Excel files to PDF is key to preserving formatting. Click the button below to get expert advice from Gemini on the best methods, from using Excel's built-in features to online tools."
        }
    };

    const currentTool = slug ? toolConfig[slug as keyof typeof toolConfig] : null;

    if (!currentTool) {
        return <p>Invalid document conversion tool selected.</p>;
    }

    return (
        <GeminiTool prompt={currentTool.prompt} userInput="" buttonText={currentTool.buttonText}>
            {() => (
                <p className="text-gray-600">
                    {currentTool.description}
                </p>
            )}
        </GeminiTool>
    );
};

export default DocumentConverter;
