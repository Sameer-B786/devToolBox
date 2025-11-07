
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { tools } from '../data/tools';

const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the tool you were looking for.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const { component: ToolComponent, title, description, icon: Icon } = tool;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 text-primary p-3 rounded-lg">
           <Icon className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-4xl font-heading font-bold">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="bg-card-bg p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100">
        <ToolComponent />
      </div>
    </div>
  );
};

export default ToolPage;
