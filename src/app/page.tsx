"use client";

import { useState, useEffect } from "react";
import Section from "@/components/Section";
import Introduction from "@/components/Introduction";
import Sidebar from "@/components/Sidebar";
import StickyLogo from "@/components/StickyLogo";
import Footer from "@/components/Footer";
import SettingsOverlay from "@/components/SettingsOverlay";
import ConceptsPage from "@/components/ConceptsPage";
import InteractiveFlow from "@/components/InteractiveFlow";
import { isValidSectionId } from "@/utils/security";
import { STEP_IDS } from "@/constants/app";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showConceptsPage, setShowConceptsPage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Set up intersection observer to track which step is visible
  useEffect(() => {
    const stepIds = [...STEP_IDS];
    const stepMap: Record<string, number> = Object.fromEntries(
      STEP_IDS.map((id, index) => [id, index])
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNumber = stepMap[entry.target.id];
            if (stepNumber !== undefined) {
              setCurrentStep(stepNumber);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: "-100px 0px -100px 0px", // Offset to account for sticky elements
      }
    );

    // Observe all step sections
    stepIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Validate section ID to prevent XSS
    if (!isValidSectionId(sectionId)) {
      console.warn(`Invalid section ID: ${sectionId}`);
      return;
    }

    // Update current step based on section
    const stepMap: Record<string, number> = Object.fromEntries(
      STEP_IDS.map((id, index) => [id, index])
    );

    if (stepMap[sectionId] !== undefined) {
      setCurrentStep(stepMap[sectionId]);
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn(`Element with ID "${sectionId}" not found in DOM`);
    }
  };


  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Logo */}
      <StickyLogo />

      {/* Sidebar */}
      <Sidebar
        onSettingsClick={() => setIsSettingsOpen(true)}
        currentStep={currentStep}
        totalSteps={8}
      />

      {/* Settings Overlay */}
      <SettingsOverlay
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Main Content */}

      <main>
        {/* Introduction */}
        <Section id="introduction" className="bg-section-dark pt-24">
          <Introduction onGetStarted={() => scrollToSection("step1")} />
        </Section>

        {/* Interactive Flow */}
        <InteractiveFlow onScrollToSection={scrollToSection} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Concepts Page Overlay */}
      {showConceptsPage && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="relative">
            <button
              onClick={() => setShowConceptsPage(false)}
              className="fixed top-6 right-6 z-60 p-3 glass-card hover:glass-card-hover rounded-xl border border-border/40 text-muted-light hover:text-white transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ConceptsPage isVisible={showConceptsPage} />
          </div>
        </div>
      )}
    </div>
  );
}
