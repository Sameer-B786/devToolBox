
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p className="text-sm">
          &copy; {currentYear} DevToolBox by Sameer Bavaji. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;