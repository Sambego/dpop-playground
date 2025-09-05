'use client';

import { useState, useEffect } from 'react';

interface CodeEditorProps {
  title: string;
  language: string;
  code: string;
  slideDirection: 'left' | 'right';
  explanation?: React.ReactNode;
}

export default function CodeEditor({ title, language, code, slideDirection, explanation }: CodeEditorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`code-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [title]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] ${slideDirection === 'left' ? '' : 'lg:grid-flow-col-dense'}`}>
        {/* Explanation column */}
        {explanation && (
          <div className={`${slideDirection === 'right' ? 'lg:col-start-1' : 'lg:col-start-2'} space-y-6`}>
            <div 
              className={`
                transform transition-all duration-700 ease-out delay-300
                ${isVisible 
                  ? 'translate-x-0 opacity-100' 
                  : slideDirection === 'left' 
                    ? 'translate-x-8 opacity-0' 
                    : '-translate-x-8 opacity-0'
                }
              `}
            >
              {explanation}
            </div>
          </div>
        )}
        
        {/* Code editor */}
        <div className={slideDirection === 'right' ? 'lg:col-start-2' : 'lg:col-start-1'}>
          <div 
            id={`code-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className={`
              glass-card-dark rounded-2xl overflow-hidden hover-glow
              transform transition-all duration-700 ease-out
              ${slideDirection === 'left' ? '-rotate-1' : 'rotate-1'}
              ${isVisible 
                ? 'translate-x-0 opacity-100' 
                : slideDirection === 'left' 
                  ? '-translate-x-full opacity-0' 
                  : 'translate-x-full opacity-0'
              }
            `}
          >
            <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/20 border-b border-white/4 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full shadow-sm"></div>
                  </div>
                  <div className="text-sm font-medium text-white">{title}</div>
                </div>
                <div className="text-xs text-code-gray bg-black/15 border border-white/6 px-3 py-1.5 rounded-full font-mono backdrop-blur-sm">
                  {language}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-black/40 to-gray-900/20 p-6 overflow-x-auto backdrop-blur-sm">
              <pre className="text-sm leading-relaxed">
                <code className="text-gray-100 font-mono whitespace-pre-wrap">
                  {code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}