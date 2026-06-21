import { isAxiosError } from 'axios';

import { createHttpClient } from '@/services/http-client';

import { coreApi } from '../..';

export type AdminReportMode = 'selected' | 'all';

export type StudentReportStatus = 'ENROLLMENT' | 'INTEREST' | 'NAO_INSCRITO';

export type CourseReportStatus = 'ATIVO' | 'INATIVO';
export type ResumeReportStatus = 'ATIVO' | 'INATIVO';
export type CompanyReportStatus = 'ATIVO' | 'INATIVO';

export type ExportCoursesReportPayload = {
    mode: AdminReportMode;
    ids?: string[];
    filters?: {
        search?: string;
        modality?: string;
        status?: CourseReportStatus;
        startDate?: string;
        endDate?: string;
    };
};

export type ExportStudentsReportPayload = {
    mode: AdminReportMode;
    ids?: string[];
    filters?: {
        search?: string;
        course?: string;
        location?: string;
        pcdType?: string;
        status?: StudentReportStatus;
    };
};

export type ExportVacanciesReportPayload = {
    mode: AdminReportMode;
    ids?: string[];
    filters?: {
        search?: string;
        isPcd?: boolean;
        dateFrom?: string;
        dateTo?: string;
    };
};

export type ExportResumesReportPayload = {
    mode: AdminReportMode;
    ids?: string[];
    filters?: {
        search?: string;
        interestArea?: string;
        preference?: string;
        status?: ResumeReportStatus;
    };
};

export type ExportCompaniesReportPayload = {
    mode: AdminReportMode;
    ids?: string[];
    filters?: {
        search?: string;
        status?: CompanyReportStatus;
        city?: string[];
    };
};

type AdminReportEndpoint =
    | 'companies'
    | 'courses'
    | 'resumes'
    | 'students'
    | 'vacancies';

type AdminReportPayloadByEndpoint = {
    companies: ExportCompaniesReportPayload;
    courses: ExportCoursesReportPayload;
    resumes: ExportResumesReportPayload;
    students: ExportStudentsReportPayload;
    vacancies: ExportVacanciesReportPayload;
};

type ReportErrorPayload = {
    message?: string | string[];
};

const fallbackFilenamePrefixes: Record<AdminReportEndpoint, string> = {
    companies: 'relatorio_empresas',
    courses: 'relatorio_cursos',
    resumes: 'relatorio_curriculos',
    students: 'relatorio_alunos',
    vacancies: 'relatorio_vagas',
};

export const adminReportsApi = createHttpClient('/admin/reports', coreApi);

const getFilenameFromContentDisposition = (
    header: string | null | undefined,
) => {
    if (!header) return null;

    const encodedMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
    if (encodedMatch?.[1]) {
        return decodeURIComponent(encodedMatch[1]);
    }

    const match = /filename="?([^";]+)"?/i.exec(header);
    return match?.[1] ?? null;
};

const padDatePart = (value: number) => String(value).padStart(2, '0');

const getReportTimestamp = () => {
    const now = new Date();
    const date = [
        now.getFullYear(),
        padDatePart(now.getMonth() + 1),
        padDatePart(now.getDate()),
    ].join('-');
    const time = [
        padDatePart(now.getHours()),
        padDatePart(now.getMinutes()),
        padDatePart(now.getSeconds()),
    ].join('');

    return `${date}_${time}`;
};

export type ReportFormat = 'pdf' | 'xlsx';

const formatMimeType: Record<ReportFormat, string> = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const getFallbackFilename = (
    endpoint: AdminReportEndpoint,
    format: ReportFormat = 'pdf',
) => `${fallbackFilenamePrefixes[endpoint]}_${getReportTimestamp()}.${format}`;

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
};

const formatErrorMessage = (message: string | string[] | undefined) => {
    if (Array.isArray(message)) {
        return message.join('\n');
    }

    return message;
};

const parseReportErrorBlob = async (blob: Blob) => {
    const text = await blob.text();
    if (!text) return undefined;

    try {
        return JSON.parse(text) as ReportErrorPayload;
    } catch {
        return undefined;
    }
};

const getReportErrorMessage = async (error: unknown) => {
    if (!isAxiosError(error)) {
        return undefined;
    }

    const data = error.response?.data;

    if (data instanceof Blob) {
        const parsed = await parseReportErrorBlob(data);
        return formatErrorMessage(parsed?.message);
    }

    if (data && typeof data === 'object') {
        return formatErrorMessage((data as ReportErrorPayload).message);
    }

    return undefined;
};

export async function downloadAdminReport<
    TEndpoint extends AdminReportEndpoint,
>(
    endpoint: TEndpoint,
    payload: AdminReportPayloadByEndpoint[TEndpoint],
    format: ReportFormat = 'pdf',
) {
    try {
        const response = await adminReportsApi.post<Blob>(
            `/${endpoint}`,
            { ...payload, format },
            {
                headers: {
                    Accept: formatMimeType[format],
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            },
        );

        const contentDisposition = response.headers['content-disposition'];
        const filename =
            getFilenameFromContentDisposition(
                typeof contentDisposition === 'string'
                    ? contentDisposition
                    : null,
            ) ?? getFallbackFilename(endpoint, format);

        downloadBlob(response.data, filename);
    } catch (error) {
        const message = await getReportErrorMessage(error);
        throw new Error(message ?? 'Erro ao exportar relatorio.');
    }
}

export const downloadCoursesReport = (
    payload: ExportCoursesReportPayload,
    format: ReportFormat = 'pdf',
) => downloadAdminReport('courses', payload, format);

export const downloadCompaniesReport = (
    payload: ExportCompaniesReportPayload,
    format: ReportFormat = 'xlsx',
) => downloadAdminReport('companies', payload, format);

export const downloadStudentsReport = (
    payload: ExportStudentsReportPayload,
    format: ReportFormat = 'pdf',
) => downloadAdminReport('students', payload, format);

export const downloadVacanciesReport = (
    payload: ExportVacanciesReportPayload,
    format: ReportFormat = 'pdf',
) => downloadAdminReport('vacancies', payload, format);

export const downloadResumesReport = (
    payload: ExportResumesReportPayload,
    format: ReportFormat = 'pdf',
) => downloadAdminReport('resumes', payload, format);
