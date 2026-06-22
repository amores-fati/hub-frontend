'use client';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from '@mui/material';
import {
    PictureAsPdfRounded as PdfIcon,
    TableChartRounded as XlsxIcon,
    CloseRounded as CloseIcon,
} from '@mui/icons-material';
import { ReportFormat } from '@/services/api/admin/reports';
import './ExportFormatModal.scss';

type Props = {
    formats?: ReportFormat[];
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onExport: (format: ReportFormat) => void | Promise<void>;
};

export function ExportFormatModal({
    formats = ['pdf', 'xlsx'],
    open,
    loading = false,
    onClose,
    onExport,
}: Props) {
    const showPdf = formats.includes('pdf');
    const showXlsx = formats.includes('xlsx');
    const optionsClassName =
        formats.length === 1
            ? 'efm__options efm__options--single'
            : 'efm__options';

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
            <DialogTitle className='efm__title'>
                Exportar relatorio
                <button
                    type='button'
                    className='efm__close'
                    onClick={onClose}
                    disabled={loading}
                >
                    <CloseIcon fontSize='small' />
                </button>
            </DialogTitle>

            <DialogContent className='efm__content'>
                <p className='efm__subtitle'>
                    Escolha o formato de exportacao:
                </p>
                <div className={optionsClassName}>
                    {showPdf && (
                        <button
                            type='button'
                            className='efm__option'
                            onClick={() => {
                                void onExport('pdf');
                            }}
                            disabled={loading}
                        >
                            <PdfIcon className='efm__option-icon efm__option-icon--pdf' />
                            <span className='efm__option-label'>PDF</span>
                            <span className='efm__option-desc'>
                                Formatado para impressao
                            </span>
                        </button>
                    )}
                    {showXlsx && (
                        <button
                            type='button'
                            className='efm__option'
                            onClick={() => {
                                void onExport('xlsx');
                            }}
                            disabled={loading}
                        >
                            <XlsxIcon className='efm__option-icon efm__option-icon--xlsx' />
                            <span className='efm__option-label'>XLSX</span>
                            <span className='efm__option-desc'>
                                Planilha para Excel e Sheets
                            </span>
                        </button>
                    )}
                </div>
            </DialogContent>

            {loading && (
                <DialogActions className='efm__loading'>
                    <CircularProgress size={20} sx={{ color: '#673ab7' }} />
                    <span>Gerando relatorio...</span>
                </DialogActions>
            )}
        </Dialog>
    );
}
