'use client';

import { Card } from '@/components/base';
import { StatCardItem } from './Types';

type StatCardProps = {
    item: StatCardItem;
};

export function StatCard({ item }: StatCardProps) {
    return (
        <Card>
            <article className={`admin-stat-card ${item.accentClassName}`}>
                <div className='admin-stat-card__header'>
                    <div className='admin-stat-card__icon'>{item.icon}</div>
                    <span className='admin-stat-card__helper'>{item.helperText}</span>
                </div>
                <span className='admin-stat-card__label'>{item.label}</span>
                <strong className='admin-stat-card__value'>
                    {item.value.toLocaleString('pt-BR')}
                </strong>
            </article>
        </Card>
    );
}
