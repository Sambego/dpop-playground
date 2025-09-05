"use client";

import Section from "@/components/Section";
import BrowserWindow from "@/components/BrowserWindow";
import Step3Dashboard from "@/components/browser-content/Step3Dashboard";
import Step3Explanation from "@/components/explanations/Step3Explanation";
import { URLS, DEMO_VALUES } from "@/constants/app";

interface Step3AuthCodeProps {
  userEmail: string;
  onScrollToSection: (sectionId: string) => void;
}

export default function Step3AuthCode({
  userEmail,
  onScrollToSection,
}: Step3AuthCodeProps) {
  return (
    <Section id="step3" className="bg-section-light">
      <BrowserWindow
        title="MyApp - Dashboard"
        url={`${URLS.APP_DOMAIN}/callback?code=${DEMO_VALUES.AUTH_CODE}&state=${DEMO_VALUES.STATE}`}
        slideDirection="left"
        explanation={<Step3Explanation onNextStep={() => onScrollToSection("step4")} nextStepLabel="Generate Key Pair" />}
      >
        <Step3Dashboard
          userEmail={userEmail}
          onAccessResource={() => onScrollToSection("step4")}
        />
      </BrowserWindow>
    </Section>
  );
}