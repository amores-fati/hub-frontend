'use client';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import { CircularProgress } from '@mui/material';
import { ReactNode, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/base';
import {
    downloadCoursesReport,
    downloadResumesReport,
    downloadVacanciesReport,
} from '@/services/api/admin/reports';

import './index.scss';

type ReportTestKey = 'courses' | 'resumes' | 'vacancies';

type ReportTestItem = {
    key: ReportTestKey;
    title: string;
    endpoint: string;
    payload: string;
    icon: ReactNode;
    download: () => Promise<void>;
};

const reportTests: ReportTestItem[] = [
    {
        key: 'courses',
        title: 'Cursos',
        endpoint: 'POST /api/admin/reports/courses',
        payload: '{ "mode": "all" }',
        icon: <MenuBookIcon fontSize='small' />,
        download: () => downloadCoursesReport({ mode: 'all' }),
    },
    {
        key: 'vacancies',
        title: 'Vagas',
        endpoint: 'POST /api/admin/reports/vacancies',
        payload: '{ "mode": "all" }',
        icon: <WorkIcon fontSize='small' />,
        download: () => downloadVacanciesReport({ mode: 'all' }),
    },
    {
        key: 'resumes',
        title: 'Curriculos',
        endpoint: 'POST /api/admin/reports/resumes',
        payload: '{ "mode": "all" }',
        icon: <AssignmentIndIcon fontSize='small' />,
        download: () => downloadResumesReport({ mode: 'all' }),
    },
];

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Erro ao exportar relatorio.';

export default function AdminReportTestsPage() {
    const [pendingReport, setPendingReport] = useState<ReportTestKey | null>(
        null,
    );

    const handleDownload = async (item: ReportTestItem) => {
        setPendingReport(item.key);

        try {
            await item.download();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setPendingReport(null);
        }
    };

    return (
        <section className='admin-report-tests'>
            <header className='admin-report-tests__header'>
                <span>Teste temporario</span>
                <h1>Downloads de relatorios administrativos</h1>
                <p>
                    Estes botoes existem apenas para validar os endpoints que
                    ainda nao possuem pagina propria no front.
                </p>
            </header>

            <div className='admin-report-tests__grid'>
                {reportTests.map((item) => {
                    const isPending = pendingReport === item.key;

                    return (
                        <article
                            className='admin-report-tests__card'
                            key={item.key}
                        >
                            <Button
                                disabled={Boolean(pendingReport)}
                                onClick={() => {
                                    void handleDownload(item);
                                }}
                            >
                                {isPending ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    item.icon
                                )}
                                <span>Baixar relatorio de {item.title}</span>
                            </Button>

                            <div className='admin-report-tests__endpoint'>
                                <span>Endpoint consumido</span>
                                <code>{item.endpoint}</code>
                            </div>

                            <div className='admin-report-tests__endpoint'>
                                <span>Payload usado no teste</span>
                                <code>{item.payload}</code>
                            </div>
                        </article>
                    );
                })}
            </div>

            <p className='admin-report-tests__note'>
                Alunos ja deve ser testado na pagina /admin/alunos pelo endpoint{' '}
                <code>POST /api/admin/reports/students</code>.
            </p>
        </section>
    );
}
