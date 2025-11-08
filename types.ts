import React from 'react';

export enum Category {
  TEXT = 'Text Tools',
  CONVERSION = 'Conversion & Calculation',
  IMAGE = 'Image Tools',
  DEV = 'Data & Development',
  SEO = 'SEO & Web Tools',
  DOCUMENT = 'Document & File Tools',
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: Category;
  component: React.LazyExoticComponent<React.FC<{}>>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}