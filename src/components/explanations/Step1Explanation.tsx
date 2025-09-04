"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";

interface Step1ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step1Explanation({ onNextStep, nextStepLabel }: Step1ExplanationProps) {
  return (
    <ExplanationSection
      title="1. A user want to login on your application"
      description="Most applications require users to login to see certain pages or perform specific actions. In a modern OAuth 2.0/OpenID Connect scenario, the user is usually redirected to a the authorization server to perform the authentication."
      steps={[
        "User clicks login button in the application",
        "The browser redirects to authorization server starting OAuth's Authorization Code Flow with Proof Key for Code Exchange (PKCE) flow protected by DPoP."
      ]}
      note="For this example we're using the Authorization Code Grant. Depending on your type of application this might not be the right choice. How to leverage DPoP to demonstrate proof of possession will remain the same for all OAuth flows."
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Redirect to Authorization Server"
      nextStepDescription="Now let's see how the application redirects to the authorization server with all the necessary OAuth 2.0 parameters, including DPoP-specific headers for token binding."
    >
      <div className="space-y-4">
        <p className="text-gray-400 leading-relaxed">
          When the user clicks the login button, we initiate a redirect to the authorization server 
          and request an Authorization Code using the OAuth 2.0 Authorization Code Flow with PKCE.
        </p>
        
        <div className="glass-card rounded-lg p-4 bg-green-500/10 border-green-500/20">
          <h4 className="text-green-400 font-semibold mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            DPoP Enhancement
          </h4>
          <p className="text-gray-300 text-sm">
            This flow is enhanced with <strong>DPoP (Demonstrating Proof of Possession)</strong>, 
            which cryptographically binds tokens to specific clients, preventing token theft and replay attacks.
          </p>
        </div>

        <div className="text-sm space-y-2">
          <h4 className="text-white font-semibold">What happens in this step:</h4>
          <ul className="text-gray-400 space-y-1 ml-4">
            <li>• User arrives at your application</li>
            <li>• Application detects unauthenticated state</li>
            <li>• Login button triggers OAuth flow initiation</li>
            <li>• PKCE parameters are generated for security</li>
          </ul>
        </div>
      </div>
    </ExplanationSection>
  );
}