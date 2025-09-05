"use client";
import React from 'react';
import { useTasks } from '../lib/tasks';
import TaskCard from './(components)/TaskCard';
import QuickActionsBar from './(components)/QuickActionsBar';
import TaskDetailPanel from './(components)/TaskDetailPanel';
import NewTaskDialog from './(components)/NewTaskDialog';
import EmptyState from './(components)/EmptyState';

export default function HomePage() {
  const tasksApi = useTasks();
  const { tasks, selected, select, runAll } = tasksApi;
  const [showNew, setShowNew] = React.useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);

  function openTask(id: string) {
    select(id);
    setMobileDetailOpen(true);
  }

  return (
    <main className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 pt-4 pb-28 md:pb-4 md:px-6 max-w-[1600px] mx-auto w-full">
      {/* Task List */}
      <section className="flex-1 md:basis-1/3 flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-white">Tasks</h1>
          <button type="button" onClick={() => setShowNew(true)} className="text-xs bg-accent hover:bg-accent/90 text-white px-3 py-1.5 rounded-md">+ New</button>
        </header>
        {tasks.length === 0 ? (
          <EmptyState onCreate={() => setShowNew(true)} />
        ) : (
          <div className="grid gap-3">
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} onOpen={() => openTask(t.id)} onShare={() => alert('Share coming soon')} onDelete={() => tasksApi.remove(t.id)} onDuplicate={() => tasksApi.create({ title: `${t.title} (copy)`, sourceType: t.sourceType, sourceInput: t.sourceInput, frequency: t.frequency, delivery: t.delivery, outputFormat: t.outputFormat, language: t.language, triggerTime: t.triggerTime, timezone: t.timezone })} onEdit={() => alert('Edit placeholder')} />
            ))}
          </div>
        )}
      </section>
      {/* Detail Panel (desktop) */}
      <aside className="hidden md:block md:basis-1/3 bg-card/40 border border-neutral-700 rounded-2xl overflow-hidden min-h-[540px]">
        <TaskDetailPanel task={selected} onClose={() => select(undefined)} regenerate={tasksApi.regenerate} runOne={tasksApi.runOne} />
      </aside>
      {/* Quick Actions (desktop) */}
      <div className="hidden md:flex md:basis-[220px]">
        <QuickActionsBar onNew={() => setShowNew(true)} onRunAll={runAll} onExport={() => alert('Export coming soon')} />
      </div>

      {/* Mobile Task Detail Drawer */}
      {mobileDetailOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileDetailOpen(false)} />
          <div className="relative w-full h-[70%] bg-surface border-t border-neutral-700 rounded-t-2xl shadow-lg">
            <TaskDetailPanel task={selected} onClose={() => setMobileDetailOpen(false)} regenerate={tasksApi.regenerate} runOne={tasksApi.runOne} />
          </div>
        </div>
      )}

      {/* Mobile Quick Actions Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        <QuickActionsBar onNew={() => setShowNew(true)} onRunAll={runAll} onExport={() => alert('Export coming soon')} />
      </div>

  <NewTaskDialog open={showNew} onClose={() => setShowNew(false)} create={tasksApi.create} />
    </main>
  );
}