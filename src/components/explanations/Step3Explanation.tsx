"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";
import { DEMO_VALUES } from "@/constants/app";

interface Step3ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step3Explanation({
  onNextStep,
  nextStepLabel,
}: Step3ExplanationProps) {
  return (
    <ExplanationSection
      title="3. Authorization Code Received"
      description="After successful authentication, the authorization server redirects back to your application with an authorization code."
      note='The authorization code (e.g., "SplxlOBeZQQYbYS6WxSbIA") is short-lived and will be exchanged for DPoP-bound access tokens, providing cryptographic proof of key possession.'
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Generate Cryptographic Keys"
      nextStepDescription="Before exchanging the authorization code for tokens, we need to generate a cryptographic key pair that will be used to create DPoP proofs and bind tokens to this specific client."
    >
      <div className="my-4 space-y-4 text-gray-400">
        <p>
          The user is now logged in and can access the application dashboard.
          The authorization code (
          <code className="mx-1 px-1 border rounded border-border bg-background-secondary">
            {DEMO_VALUES.AUTH_CODE}
          </code>
          ) will be exchanged for DPoP-bound tokens in the next step.
        </p>
      </div>
    </ExplanationSection>
  );
}
