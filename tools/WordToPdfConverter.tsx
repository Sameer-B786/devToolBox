import React from 'react';
import GeminiTool from '../components/common/GeminiTool';

const WordToPdfConverter: React.FC = () => {
  const prompt = "I need to convert a Word document (.docx) to a PDF. What are the best and easiest ways to do this for free? Explain common methods like using the 'Save as PDF' feature in Microsoft Word or Google Docs, and also mention reliable online tools. Discuss the benefits of each method.";
  
  return (
      <GeminiTool prompt={prompt} userInput="" buttonText="Get Word to PDF Conversion Advice">
        {() => (
          <p className="text-gray-600">
            There are many easy ways to convert Word documents to PDF. 
            Click the button below to get advice from Gemini on the best methods, from using your existing software to free online tools.
          </p>
        )}
      </GeminiTool>
  );
};

export default WordToPdfConverter;
