"use client";

import Section from "@/components/Section";
import BrowserWindow from "@/components/BrowserWindow";
import Step1AppSkeleton from "@/components/browser-content/Step1AppSkeleton";
import Step1Explanation from "@/components/explanations/Step1Explanation";

interface Step1UserLoginProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Step1UserLogin({ onScrollToSection }: Step1UserLoginProps) {
  return (
    <Section id="step1" className="bg-section-light">
      <BrowserWindow
        title="MyApp - Welcome"
        url="https://app.example.com"
        slideDirection="left"
        explanation={<Step1Explanation onNextStep={() => onScrollToSection("step2")} nextStepLabel="Login with Authorization Server" />}
      >
        <Step1AppSkeleton onLogin={() => onScrollToSection("step2")} />
      </BrowserWindow>
    </Section>
  );
}