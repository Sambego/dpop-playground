"use client";

import GlassCard from "./GlassCard";

interface QueryParameterCardProps {
  parameter: string;
  description: string;
}

export default function QueryParameterCard({
  parameter,
  description,
}: QueryParameterCardProps) {
  return (
    <GlassCard padding="sm" className="border border-accent/10">
      <div className="flex items-start space-x-3">
        <code className="text-accent font-mono text-sm flex-shrink-0">
          {parameter}
        </code>
        <p className="text-xs text-muted-light">{description}</p>
      </div>
    </GlassCard>
  );
}