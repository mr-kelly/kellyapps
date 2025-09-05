'use client';
import React from 'react';
import { Task } from '../../lib/tasks';

interface Props {
  task: Task;
  onOpen: () => void;
  onShare: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
}

const statusStyles: Record<string, string> = {
  'done-today': 'bg-positive/20 text-positive border border-positive/30',
  'scheduled': 'bg-neutral-700/30 text-neutral-300 border border-neutral-600',
  'error': 'bg-danger/20 text-danger border border-danger/40'
};

export function TaskCard({ task, onOpen, onShare, onDelete, onDuplicate, onEdit }: Props) {
  return (
  <div className="group relative rounded-2xl bg-card shadow-card p-4 flex flex-col gap-3" aria-label={task.title}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{task.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-neutral-400">
            <span className="px-1.5 py-0.5 rounded bg-neutral-700/40 uppercase tracking-wide">{task.sourceType}:{task.sourceInput}</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-700/40">{task.frequency}</span>
            {task.lastRunAt && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-800/40" title={task.lastRunAt}>last {new Date(task.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </div>
        <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusStyles[task.status]} select-none`}>{task.status === 'done-today' ? 'Done today' : task.status === 'scheduled' ? 'Scheduled' : 'Error'}</div>
      </div>
      <div className="flex gap-2">
  <button type="button" onClick={onOpen} className="flex-1 text-xs bg-accent hover:bg-accent/90 text-white px-3 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 ring-accent/50">Open Summary</button>
  <button type="button" onClick={onShare} className="text-xs bg-neutral-700 hover:bg-neutral-600 text-neutral-100 px-3 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 ring-neutral-500">Share</button>
      </div>
      <div className="absolute top-2 right-2">
        <Menu onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>
    </div>
  );
}

function Menu({ onEdit, onDuplicate, onDelete }: { onEdit: () => void; onDuplicate: () => void; onDelete: () => void; }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
  <button type="button" aria-label="Task menu" onClick={() => setOpen(o => !o)} className="p-1 rounded hover:bg-neutral-600/50 focus:outline-none focus:ring-2 ring-accent/50">
        <span className="block w-4 h-4 text-neutral-300">⋮</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-card border border-neutral-700 rounded-md shadow-lg z-10 py-1 text-xs">
          <button type="button" onClick={() => { onEdit(); setOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-neutral-700/50">Edit</button>
          <button type="button" onClick={() => { onDuplicate(); setOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-neutral-700/50">Duplicate</button>
          <button type="button" onClick={() => { onDelete(); setOpen(false); }} className="w-full text-left px-3 py-1.5 text-danger hover:bg-danger/20">Delete</button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
