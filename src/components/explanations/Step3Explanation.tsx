"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";

interface Step3ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step3Explanation({ onNextStep, nextStepLabel }: Step3ExplanationProps) {
  return (
    <ExplanationSection
      title="3. Authorization Code Received"
      description="After successful authentication, the authorization server redirects back to your application with an authorization code. The user is now logged in and can access the application dashboard. The authorization code will be exchanged for DPoP-bound tokens in the next step."
      note='The authorization code (e.g., "SplxlOBeZQQYbYS6WxSbIA") is short-lived and will be exchanged for DPoP-bound access tokens, providing cryptographic proof of key possession.'
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Generate Cryptographic Keys"
      nextStepDescription="Before exchanging the authorization code for tokens, we need to generate a cryptographic key pair that will be used to create DPoP proofs and bind tokens to this specific client."
    >
      <div className="text-sm text-gray-500 space-y-2">
        <p>• User successfully authenticated and logged in</p>
        <p>• Authorization code received via redirect</p>
        <p>• Application shows logged-in user state</p>
        <p>• Ready to exchange code for tokens</p>
      </div>
    </ExplanationSection>
  );
}