import React from 'react';

interface ToolPlaceholderProps {
  title: string;
}

const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ title }) => {
  return (
    <div>
      <p className="text-gray-500 mb-6">This tool is currently under construction. Please check back later!</p>
      <div className="mt-4 border border-dashed border-gray-300 rounded-2xl h-80 flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500">{title} will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default ToolPlaceholder;
