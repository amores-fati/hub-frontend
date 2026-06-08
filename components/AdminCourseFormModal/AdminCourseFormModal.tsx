'use client';

import { Input, Select } from '@/components/base';
import { Option } from '@/components/base/Select/select';
import {
    AdminCourseDto,
    AdminCourseModality,
    AdminCourseShift,
    CreateAdminCourseDto,
} from '@/dtos/AdminCourseDto';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import './index.scss';
import {
    useCreateCourseMutation,
    useUpdateCourseMutation,
} from '../../services/api/courses/mutations';
import { dateRegex } from '../../utils/regex';
import { formatDate } from '../../utils/shared-functions/date';
import {
    readFileAsBase64,
    resolveImageUrl,
} from '../../utils/shared-functions/image';
import { toast } from 'react-toastify';

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
    course?: AdminCourseDto;
};

export function AdminCourseFormModal({ open, onClose, course }: Props) {
    const [name, setName] = useState(course ? course.title : '');
    const [description, setDescription] = useState(
        course ? course.description : '',
    );
    const [address, setAddress] = useState(course ? course.location : '');
    const [accessLink, setAccessLink] = useState(course ? course.externalLink : '')
    const [vacancyCount, setVacancyCount] = useState(
        course ? course.vacancyCount.toString() : '',
    );
    const [modality, setModality] = useState<Option | null>(
        course
            ? MODALITY_OPTIONS.find(
                  (opt) =>
                      `${opt.value}`.toLowerCase() ===
                      `${course.modality}`.toLowerCase(),
              ) || null
            : null,
    );
    const [shift, setShift] = useState<Option | null>(
        course
            ? SHIFT_OPTIONS.find(
                  (opt) =>
                      `${opt.value}`.toLowerCase() ===
                      `${course.shift}`.toLowerCase(),
              ) || null
            : null,
    );
    const [workloadHours, setWorkloadHours] = useState(
        course ? course.workloadHours : '',
    );
    const [startDate, setStartDate] = useState(course?.startDate ?? '');
    const [endDate, setEndDate] = useState(course?.endDate ?? '');
    const [enrollmentStart, setEnrollmentStart] = useState(
        course?.enrollmentStart ?? '',
    );
    const [enrollmentEnd, setEnrollmentEnd] = useState(
        course?.enrollmentEnd ?? '',
    );
    const [imagePreview, setImagePreview] = useState<string | null>(
        resolveImageUrl(course?.imageUrl ?? null),
    );
    const [bannerImageBase64, setBannerImageBase64] = useState<string | null>(
        null,
    );
    const [bannerImageMimeType, setBannerImageMimeType] = useState<
        string | null
    >(null);
    const [isDragging, setIsDragging] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: createCourse, isPending: isCreating } =
        useCreateCourseMutation();
    const { mutate: updateCourse, isPending: isUpdating } =
        useUpdateCourseMutation(course?.id ?? '');

    const nameError = submitAttempted && !name.trim();
    const descriptionError = submitAttempted && !description.trim();
    const modalityError = submitAttempted && !modality;
    const shiftError = submitAttempted && !shift;
    const bannerError = submitAttempted && !imagePreview;
    const vacancyCountError = submitAttempted && !vacancyCount;
    const workloadHoursError = submitAttempted && !workloadHours;
    const startDateError = submitAttempted && !startDate;
    const endDateError = submitAttempted && !endDate;
    const enrollmentStartError = submitAttempted && !enrollmentStart;
    const enrollmentEndError = submitAttempted && !enrollmentEnd;

    const handleClose = () => {
        setName('');
        setDescription('');
        setAddress('');
        setAccessLink('');
        setVacancyCount('');
        setModality(null);
        setShift(null);
        setWorkloadHours('');
        setStartDate('');
        setEndDate('');
        setEnrollmentStart('');
        setEnrollmentEnd('');
        if (imagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setBannerImageBase64(null);
        setBannerImageMimeType(null);
        setIsDragging(false);
        setSubmitAttempted(false);
        onClose();
    };

    const handleImageFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Selecione um arquivo de imagem (JPG, PNG ou WebP).');
            return;
        }
        try {
            const { data, mimeType } = await readFileAsBase64(file);
            setBannerImageBase64(data);
            setBannerImageMimeType(mimeType);
            const previewUrl = URL.createObjectURL(file);
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(previewUrl);
        } catch {
            toast.error('Não foi possível ler o arquivo da imagem.');
        }
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        if (
            !name.trim() ||
            !description.trim() ||
            !modality ||
            !shift ||
            !imagePreview ||
            !vacancyCount ||
            !workloadHours ||
            !startDate ||
            !endDate ||
            !enrollmentStart ||
            !enrollmentEnd
        )
            return;

        await new Promise((resolve) => setTimeout(resolve, 800));

        const payload: CreateAdminCourseDto = {
            name: name.trim(),
            description: description.trim(),
            banner: null,
            bannerImage: bannerImageBase64,
            bannerImageMimeType: bannerImageMimeType,
            address: address.trim() || null,
            linkAccess: accessLink || null,
            vacancyCount: vacancyCount ? Number(vacancyCount) : null,
            modality: modality.value as AdminCourseModality,
            shift: shift.value as AdminCourseShift,
            courseLoad: workloadHours ? `${workloadHours}` : null,
            startDate: startDate ? formatDate(startDate) + 'T00:00:00Z' : null,
            endDate: endDate ? formatDate(endDate) + 'T00:00:00Z' : null,
            startRegistrations: enrollmentStart
                ? formatDate(enrollmentStart) + 'T00:00:00Z'
                : null,
            endRegistrations: enrollmentEnd
                ? formatDate(enrollmentEnd) + 'T00:00:00Z'
                : null,
        };

        if (course?.id) {
            updateCourse({ form: payload });
        } else {
            createCourse(payload);
        }
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='sm'
            PaperProps={{ sx: { maxWidth: 729, borderRadius: '24px' } }}
        >
            <DialogTitle className='admin-course-form-modal__title'>
                {course?.id ? 'Editar Curso' : 'Cadastrar Novo Curso'}
            </DialogTitle>

            <DialogContent
                dividers
                className='admin-course-form-modal__content'
            >
                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Nome do curso{' '}
                        <span className='admin-course-form-modal__required'>
                            *
                        </span>
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Ex: Programação Web Full Stack'
                        error={nameError}
                    />
                    {nameError && (
                        <span className='admin-course-form-modal__error'>
                            Campo obrigatório
                        </span>
                    )}
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Descrição Breve{' '}
                        <span className='admin-course-form-modal__required'>
                            *
                        </span>
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
                        <span className='admin-course-form-modal__error'>
                            Campo obrigatório
                        </span>
                    )}
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Imagem do Curso{' '}
                        <span className='admin-course-form-modal__required'>
                            *
                        </span>
                    </label>
                    <div
                        className={`admin-course-form-modal__dropzone${isDragging ? ' admin-course-form-modal__dropzone--dragging' : ''}${bannerError ? ' admin-course-form-modal__dropzone--error' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files[0];
                            if (file) void handleImageFile(file);
                        }}
                    >
                        {imagePreview ? (
                            <Image
                                src={imagePreview}
                                alt='Preview'
                                className='admin-course-form-modal__dropzone-preview'
                                unoptimized
                                width={200}
                                height={200}
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
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleImageFile(file);
                        }}
                    />
                    {bannerError && (
                        <span className='admin-course-form-modal__error'>
                            Campo obrigatório
                        </span>
                    )}
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Endereço
                    </label>
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Ex: Instituto Caldeira, Tv. São José, 455 - Navegantes, Porto Alegre - RS, 90240-200'
                    />
                </div>

                <div className='admin-course-form-modal__field'>
                    <label className='admin-course-form-modal__label'>
                        Link de Acesso
                    </label>
                    <Input
                        value={accessLink}
                        onChange={(e) => setAccessLink(e.target.value)}
                        placeholder='Ex: https://www.amoresfati.org.br'
                    />
                </div>

                <div className='admin-course-form-modal__grid-4'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Vagas{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            value={vacancyCount}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setVacancyCount(val);
                            }}
                            placeholder='Ex: 200'
                            error={vacancyCountError}
                        />
                        {vacancyCountError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Modalidade{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
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
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Turno{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
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
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Carga Horária{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            value={workloadHours}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setWorkloadHours(val);
                            }}
                            placeholder='Ex: 40 horas'
                            error={workloadHoursError}
                        />
                        {workloadHoursError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>
                </div>

                <div className='admin-course-form-modal__grid-2'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Data Início - Curso{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            placeholder='dd/mm/aaaa'
                            onChange={(e) => {
                                setStartDate(
                                    dateRegex(e?.target?.value ?? null) ?? '',
                                );
                            }}
                            value={startDate}
                            error={startDateError}
                        />
                        {startDateError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Data Final - Curso{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            placeholder='dd/mm/aaaa'
                            onChange={(e) => {
                                setEndDate(
                                    dateRegex(e?.target?.value ?? null) ?? '',
                                );
                            }}
                            value={endDate}
                            error={endDateError}
                        />
                        {endDateError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>
                </div>

                <div className='admin-course-form-modal__grid-2'>
                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Data Início - Inscrições{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            placeholder='dd/mm/aaaa'
                            onChange={(e) => {
                                setEnrollmentStart(
                                    dateRegex(e?.target?.value ?? null) ?? '',
                                );
                            }}
                            value={enrollmentStart}
                            error={enrollmentStartError}
                        />
                        {enrollmentStartError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className='admin-course-form-modal__field'>
                        <label className='admin-course-form-modal__label'>
                            Data Final - Inscrições{' '}
                            <span className='admin-course-form-modal__required'>
                                *
                            </span>
                        </label>
                        <Input
                            placeholder='dd/mm/aaaa'
                            onChange={(e) => {
                                setEnrollmentEnd(
                                    dateRegex(e?.target?.value ?? null) ?? '',
                                );
                            }}
                            value={enrollmentEnd}
                            error={enrollmentEndError}
                        />
                        {enrollmentEndError && (
                            <span className='admin-course-form-modal__error'>
                                Campo obrigatório
                            </span>
                        )}
                    </div>
                </div>
            </DialogContent>

            <div className='admin-course-form-modal__footer'>
                <button
                    type='button'
                    className='admin-course-form-modal__btn-cancel'
                    onClick={handleClose}
                    disabled={isCreating || isUpdating}
                >
                    Cancelar
                </button>
                <button
                    type='button'
                    className='admin-course-form-modal__btn-submit'
                    onClick={() => {
                        void handleSubmit();
                    }}
                    disabled={isCreating || isUpdating}
                >
                    {isCreating || isUpdating
                        ? 'Cadastrando...'
                        : course?.id
                          ? 'Salvar Alterações'
                          : 'Cadastrar Curso'}
                </button>
            </div>
        </Dialog>
    );
}
