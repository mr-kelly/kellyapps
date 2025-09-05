"use client";
import React from 'react';
import { Button, Box, Sheet, Stack, Typography } from '@mui/joy';
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
  <Box component="main" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, pt: 2, pb: { xs: 10, md: 2 }, maxWidth: 1600, mx: 'auto', width: '100%' }}>
      {/* Task List */}
      <Box component="section" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, flexBasis: { md: '33%' } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="title-md">Tasks</Typography>
          <Button size="sm" onClick={() => setShowNew(true)} variant="solid" color="primary">+ New</Button>
        </Stack>
        {tasks.length === 0 ? (
          <EmptyState onCreate={() => setShowNew(true)} />
        ) : (
          <Stack gap={1.5}>
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} onOpen={() => openTask(t.id)} onShare={() => alert('Share coming soon')} onDelete={() => tasksApi.remove(t.id)} onDuplicate={() => tasksApi.create({ title: `${t.title} (copy)`, sourceType: t.sourceType, sourceInput: t.sourceInput, frequency: t.frequency, delivery: t.delivery, outputFormat: t.outputFormat, language: t.language, triggerTime: t.triggerTime, timezone: t.timezone })} onEdit={() => alert('Edit placeholder')} />
            ))}
          </Stack>
        )}
      </Box>
      {/* Detail Panel (desktop) */}
      <Box component="aside" sx={{ display: { xs: 'none', md: 'block' }, flexBasis: { md: '33%' }, bgcolor: 'background.surface', border: '1px solid', borderColor: 'neutral.outlinedBorder', borderRadius: 'xl', overflow: 'hidden', minHeight: 540 }}>
        <TaskDetailPanel task={selected} onClose={() => select(undefined)} regenerate={tasksApi.regenerate} runOne={tasksApi.runOne} />
      </Box>
      {/* Quick Actions (desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexBasis: 220 }}>
        <QuickActionsBar onNew={() => setShowNew(true)} onRunAll={runAll} onExport={() => alert('Export coming soon')} />
      </Box>

      {/* Mobile Task Detail Drawer */}
      {mobileDetailOpen && (
        <Box sx={{ display: { md: 'none' }, position: 'fixed', inset: 0, zIndex: 30, displayPrint: 'none' }}>
          <Box onClick={() => setMobileDetailOpen(false)} sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)' }} />
          <Sheet variant="solid" sx={{ position: 'relative', mt: 'auto', height: '70%', width: '100%', borderTopLeftRadius: 'lg', borderTopRightRadius: 'lg', border: '1px solid', borderColor: 'neutral.outlinedBorder', bgcolor: 'background.level1' }}>
            <TaskDetailPanel task={selected} onClose={() => setMobileDetailOpen(false)} regenerate={tasksApi.regenerate} runOne={tasksApi.runOne} />
          </Sheet>
        </Box>
      )}

      {/* Mobile Quick Actions Bar */}
      <Box sx={{ display: { md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20 }}>
        <QuickActionsBar onNew={() => setShowNew(true)} onRunAll={runAll} onExport={() => alert('Export coming soon')} />
      </Box>

      <NewTaskDialog open={showNew} onClose={() => setShowNew(false)} create={tasksApi.create} />
    </Box>
  );
}