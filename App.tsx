import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">
            <Suspense fallback={<div className="flex justify-center items-center h-full p-8">Loading tool...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tool/:slug" element={<ToolPage />} />
                </Routes>
            </Suspense>
        </main>
        <ScrollToTopButton />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;