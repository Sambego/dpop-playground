"use client";

import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import SkeletonLoader, { SkeletonCard } from "@/components/ui/SkeletonLoader";
import ArrowRightIcon from "@/components/ui/icons/ArrowRightIcon";

interface Step3DashboardProps {
  userEmail: string;
  onAccessResource: () => void;
}

export default function Step3Dashboard({
  userEmail,
  onAccessResource,
}: Step3DashboardProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <GlassCard variant="dark" padding="none" className="border-b border-border/40 rounded-none">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center glass-card">
                <div className="w-4 h-4 bg-accent/40 rounded"></div>
              </div>
              <SkeletonLoader width="w-20" height="h-4" />
            </div>
            <Avatar name="Sam" email={userEmail} size="sm" />
          </div>
        </div>
      </GlassCard>

      <div className="flex-1 bg-background-secondary/30 p-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <SkeletonLoader width="w-64" height="h-8" />
            <SkeletonLoader width="w-96" height="h-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard>
              <SkeletonLoader width="w-32" height="h-6" />
              <SkeletonLoader width="w-full" height="h-4" />
              <SkeletonLoader width="w-3/4" height="h-4" />
            </SkeletonCard>

            <SkeletonCard>
              <SkeletonLoader width="w-28" height="h-6" />
              <SkeletonLoader width="w-full" height="h-4" />
              <SkeletonLoader width="w-2/3" height="h-4" />
            </SkeletonCard>
          </div>

          <div className="pt-6">
            <GlassButton onClick={onAccessResource} size="lg">
              <span>Access Protected Resource</span>
              <ArrowRightIcon />
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}