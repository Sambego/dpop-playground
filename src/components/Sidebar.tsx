"use client";

import { useState } from "react";
import { CHAPTER_TITLES, URLS } from "@/constants/app";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarProps {
  onSettingsClick: () => void;
  currentStep?: number;
  totalSteps?: number;
  onPreviousStep?: () => void;
  onNextStep?: () => void;
  onSidebarToggle?: (isCollapsed: boolean) => void;
}

export default function Sidebar({
  onSettingsClick,
  currentStep = 1,
  totalSteps = 8,
  onPreviousStep,
  onNextStep,
  onSidebarToggle,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { theme, setTheme, mounted } = useTheme();

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onSidebarToggle?.(collapsed);
  };

  const getChapterTitle = (step: number): string => {
    return CHAPTER_TITLES[step] || "Unknown";
  };

  return (
    <>
      {/* Backdrop when sidebar is open on mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => handleToggle(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 bottom-0 z-50 transition-all duration-300 ease-in-out flex flex-col justify-end h-full
        ${isCollapsed ? "translate-x-[-320px]" : "translate-x-0"}
      `}
      >
        <div className="w-80 glass-card-dark border-r border-border/40 backdrop-blur-xl flex flex-col m-4 rounded-2xl ml-4 mr-0">
          {/* Header with hide button */}
          <div className="flex items-center justify-between p-4 pb-2">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <button
              onClick={() => handleToggle(true)}
              className="p-2 rounded-lg glass-button text-muted hover:text-accent hover:scale-105 transition-all duration-200"
              title="Hide sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Settings Section */}
          <div className="px-6 pb-6 space-y-3">
            {/* Settings */}
            <button
              onClick={onSettingsClick}
              className="w-full p-3 rounded-lg glass-button group flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5 text-muted group-hover:text-accent transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-white group-hover:text-accent transition-colors">
                  Settings
                </div>
                <div className="text-xs text-muted">Configure DPoP options</div>
              </div>
            </button>

            {/* Theme Selector */}
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-2">
                Theme
              </label>
              {!mounted ? (
                <div className="w-full p-3 glass-input rounded-lg text-white bg-gray-700/50 animate-pulse">
                  Loading...
                </div>
              ) : (
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'system')}
                  className="w-full p-3 glass-input rounded-lg text-white transition-all duration-200"
                >
                  <option value="dark">🌙 Dark Mode</option>
                  <option value="light">☀️ Light Mode</option>
                  <option value="system">💻 System</option>
                </select>
              )}
              <div className="text-xs text-muted mt-1">
                {!mounted ? 'Loading theme...' : theme === 'system' ? 'Follows system preference' : 'Manual theme selection'}
              </div>
            </div>

            {/* Progress Bar and Navigation */}
            <div className="mt-6 pt-4 border-t border-border/40">
              <div className="space-y-4">
                {/* Step Progress */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-white mb-1">
                    {getChapterTitle(currentStep)}
                  </div>
                  <div className="text-xs text-muted mb-2">
                    Step {currentStep} of {totalSteps}
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Chapter List */}
                <div className="space-y-2">
                  {Array.from({ length: totalSteps + 1 }, (_, index) => (
                    <div
                      key={index}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        index === currentStep
                          ? "bg-accent/20 text-accent border border-accent/30"
                          : "text-muted hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            index === currentStep ? "bg-accent" : "bg-gray-600"
                          }`}
                        ></div>
                        <span>
                          {index}. {getChapterTitle(index)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Bottom Left) */}
      <button
        onClick={() => handleToggle(!isCollapsed)}
        className={`
          fixed bottom-6 left-6 z-50 p-4 glass-card-dark rounded-full border border-border/40 backdrop-blur-xl
          transition-all duration-300 ease-in-out hover-glow hover:scale-110 shadow-lg
          ${
            isCollapsed
              ? "opacity-100 translate-x-0"
              : "opacity-0 pointer-events-none translate-x-[-20px]"
          }
        `}
        title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
      >
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isCollapsed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          )}
        </svg>
      </button>
    </>
  );
}
