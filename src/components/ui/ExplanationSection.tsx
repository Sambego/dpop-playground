"use client";

import { ReactNode } from "react";
import GlassCard from "./GlassCard";
import GlassButton from "./GlassButton";

interface ExplanationSectionProps {
  title: string;
  description: string;
  steps?: string[];
  children?: ReactNode;
  note?: string;
  onNextStep?: () => void;
  nextStepLabel?: string;
  nextStepTitle?: string;
  nextStepDescription?: string;
}

export default function ExplanationSection({
  title,
  description,
  steps,
  children,
  note,
  onNextStep,
  nextStepLabel,
  nextStepTitle,
  nextStepDescription,
}: ExplanationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-[#10b981] pl-4">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
        {steps && (
          <ol className="list-decimal text-gray-400 text-md space-y-2 ml-4">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
      </div>
      {children}
      {onNextStep && (
        <div className="pt-6">
          <div className="glass-card rounded-lg p-6 bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-blue-400">
                {nextStepTitle || "Ready for Next Step?"}
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {nextStepDescription || "Continue to the next step in the DPoP implementation flow."}
            </p>
            <GlassButton
              onClick={onNextStep}
              className="w-full"
            >
              {nextStepLabel || "Continue to Next Step"} →
            </GlassButton>
          </div>
        </div>
      )}
      {note && (
        <GlassCard className="border border-accent/10">
          <p className="text-xs text-gray-400 italic">{note}</p>
        </GlassCard>
      )}
    </div>
  );
}