"use client";
import * as React from 'react';
import type { Task } from '../../lib/tasks';
import { Box, Typography, Button, Sheet, Stack, Divider, Chip } from '@mui/joy';

interface Props {
  task?: Task;
  onClose: () => void;
  regenerate: (id: string) => void;
  runOne: (id: string) => void;
}

export function TaskDetailPanel({ task, onClose, regenerate, runOne }: Props) {
  if (!task) return (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', color: 'neutral.500', fontSize: 13 }}>Select a task</Box>
  );
  const summary = task.lastSummary;
  const isZh = task.language === 'zh-HK';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" px={2} py={1.5} sx={{ borderBottom: '1px solid', borderColor: 'neutral.outlinedBorder' }}>
        <Box>
          <Typography level="title-sm">{task.title}</Typography>
          <Typography level="body-xs" color="neutral">{task.status === 'done-today' ? (isZh ? '今日已生成' : 'Generated today') : task.status}</Typography>
        </Box>
        <Button onClick={onClose} size="sm" variant="plain" color="neutral" sx={{ display: { md: 'none' } }}>Close</Button>
      </Stack>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography level="body-xs" fontWeight={600}>{isZh ? '今日摘要' : `Today's Summary`} ({task.timezone})</Typography>
            <Stack direction="row" spacing={0.5}>
              <Button onClick={() => navigator.clipboard.writeText(formatSummary(task))} size="sm" variant="soft">Copy</Button>
              <Button onClick={() => alert('Share: Coming soon')} size="sm" variant="soft">Share</Button>
              <Button onClick={() => alert('PDF: Coming soon')} size="sm" variant="soft">PDF</Button>
              <Button onClick={() => alert('PPT: Coming soon')} size="sm" variant="soft">PPT</Button>
            </Stack>
          </Stack>
          {summary ? (
            <Stack spacing={3} sx={{ fontSize: 13, lineHeight: 1.55 }}>
              <Box>
                <Typography level="body-sm" fontWeight={500} mb={0.5}>{isZh ? '五大標題' : 'Top 5 Headlines'}</Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0, listStyle: 'disc', display: 'grid', gap: 0.5 }}>
                  {summary.headlines.map(h => <li key={h}>{h}</li>)}
                </Box>
              </Box>
              <Box>
                <Typography level="body-sm" fontWeight={500} mb={0.5}>{isZh ? '三大要點' : '3 Key Takeaways'}</Typography>
                <Box component="ol" sx={{ pl: 2.5, m: 0, listStyle: 'decimal', display: 'grid', gap: 0.5 }}>
                  {summary.takeaways.map(t => <li key={t}>{t}</li>)}
                </Box>
              </Box>
              <Typography level="body-xs" color="neutral">{task.lastRunAt && (isZh ? '生成時間' : 'Generated at')} {task.lastRunAt && new Date(task.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {task.timezone}</Typography>
            </Stack>
          ) : (
            <Typography level="body-xs" color="neutral">{isZh ? '尚未生成摘要。' : 'No summary yet.'}</Typography>
          )}
        </Sheet>
        <Stack direction="row" spacing={1}>
          <Button onClick={() => regenerate(task.id)} size="sm" variant="solid" color="primary">{isZh ? '重新生成' : 'Regenerate'}</Button>
          {task.status === 'error' && (
            <Button onClick={() => runOne(task.id)} size="sm" variant="solid" color="danger">{isZh ? '重試' : 'Retry'}</Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

function formatSummary(task: Task) {
  if (!task.lastSummary) return '';
  return `${task.title}\n${task.lastSummary.headlines.map(h=>`- ${h}`).join('\n')}\n${task.lastSummary.takeaways.map((t,i)=>`${i+1}. ${t}`).join('\n')}`;
}

export default TaskDetailPanel;
