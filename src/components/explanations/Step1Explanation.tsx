"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";

interface Step1ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step1Explanation({
  onNextStep,
  nextStepLabel,
}: Step1ExplanationProps) {
  return (
    <ExplanationSection
      title="1. A user want to login on your application"
      description="Most applications require users to login to see certain pages or perform specific actions. In a modern OAuth 2.0/OpenID Connect scenario, the user is usually redirected to a the authorization server to perform the authentication."
      note="For this example we're using the Authorization Code Grant. Depending on your type of application this might not be the right choice. How to leverage DPoP to demonstrate proof of possession will remain the same for all OAuth flows."
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Redirect to Authorization Server"
      nextStepDescription="Now let's see how the application redirects to the authorization server with all the necessary OAuth 2.0 parameters, including DPoP-specific headers for token binding."
    >
      <div className="my-4 space-y-4">
        <p className="text-gray-400 leading-relaxed">
          When the user clicks the login button, we initiate a redirect to the
          authorization server and request an Authorization Code using the OAuth
          2.0 Authorization Code Flow with PKCE.
        </p>
      </div>
      <div className="my-4 space-y-4">
        <h3 className="text-xl font-bold text-white">
          What happens in this step:
        </h3>
        <ul className="list-disc pl-4 text-gray-400 space-y-2">
          <li>User arrives at your application</li>
          <li>Application detects unauthenticated state</li>
          <li>Login button triggers OAuth flow initiation</li>
          <li>PKCE parameters are generated for security</li>
        </ul>
      </div>
    </ExplanationSection>
  );
}
