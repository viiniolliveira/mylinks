import React from 'react';

interface LinksSkeletonProps {
  count?: number;
}

export function LinksSkeleton({ count = 6 }: LinksSkeletonProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-muted animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-8 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
