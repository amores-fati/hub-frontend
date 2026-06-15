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
    TableChartRounded as CsvIcon,
    CloseRounded as CloseIcon,
} from '@mui/icons-material';
import { ReportFormat } from '@/services/api/admin/reports';
import './ExportFormatModal.scss';

type Props = {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onExport: (format: ReportFormat) => void;
};

export function ExportFormatModal({
    open,
    loading = false,
    onClose,
    onExport,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
            <DialogTitle className='efm__title'>
                Exportar relatório
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
                    Escolha o formato de exportação:
                </p>
                <div className='efm__options'>
                    <button
                        type='button'
                        className='efm__option'
                        onClick={() => onExport('pdf')}
                        disabled={loading}
                    >
                        <PdfIcon className='efm__option-icon efm__option-icon--pdf' />
                        <span className='efm__option-label'>PDF</span>
                        <span className='efm__option-desc'>
                            Formatado para impressão
                        </span>
                    </button>
                    <button
                        type='button'
                        className='efm__option'
                        onClick={() => onExport('csv')}
                        disabled={loading}
                    >
                        <CsvIcon className='efm__option-icon efm__option-icon--csv' />
                        <span className='efm__option-label'>CSV / Excel</span>
                        <span className='efm__option-desc'>
                            Compatível com Excel e Sheets
                        </span>
                    </button>
                </div>
            </DialogContent>

            {loading && (
                <DialogActions className='efm__loading'>
                    <CircularProgress size={20} sx={{ color: '#673ab7' }} />
                    <span>Gerando relatório...</span>
                </DialogActions>
            )}
        </Dialog>
    );
}
