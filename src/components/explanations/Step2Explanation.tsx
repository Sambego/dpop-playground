"use client";

import ExplanationSection from "@/components/ui/ExplanationSection";
import QueryParameterCard from "@/components/ui/QueryParameterCard";

interface Step2ExplanationProps {
  onNextStep?: () => void;
  nextStepLabel?: string;
}

export default function Step2Explanation({
  onNextStep,
  nextStepLabel,
}: Step2ExplanationProps) {
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
      description="Once the user has clicked on the login button within our application, we will redirect to our Authorization Server to deal with logging in the user."
      onNextStep={onNextStep}
      nextStepLabel={nextStepLabel}
      nextStepTitle="Handle Authorization Response"
      nextStepDescription="After successful authentication, the authorization server will redirect back to your application with an authorization code that can be exchanged for tokens."
    >
      <div className="my-4 space-y-4 text-gray-400">
        <p>
          If the user provides the correct credentials, the Authorization server
          will redirect back to the application as specified in the{" "}
          <code className="mx-1 px-1 border rounded border-border bg-background-secondary">
            redirect_uri
          </code>
          query parameter. It will also attach an Authorization code, which we
          exchange for an Access Token.
        </p>
      </div>
      <div className="my-4 space-y-4">
        <h3 className="text-xl font-bold text-white">
          In this step we'll perform:
        </h3>
        <ul className="list-disc pl-4 text-gray-400 space-y-2">
          <li>Redirect includes OAuth 2.0 parameters</li>
          <li>DPoP header sent with authorization request</li>
          <li>User authenticates with credentials</li>
          <li>Authorization server validates identity</li>
        </ul>
      </div>

      <div className="my-4 space-y-4">
        <h4 className="text-lg font-semibold text-white">
          Authorization Request Parameters
        </h4>
        <div className="glass-card p-4">
          <div className="text-sm text-gray-400 space-y-1">
            {queryParameters.map((param, index) => (
              <div key={index} className="flex">
                <code className="text-accent font-mono mr-3 min-w-fit">
                  {param.parameter}
                </code>
                <span className="text-gray-400">— {param.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ExplanationSection>
  );
}
