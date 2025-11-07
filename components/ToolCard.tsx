
import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { slug, title, description, icon: Icon } = tool;

  return (
    <Link 
      to={`/tool/${slug}`} 
      className="group block bg-card-bg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 border border-gray-100 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 text-primary p-3 rounded-lg transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-heading text-text-primary mb-1">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
