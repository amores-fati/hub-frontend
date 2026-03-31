import { Tooltip } from '@mui/material';
import './index.scss';

export function CustomTooltip({
    title,
    children,
}: {
    title: string;
    children: React.ReactElement;
}) {
    return <Tooltip title={title} arrow children={children} />;
}
