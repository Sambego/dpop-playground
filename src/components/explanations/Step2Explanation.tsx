"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";
import QueryParameterCard from "@/components/ui/QueryParameterCard";

interface Step2ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step2Explanation({ onNextStep, nextStepLabel }: Step2ExplanationProps) {
  const queryParameters = [
    {
      parameter: "response_type=code",
      description: "Indicates authorization code grant flow",
    },
    {
      parameter: "client_id",
      description: "Unique identifier for the requesting application",
    },
    {
      parameter: "redirect_uri",
      description: "URL where the user will be redirected after authentication",
    },
    {
      parameter: "scope",
      description: "Permissions requested (openid, profile, email)",
    },
    {
      parameter: "state",
      description: "Random value for CSRF protection",
    },
    {
      parameter: "code_challenge",
      description: "SHA256 hash of code verifier (PKCE security)",
    },
    {
      parameter: "dpop_jkt",
      description: "JSON Web Key thumbprint for DPoP token binding",
    },
  ];

  return (
    <ExplanationSection
      title="2. Redirect to Authorization Server"
      description="Your application redirects the user to the authorization server. The redirect includes your client_id, redirect_uri, response_type, and scope in the query parameters. Your application should also include a DPoP header with the first request to the authorization server."
      note="The authorization server validates the user's credentials and generates an authorization code. This code will be used later to exchange for tokens with DPoP binding."
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Handle Authorization Response"
      nextStepDescription="After successful authentication, the authorization server will redirect back to your application with an authorization code that can be exchanged for tokens."
    >
      <div className="text-sm text-gray-500 space-y-2">
        <p>• Redirect includes OAuth 2.0 parameters</p>
        <p>• DPoP header sent with authorization request</p>
        <p>• User authenticates with credentials</p>
        <p>• Authorization server validates identity</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">
          Authorization Request Parameters
        </h4>
        <div className="grid gap-3">
          {queryParameters.map((param, index) => (
            <QueryParameterCard
              key={index}
              parameter={param.parameter}
              description={param.description}
            />
          ))}
        </div>
      </div>
    </ExplanationSection>
  );
}