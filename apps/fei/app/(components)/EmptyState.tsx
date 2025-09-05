"use client";
import * as React from 'react';
import { Box, Typography, Button, Sheet, Avatar } from '@mui/joy';

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Sheet
      variant="outlined"
      sx={t => ({
        borderStyle: 'dashed',
        borderColor: t.palette.neutral.outlinedBorder,
        bgcolor: 'background.surface',
        p: 6,
        borderRadius: 'xl',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        alignItems: 'center',
        textAlign: 'center'
      })}
    >
      <Avatar size="lg" sx={{ '--Avatar-size': '64px', fontSize: 34, bgcolor: 'neutral.700' }}>📰</Avatar>
      <Box>
        <Typography level="title-sm">No tasks yet</Typography>
        <Typography level="body-xs" sx={{ mt: 0.5, maxWidth: 320, color: 'neutral.400' }}>
          Create your first news or market brief task to get started.
        </Typography>
      </Box>
      <Button onClick={onCreate} size="sm" color="primary" variant="solid">
        + Create your first task
      </Button>
    </Sheet>
  );
}

export default EmptyState;
