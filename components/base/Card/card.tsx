import MuiCard from '@mui/material/Card';
import './index.scss';

export type CardProps = {
    children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
    return <MuiCard className='custom-card w-full'>{children}</MuiCard>;
}
