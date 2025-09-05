"use client";

import Section from "@/components/Section";
import BrowserWindow from "@/components/BrowserWindow";
import Step2LoginForm from "@/components/browser-content/Step2LoginForm";
import Step2Explanation from "@/components/explanations/Step2Explanation";
import { OAUTH_CONFIG, DEMO_VALUES } from "@/constants/app";

interface Step2AuthServerProps {
  userEmail: string;
  onEmailChange: (email: string) => void;
  onScrollToSection: (sectionId: string) => void;
  authServerUrl: string;
  authorizationEndpoint: string;
}

export default function Step2AuthServer({
  userEmail,
  onEmailChange,
  onScrollToSection,
  authServerUrl,
  authorizationEndpoint,
}: Step2AuthServerProps) {
  const buildAuthUrl = (baseUrl: string) => {
    const params = new URLSearchParams({
      response_type: OAUTH_CONFIG.RESPONSE_TYPE,
      client_id: OAUTH_CONFIG.CLIENT_ID,
      redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
      scope: OAUTH_CONFIG.SCOPE,
      state: DEMO_VALUES.STATE,
      code_challenge: DEMO_VALUES.CODE_CHALLENGE,
      code_challenge_method: OAUTH_CONFIG.CODE_CHALLENGE_METHOD,
      dpop_jkt: DEMO_VALUES.DPOP_JKT,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const authUrl = authorizationEndpoint
    ? buildAuthUrl(authorizationEndpoint)
    : buildAuthUrl(`${authServerUrl}/oauth/authorize`);

  return (
    <Section id="step2" className="bg-section-dark">
      <BrowserWindow
        title="AuthServer - Login"
        url={authUrl}
        slideDirection="right"
        explanation={<Step2Explanation onNextStep={() => onScrollToSection("step3")} nextStepLabel="Get Authorization Code" />}
      >
        <Step2LoginForm
          userEmail={userEmail}
          onEmailChange={onEmailChange}
          onLogin={() => onScrollToSection("step3")}
        />
      </BrowserWindow>
    </Section>
  );
}