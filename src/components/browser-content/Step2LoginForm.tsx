"use client";

import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import { isValidEmail, sanitizeInput } from "@/utils/security";

interface Step2LoginFormProps {
  userEmail: string;
  onEmailChange: (email: string) => void;
  onLogin: () => void;
}

export default function Step2LoginForm({
  userEmail,
  onEmailChange,
  onLogin,
}: Step2LoginFormProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 bg-background-secondary/30 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <GlassCard>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-sm text-muted-light">
                This app requires you to sign in to your account.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value);
                    if (sanitized.length <= 254) { // Email length limit
                      onEmailChange(sanitized);
                    }
                  }}
                  className={`glass-input w-full px-4 py-3 rounded-lg text-white placeholder-muted focus:border-accent/50 transition-colors ${
                    userEmail && !isValidEmail(userEmail) ? 'border-red-500/50' : ''
                  }`}
                  placeholder="sam@example.com"
                  maxLength={254}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  disabled
                  className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-muted focus:border-accent/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <GlassButton onClick={onLogin} className="w-full">
                Sign In
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}