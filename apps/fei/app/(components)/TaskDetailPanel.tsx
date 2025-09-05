'use client';
import React from 'react';
import { Task } from '../../lib/tasks';

interface Props {
  task?: Task;
  onClose: () => void;
  regenerate: (id: string) => void;
  runOne: (id: string) => void;
}

export function TaskDetailPanel({ task, onClose, regenerate, runOne }: Props) {
  if (!task) return (
    <div className="hidden md:flex flex-col items-center justify-center text-neutral-500 text-sm">Select a task</div>
  );
  const summary = task.lastSummary;
  const isZh = task.language === 'zh-HK';
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 py-3 md:py-4 px-4 border-b border-neutral-700">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-white">{task.title}</h2>
          <span className="text-[10px] text-neutral-400">{task.status === 'done-today' ? (isZh ? '今日已生成' : 'Generated today') : task.status}</span>
        </div>
        <button type="button" onClick={onClose} className="md:hidden text-neutral-400 hover:text-neutral-200 text-sm px-2 py-1">Close</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="bg-card rounded-xl border border-neutral-700 p-4">
          <header className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold tracking-wide text-neutral-300">{isZh ? '今日摘要' : `Today's Summary`} ({task.timezone})</h3>
            <div className="flex gap-1">
              <button type="button" onClick={() => navigator.clipboard.writeText(formatSummary(task))} className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-[11px]">Copy</button>
              <button type="button" onClick={() => alert('Share: Coming soon')} className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-[11px]">Share</button>
              <button type="button" onClick={() => alert('PDF: Coming soon')} className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-[11px]">PDF</button>
              <button type="button" onClick={() => alert('PPT: Coming soon')} className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-[11px]">PPT</button>
            </div>
          </header>
          {summary ? (
            <div className="space-y-5 text-[13px] leading-relaxed">
              <div>
                <h4 className="text-neutral-200 font-medium mb-1">{isZh ? '五大標題' : 'Top 5 Headlines'}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {summary.headlines.map((h,i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-neutral-200 font-medium mb-1">{isZh ? '三大要點' : '3 Key Takeaways'}</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  {summary.takeaways.map((t,i) => <li key={i}>{t}</li>)}
                </ol>
              </div>
              <p className="text-[10px] text-neutral-500">{task.lastRunAt && (isZh ? '生成時間' : 'Generated at')} {task.lastRunAt && new Date(task.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {task.timezone}</p>
            </div>
          ) : (
            <div className="text-neutral-500 text-xs">{isZh ? '尚未生成摘要。' : 'No summary yet.'}</div>
          )}
        </section>
        <div className="flex gap-2">
          <button type="button" onClick={() => regenerate(task.id)} className="px-3 py-2 rounded-md bg-accent text-white text-xs font-medium">{isZh ? '重新生成' : 'Regenerate'}</button>
          {task.status === 'error' && (
            <button type="button" onClick={() => runOne(task.id)} className="px-3 py-2 rounded-md bg-danger/80 hover:bg-danger text-white text-xs font-medium">{isZh ? '重試' : 'Retry'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatSummary(task: Task) {
  if (!task.lastSummary) return '';
  return `${task.title}\n${task.lastSummary.headlines.map(h=>`- ${h}`).join('\n')}\n${task.lastSummary.takeaways.map((t,i)=>`${i+1}. ${t}`).join('\n')}`;
}

export default TaskDetailPanel;
