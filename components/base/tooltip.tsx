"use client"

import { Tooltip } from '@mui/material';

export function CustomTooltip({ title, children }: { title: string; children: React.ReactElement }) {
    return (
        <Tooltip title={title} arrow children={children} />
    );
}