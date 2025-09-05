'use client';
import React from 'react';

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 gap-4 border-2 border-dashed border-neutral-600 rounded-2xl bg-card/40">
      <div className="w-16 h-16 rounded-full bg-neutral-700/40 flex items-center justify-center text-neutral-400 text-2xl">📰</div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">No tasks yet</h3>
        <p className="text-xs text-neutral-400 max-w-xs">Create your first news or market brief task to get started.</p>
      </div>
      <button type="button" onClick={onCreate} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium">+ Create your first task</button>
    </div>
  );
}

export default EmptyState;
