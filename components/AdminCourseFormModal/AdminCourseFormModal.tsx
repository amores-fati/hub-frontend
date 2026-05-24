'use client';

import { Input, Select } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import {
    AdminCourseDto,
    AdminCourseModality,
    AdminCourseShift,
    CreateAdminCourseDto,
} from '@/dtos/AdminCourseDto';
import { createAdminCourseMock } from '@/services/api/admin/courses/mock';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useRef, useState } from 'react';
import './index.scss';

const MODALITY_OPTIONS: Option[] = [
    { value: AdminCourseModality.PRESENTIAL, label: 'Presencial' },
    { value: AdminCourseModality.ONLINE, label: 'Online' },
];

const SHIFT_OPTIONS: Option[] = [
    { value: AdminCourseShift.MORNING, label: 'Matutino' },
    { value: AdminCourseShift.AFTERNOON, label: 'Vespertino' },
    { value: AdminCourseShift.EVENING, label: 'Noturno' },
];

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: (course: AdminCourseDto) => void;
};

export function AdminCourseFormModal({ open, onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [vacancyCount, setVacancyCount] = useState('');
    const [modality, setModality] = useState<Option | null>(null);
    const [shift, setShift] = useState<Option | null>(null);
    const [workloadHours, setWorkloadHours] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [enrollmentStart, setEnrollmentStart] = useState('');
    const [enrollmentEnd, setEnrollmentEnd] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isValidDate = (val: string): boolean => {
        if (!val) return true;
        const [year, month, day] = val.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day
        );
    };

    const nameError = submitAttempted && !name.trim();
    const descriptionError = submitAttempted && !description.trim();
    const modalityError = submitAttempted && !modality;
    const shiftError = submitAttempted && !shift;

    const handleClose = () => {
        setName('');
        setDescription('');
        setAddress('');
        setVacancyCount('');
        setModality(null);
        setShift(null);
        setWorkloadHours('');
        setStartDate('');
        setEndDate('');
        setEnrollmentStart('');
        setEnrollmentEnd('');
        setImagePreview(null);
        setIsDragging(false);
        setIsLoading(false);
        setSubmitAttempted(false);
        onClose();
    };

    const handleImageFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(url);
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        if (!name.trim() || !description.trim() || !modality || !shift) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const payload: CreateAdminCourseDto = {
            name: name.trim(),
            description: description.trim(),
            imageUrl: null,
            address: address.trim() || null,
            vacancyCount: vacancyCount ? Number(vacancyCount) : null,
            modality: modality.value as AdminCourseModality,
            shift: shift.value as AdminCourseShift,
            workloadHours: workloadHours ? Number(workloadHours) : null,
            startDate: startDate || null,
            endDate: endDate || null,
            enrollmentStart: enrollmentStart || null,
            enrollmentEnd: enrollmentEnd || null,
        };

        const created = createAdminCourseMock(payload);
        setIsLoading(false);
        handleClose();
        onSuccess(created);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm' PaperProps={{ sx: { maxWidth: 729, borderRadius: '24px' } }}>
            <DialogTitle className='admin-course-form-modal__title'>
                Cadastrar Novo Curso
            </DialogTitle>

            <DialogContent dividers className='admin-course-form-modal__content'>
                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Nome do curso <span className='admin-course-form-modal__required'>*</span>
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Ex: Programação Web Full Stack'
                        error={nameError}
                    />
                    {nameError && (
                        <span className='admin-course-form-modal__error'>Campo obrigatório</span>
                    )}
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Descrição Breve <span className='admin-course-form-modal__required'>*</span>
                    </label>
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        variant='outlined'
                        className='admin-course-form-modal__textarea'
                        placeholder='Uma breve introdução sobre o que os alunos aprenderão...'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={descriptionError}
                    />
                    {descriptionError && (
                        <span className='admin-course-form-modal__error'>Campo obrigatório</span>
                    )}
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>Imagem do Curso</label>
                    <div
                        className={`admin-course-form-modal__dropzone${isDragging ? ' admin-course-form-modal__dropzone--dragging' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files[0];
                            if (file) handleImageFile(file);
                        }}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt='Preview'
                                className='admin-course-form-modal__dropzone-preview'
                            />
                        ) : (
                            <>
                                <AddPhotoAlternateOutlinedIcon className='admin-course-form-modal__dropzone-icon' />
                                <span>Arraste uma imagem para adicionar</span>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                        }}
                    />
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>Endereço</label>
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Ex: Instituto Caldeira, Tv. São José, 455 - Navegantes, Porto Alegre - RS, 90240-200'
                    />
                </div>

                <div className='admin-course-form-modal__grid-4'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Vagas</label>
                        <Input
                            value={vacancyCount}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setVacancyCount(val);
                            }}
                            placeholder='Ex: 200'
                        />
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Modalidade <span className='admin-course-form-modal__required'>*</span>
                        </label>
                        <div className='admin-course-form-modal__select-overrides'>
                            <Select
                                placeholder='Selecionar'
                                options={MODALITY_OPTIONS}
                                value={modality ?? undefined}
                                onChange={(option) => setModality(option)}
                            />
                        </div>
                        {modalityError && (
                            <span className='admin-course-form-modal__error'>Campo obrigatório</span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Turno <span className='admin-course-form-modal__required'>*</span>
                        </label>
                        <div className='admin-course-form-modal__select-overrides'>
                            <Select
                                placeholder='Selecionar'
                                options={SHIFT_OPTIONS}
                                value={shift ?? undefined}
                                onChange={(option) => setShift(option)}
                            />
                        </div>
                        {shiftError && (
                            <span className='admin-course-form-modal__error'>Campo obrigatório</span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Carga Horária</label>
                        <Input
                            value={workloadHours}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setWorkloadHours(val);
                            }}
                            placeholder='Ex: 40 horas'
                        />
                    </div>
                </div>

                <div className='admin-course-form-modal__grid-2'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Data Início - Curso</label>
                        <input
                            type='date'
                            className='admin-course-form-modal__date-input'
                            value={startDate}
                            min='2000-01-01'
                            max='2100-12-31'
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isValidDate(val)) setStartDate(val);
                            }}
                        />
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Data Final - Curso</label>
                        <input
                            type='date'
                            className='admin-course-form-modal__date-input'
                            value={endDate}
                            min='2000-01-01'
                            max='2100-12-31'
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isValidDate(val)) setEndDate(val);
                            }}
                        />
                    </div>
                </div>

                <div className='admin-course-form-modal__grid-2'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Data Início - Inscrições</label>
                        <input
                            type='date'
                            className='admin-course-form-modal__date-input'
                            value={enrollmentStart}
                            min='2000-01-01'
                            max='2100-12-31'
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isValidDate(val)) setEnrollmentStart(val);
                            }}
                        />
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>Data Final - Inscrições</label>
                        <input
                            type='date'
                            className='admin-course-form-modal__date-input'
                            value={enrollmentEnd}
                            min='2000-01-01'
                            max='2100-12-31'
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isValidDate(val)) setEnrollmentEnd(val);
                            }}
                        />
                    </div>
                </div>
            </DialogContent>

            <div className='admin-course-form-modal__footer'>
                <button
                    type='button'
                    className='admin-course-form-modal__btn-cancel'
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type='button'
                    className='admin-course-form-modal__btn-submit'
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </button>
            </div>
        </Dialog>
    );
}
