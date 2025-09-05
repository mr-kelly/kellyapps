'use client';
import React from 'react';
import { Delivery, Frequency, SourceType } from '../../lib/tasks';

interface NewTaskInput {
  title: string;
  sourceType: SourceType;
  sourceInput: string;
  frequency: Frequency;
  delivery: Delivery[];
  language: 'en' | 'zh-HK';
}
interface Props {
  open: boolean;
  onClose: () => void;
  create: (data: NewTaskInput) => void;
}

export function NewTaskDialog({ open, onClose, create }: Props) {
  const [sourceType, setSourceType] = React.useState<SourceType>('url');
  const [sourceInput, setSourceInput] = React.useState('');
  const [frequency, setFrequency] = React.useState<Frequency>('daily');
  const [delivery, setDelivery] = React.useState<Delivery[]>(['in-app']);
  const [language, setLanguage] = React.useState<'en' | 'zh-HK'>('en');

  if (!open) return null;

  const canCreate = sourceInput.trim().length > 0;

  function toggleDelivery(v: Delivery) {
    setDelivery(d => d.includes(v) ? d.filter(x => x !== v) : [...d, v]);
  }

  function submit() {
    if (!canCreate) return;
    const title = `${sourceInput} — ${frequency === 'daily' ? 'Daily' : frequency === 'weekly' ? 'Weekly' : 'Realtime'}`;
  create({ title, sourceType, sourceInput, frequency, delivery, language });
    onClose();
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
  <div className="absolute inset-0 bg-black/70" aria-label="Close dialog" onClick={onClose} onKeyDown={e => { if(e.key==='Enter' || e.key===' ') onClose(); }} />
      <div className="relative w-full md:w-[480px] bg-card border border-neutral-700 rounded-t-2xl md:rounded-2xl shadow-xl p-5 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-white">New Task</h2>
        <form onSubmit={e => { e.preventDefault(); submit(); }} className="space-y-4 text-sm">
          <div className="flex gap-2">
            <label className="flex flex-col flex-1 gap-1">Source Type
              <select value={sourceType} onChange={e => setSourceType(e.target.value as SourceType)} className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 ring-accent/50">
                <option value="url">URL</option>
                <option value="keyword">Keyword</option>
                <option value="ticker">Ticker</option>
              </select>
            </label>
            <label className="flex flex-col flex-1 gap-1">Frequency
              <select value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 ring-accent/50">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="realtime" disabled>Realtime (beta)</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">Source Input
            <input value={sourceInput} onChange={e => setSourceInput(e.target.value)} placeholder="Paste URL, keyword, or ticker" className="bg-neutral-800 border border-neutral-600 rounded px-3 py-2 focus:outline-none focus:ring-2 ring-accent/50" />
          </label>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-neutral-300">Delivery</legend>
            <div className="flex gap-2 flex-wrap">
              {(['in-app','email','im'] as Delivery[]).map(d => (
                <button type="button" key={d} onClick={() => toggleDelivery(d)} className={`px-3 py-1.5 text-xs rounded-md border ${delivery.includes(d) ? 'bg-accent text-white border-accent' : 'bg-neutral-800 border-neutral-600 text-neutral-300'}`}>{d === 'im' ? 'WhatsApp/WeChat' : d}</button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1">Language
            <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'zh-HK')} className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1.5 focus:outline-none focus:ring-2 ring-accent/50">
              <option value="en">English</option>
              <option value="zh-HK">繁中</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700/40">Cancel</button>
            <button type="submit" disabled={!canCreate} className="px-4 py-2 rounded-md bg-accent disabled:opacity-40 text-white font-medium">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskDialog;
