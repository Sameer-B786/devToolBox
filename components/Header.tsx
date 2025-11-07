
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Category } from '../types';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, category: Category) => {
    e.preventDefault();
    const categoryId = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0-1.4-1.4l-3.7 3.7-1.6-1.6a1 1 0 0 0-1.4 0zM7.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-3.2 4.9a1 1 0 0 0 0 1.4l3.7 3.7a1 1 0 0 0 1.4-1.4L5.7 17l3.7-3.7a1 1 0 0 0-1.4-1.4L4.3 16.9z" fill="currentColor"/>
            <path d="M16.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="currentColor"/>
            <path d="M21.7 16.9 18 20.6a1 1 0 0 1-1.4-1.4l3.7-3.7a1 1 0 0 1 1.4 1.4z" fill="currentColor"/>
          </svg>
          <span className="text-xl font-bold font-heading text-text-primary">DevToolBox</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {Object.values(Category).map(cat => (
             <a key={cat} href={`#${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} onClick={(e) => handleNavClick(e, cat)} className="text-gray-600 hover:text-primary transition-colors font-medium">
               {cat}
             </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
