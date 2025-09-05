"use client";

import { useState, useEffect } from "react";

interface BrowserWindowProps {
  title: string;
  url: string;
  children: React.ReactNode;
  slideDirection: "left" | "right";
  explanation?: React.ReactNode;
}

export default function BrowserWindow({
  title,
  url,
  children,
  slideDirection,
  explanation,
}: BrowserWindowProps) {
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

    const element = document.getElementById(
      `browser-${title.replace(/\s+/g, "-").toLowerCase()}`
    );
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
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] lg:grid-flow-col-dense`}
      >
        {/* Explanation column */}
        {explanation && (
          <div
            className={`${
              slideDirection === "right" ? "lg:col-start-1" : "lg:col-start-2"
            } space-y-6`}
          >
            <div
              className={`
                transform transition-all duration-700 ease-out delay-300
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : slideDirection === "left"
                    ? "translate-x-8 opacity-0"
                    : "-translate-x-8 opacity-0"
                }
              `}
            >
              {explanation}
            </div>
          </div>
        )}

        {/* Browser window */}
        <div
          className={
            slideDirection === "right" ? "lg:col-start-2" : "lg:col-start-1"
          }
        >
          <div
            id={`browser-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className={`
              glass-card-dark rounded-2xl overflow-hidden hover-glow
              transform transition-all duration-700 ease-out
              ${slideDirection === "left" ? "-rotate-1" : "rotate-1"}
              ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : slideDirection === "left"
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }
            `}
          >
            <div className="bg-gradient-to-r from-card/60 to-card-dark/40 border-b border-border/30 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-accent rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 mx-4 min-w-0">
                  <div className="bg-background-secondary/80 border border-border/40 rounded-lg px-4 py-2 text-xs backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-3 h-3 text-theme-muted flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <div className="flex-1 overflow-hidden min-w-0">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent">
                          <span className="text-theme-secondary font-mono whitespace-nowrap inline-block">
                            {url}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background-secondary/40 to-background-tertiary/60 backdrop-blur-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
