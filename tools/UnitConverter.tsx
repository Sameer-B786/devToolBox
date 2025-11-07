import React, { useState } from 'react';
import GeminiTool from '../components/common/GeminiTool';

const UnitConverter: React.FC = () => {
  const prompt = "Act as a unit converter. Convert the following measurement. Only provide the numerical result and the unit, nothing else. For example, if asked to convert '100km to miles', the correct output is '62.1371 miles'.";
  
  return (
    <GeminiTool prompt={prompt} userInput="100km to miles">
      {(input, setInput) => (
         <div>
            <label htmlFor="unit-input" className="block text-sm font-medium text-gray-700 mb-1">
                Enter conversion query
            </label>
            <input
              type="text"
              id="unit-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 10 feet to meters"
            />
        </div>
      )}
    </GeminiTool>
  );
};

export default UnitConverter;
