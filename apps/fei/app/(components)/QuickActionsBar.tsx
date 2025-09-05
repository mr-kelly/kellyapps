'use client';
import React from 'react';

interface Props {
  onNew: () => void;
  onRunAll: () => void;
  onExport: () => void;
  running?: boolean;
}

export function QuickActionsBar({ onNew, onRunAll, onExport, running }: Props) {
  return (
    <div className="flex md:flex-col gap-2 md:gap-3 p-3 md:p-4 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-t md:border border-neutral-700 md:rounded-2xl shadow-card w-full md:w-52">
      <button type="button" onClick={onNew} className="flex-1 md:w-full bg-accent hover:bg-accent/90 text-white text-sm font-medium py-2 rounded-md focus:outline-none focus:ring-2 ring-accent/50">+ New Task</button>
      <button type="button" onClick={onRunAll} disabled={running} className="flex-1 md:w-full bg-neutral-700 disabled:opacity-40 hover:bg-neutral-600 text-neutral-100 text-sm font-medium py-2 rounded-md focus:outline-none focus:ring-2 ring-neutral-500">Run All Now</button>
      <button type="button" onClick={onExport} className="flex-1 md:w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-100 text-sm font-medium py-2 rounded-md focus:outline-none focus:ring-2 ring-neutral-500">Export Today</button>
    </div>
  );
}

export default QuickActionsBar;
