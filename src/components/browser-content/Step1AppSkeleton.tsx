"use client";

import GlassButton from "@/components/ui/GlassButton";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import LoginIcon from "@/components/ui/icons/LoginIcon";

interface Step1AppSkeletonProps {
  onLogin: () => void;
}

export default function Step1AppSkeleton({ onLogin }: Step1AppSkeletonProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 bg-background-secondary/30 flex items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <SkeletonLoader width="w-56" height="h-8" className="mx-auto" />
            <SkeletonLoader width="w-80" height="h-5" className="mx-auto" />
            <SkeletonLoader width="w-72" height="h-5" className="mx-auto" />
          </div>

          <GlassButton onClick={onLogin} size="lg" className="mx-auto">
            <LoginIcon />
            <span>Log In</span>
          </GlassButton>

          <SkeletonLoader width="w-48" height="h-4" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}