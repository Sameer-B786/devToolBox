import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const PdfToWordConverter: React.FC = () => {
  const prompt = "I need to convert a PDF file to an editable Word document (.docx). What are the best, most reliable, and secure methods to do this? Explain a few options, such as using online converters or software like Adobe Acrobat. Emphasize the pros and cons of each, especially regarding privacy and formatting preservation. Format the output using markdown for readability.";
  
  return (
      <GeminiTool prompt={prompt} userInput="" buttonText="Get PDF to Word Conversion Advice">
        {() => (
          <p className="text-gray-600">
            Direct file conversion is complex and best handled by specialized tools. 
            Click the button below to get expert advice from Gemini on the best and safest ways to convert your PDF to a Word document.
          </p>
        )}
      </GeminiTool>
  );
};

export default PdfToWordConverter;
