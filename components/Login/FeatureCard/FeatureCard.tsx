import { Card } from '@/components/base';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './index.scss';

export type FeatureCardProps = {
    title: string;
    subtitle: string;
    color: string;
    badgeText?: string;
    badgeDarkText?: boolean;
};

export default function FeatureCard({
    title,
    subtitle,
    color,
    badgeText,
    badgeDarkText = false,
}: FeatureCardProps) {
    return (
        <div
            className='feature-card-wrapper'
            style={{ position: 'relative', height: '100%' }}
        >
            <Card>
                <div
                    className='feature-card__top-bar'
                    style={{ backgroundColor: color }}
                />
                <div className='feature-card__content'>
                    <InfoOutlinedIcon
                        style={{
                            color,
                            fontSize: '2.5rem',
                            marginBottom: '1rem',
                        }}
                    />
                    <h2 className='feature-card__title'>{title}</h2>
                    <p className='feature-card__subtitle'>{subtitle}</p>
                    {badgeText && (
                        <span
                            className='feature-card__badge'
                            style={{
                                backgroundColor: color,
                                color: badgeDarkText
                                    ? 'var(--preto-1)'
                                    : 'var(--branco)',
                            }}
                        >
                            {badgeText}
                        </span>
                    )}
                </div>
            </Card>
        </div>
    );
}
