
import React, { useState, useMemo } from 'react';
import { tools } from '../data/tools';
import ToolCard from '../components/ToolCard';
import { Category } from '../types';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchTerm) {
      return tools;
    }
    return tools.filter(tool =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedTools = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<Category, typeof tools>);
  }, [filteredTools]);

  const categoryOrder = Object.values(Category);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-4">
          Your Ultimate Online <span className="text-primary">Toolbox</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A collection of free, fast, and simple online tools to make your life easier. No ads, no tracking, just tools.
        </p>
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for a tool (e.g., 'word counter', 'json')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-300 shadow-sm"
          />
        </div>
      </section>

      {categoryOrder.map(category => (
        groupedTools[category] && groupedTools[category].length > 0 && (
          <section key={category} id={category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')} className="mb-16">
            <h2 className="text-3xl font-heading font-bold mb-6 border-l-4 border-primary pl-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTools[category].map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default HomePage;
