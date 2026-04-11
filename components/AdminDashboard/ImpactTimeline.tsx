'use client';

import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import { Card } from '@/components/base';
import { ImpactTimelineProps } from './Types';
import { formatDateLabel } from './Utils';

const EVENT_TYPE_LABEL: Record<string, string> = {
    placement: 'Encaminhamento',
    course_launch: 'Novo curso',
    partnership: 'Parceria',
};

const EVENT_TYPE_ICON = {
    placement: <WorkOutlineRoundedIcon />,
    course_launch: <SchoolRoundedIcon />,
    partnership: <HandshakeRoundedIcon />,
};

export function ImpactTimeline({ data }: ImpactTimelineProps) {
    return (
        <Card>
            <section className='dashboard-panel'>
                <header className='dashboard-panel__header'>
                    <div>
                        <h3>Eventos Recentes</h3>
                        <p>Últimos acontecimentos importantes da operação.</p>
                    </div>
                </header>

                <div className='dashboard-timeline'>
                    {data.map((item) => (
                        <article
                            key={`${item.date}-${item.type}-${item.description}`}
                            className='dashboard-timeline__item'
                        >
                            <div className='dashboard-timeline__icon'>
                                {EVENT_TYPE_ICON[item.type]}
                            </div>

                            <div className='dashboard-timeline__content'>
                                <div className='dashboard-timeline__meta'>
                                    <span>{EVENT_TYPE_LABEL[item.type]}</span>
                                    <strong>
                                        {formatDateLabel(item.date)}
                                    </strong>
                                </div>
                                <p>{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </Card>
    );
}
