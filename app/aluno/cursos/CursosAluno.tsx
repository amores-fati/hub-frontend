'use client';
import { CourseAction, CourseCard } from '@/components/CourseCard';
import { CourseModal } from '@/components/CourseModal';
import { Loading } from '@/components/base';
import { CourseDto } from '@/dtos/CourseDto';
import { UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import {
    useEnrollInCourse,
    useRegisterInterest,
    useUnenrollFromCourse,
    useRemoveInterest,
} from '@/services/api/courses/mutations';
import {
    useGetCourses,
    useGetMyEnrollments,
} from '@/services/api/courses/queries';
import { useGetPublicSetting } from '@/services/api/settings/queries';
import { useGetStudentProfile } from '@/services/api/students/queries';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

type ModalState = { course: CourseDto; action: CourseAction } | null;

export default function CursosAluno() {
    const { user } = useAuth();
    const router = useRouter();
    const isStudent = user?.role === UserRole.STUDENT;

    const { data: courses, isLoading: coursesLoading } = useGetCourses();
    const { data: enrollments, isLoading: enrollmentsLoading } =
        useGetMyEnrollments(isStudent);
    const { data: whatsappSetting } = useGetPublicSetting('whatsapp_phone');
    const { data: studentProfile } = useGetStudentProfile();

    const interest = useRegisterInterest();
    const removeInterest = useRemoveInterest();
    const enroll = useEnrollInCourse();
    const unenroll = useUnenrollFromCourse();
    const isMutating =
        interest.isPending ||
        enroll.isPending ||
        removeInterest.isPending ||
        unenroll.isPending;

    const [modal, setModal] = useState<ModalState>(null);
    const [enrollConfirm, setEnrollConfirm] = useState<CourseDto | null>(null);

    const isLoading = coursesLoading || (isStudent && enrollmentsLoading);

    const enrollmentMap = new Map(
        (enrollments ?? []).map((e) => [e.courseId, e.status]),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrolledCourses = (courses ?? []).filter(
        (c) => enrollmentMap.get(c.id) === 'enrolled',
    );
    const interestedCourses = (courses ?? []).filter(
        (c) => enrollmentMap.get(c.id) === 'interested',
    );
    const notEnrolled = (courses ?? []).filter((c) => !enrollmentMap.has(c.id));
    const availableCourses = notEnrolled.filter(
        (c) => new Date(c.enrollmentStart) <= today,
    );
    const upcomingCourses = notEnrolled.filter(
        (c) => new Date(c.enrollmentStart) > today,
    );

    const whatsappDigits = whatsappSetting?.value?.replace(/\D/g, '');
    const whatsappUrl = whatsappDigits
        ? `https://wa.me/${whatsappDigits}`
        : null;

    const displayName =
        studentProfile?.fullName?.trim() ||
        studentProfile?.socialName?.trim() ||
        user?.email?.split('@')[0] ||
        'aluno';

    function openModal(course: CourseDto, action: CourseAction) {
        setModal({ course, action });
    }

    function handleAskEnroll(course: CourseDto) {
        if (course.modality === 'online') {
            if (!course.externalLink) {
                toast.error(
                    'Link de inscrição do parceiro indisponível para este curso.',
                );
                return;
            }
            setModal(null);
            setEnrollConfirm(course);
        } else {
            enroll.mutate(course.id, {
                onSuccess: () => setModal(null),
            });
        }
    }

    function handleConfirmEnroll() {
        if (enrollConfirm?.externalLink) {
            window.open(
                enrollConfirm.externalLink,
                '_blank',
                'noopener,noreferrer',
            );
        }
        setEnrollConfirm(null);
    }

    function handleInterest(course: CourseDto) {
        interest.mutate(course.id, {
            onSuccess: () => setModal(null),
        });
    }

    function handleUnenroll(course: CourseDto) {
        unenroll.mutate(course.id, {
            onSuccess: () => setModal(null),
        });
    }

    function handleRemoveInterest(course: CourseDto) {
        removeInterest.mutate(course.id, {
            onSuccess: () => setModal(null),
        });
    }

    if (isLoading) {
        return (
            <section className='cursos-aluno cursos-aluno--centered'>
                <Loading className='cursos-aluno__loading' />
            </section>
        );
    }

    return (
        <>
            <section className='cursos-aluno'>
                {/* Banner */}
                <div className='ca-banner'>
                    <div className='ca-banner__text'>
                        <h1>
                            Olá,{' '}
                            <span className='ca-banner__name'>
                                {displayName}!
                            </span>{' '}
                            👋
                        </h1>
                        <p>
                            Bem-vindo à sua plataforma de aprendizado. Continue
                            sua jornada de formação e construa seu futuro
                            profissional.
                        </p>
                    </div>
                    <div className='ca-banner__actions'>
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='ca-banner__btn ca-banner__btn--green'
                            >
                                <WhatsAppIcon sx={{ fontSize: 16 }} />
                                Dúvidas
                            </a>
                        )}
                        <button
                            type='button'
                            className='ca-banner__btn ca-banner__btn--yellow'
                            onClick={() => router.push('/aluno/curriculo')}
                        >
                            <AssignmentIndIcon sx={{ fontSize: 16 }} />
                            Meu Currículo
                        </button>
                        <button
                            type='button'
                            className='ca-banner__btn ca-banner__btn--cyan'
                            onClick={() => router.push('/aluno/perfil')}
                        >
                            <PersonIcon sx={{ fontSize: 16 }} />
                            Meu Perfil
                        </button>
                    </div>
                </div>

                {/* Cursos Inscritos */}
                {enrolledCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>
                            🌟 Cursos Inscritos
                        </h2>
                        <div className='ca-grid'>
                            {enrolledCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='inscrito'
                                    disabled={isMutating}
                                    onSaibaMais={() =>
                                        openModal(course, 'inscrito')
                                    }
                                    onAction={() => handleUnenroll(course)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Interesse Manifestado */}
                {interestedCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>
                            💛 Interesse Manifestado
                        </h2>
                        <div className='ca-grid'>
                            {interestedCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='interessado'
                                    disabled={isMutating}
                                    onSaibaMais={() =>
                                        openModal(course, 'interessado')
                                    }
                                    onAction={() =>
                                        handleRemoveInterest(course)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Cursos Disponíveis */}
                {availableCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>
                            Cursos Disponíveis
                        </h2>
                        <div className='ca-grid'>
                            {availableCourses.map((course) => {
                                const actionType =
                                    course.modality === 'online'
                                        ? 'interesse'
                                        : 'inscrever';
                                return (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        action={actionType}
                                        disabled={isMutating}
                                        onSaibaMais={() =>
                                            openModal(course, actionType)
                                        }
                                        onAction={
                                            actionType === 'interesse'
                                                ? () => handleInterest(course)
                                                : () => handleAskEnroll(course)
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Em breve */}
                {upcomingCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>
                            Em breve — não perca a chance!
                        </h2>
                        <div className='ca-grid'>
                            {upcomingCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='interesse'
                                    disabled={isMutating}
                                    onSaibaMais={() =>
                                        openModal(course, 'interesse')
                                    }
                                    onAction={() => handleInterest(course)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sem nenhum curso */}
                {enrolledCourses.length === 0 &&
                    interestedCourses.length === 0 &&
                    availableCourses.length === 0 &&
                    upcomingCourses.length === 0 && (
                        <div className='ca-section'>
                            <div className='ca-empty'>
                                <p>Nenhum curso disponível no momento.</p>
                                <small>
                                    Novos cursos serão divulgados em breve.
                                    Volte mais tarde.
                                </small>
                            </div>
                        </div>
                    )}

                {/* WhatsApp FAB */}
                {whatsappUrl && (
                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ca-whatsapp-fab'
                        aria-label='Suporte via WhatsApp'
                    >
                        <WhatsAppIcon />
                        <span>Suporte via WhatsApp</span>
                    </a>
                )}
            </section>

            {modal && (
                <CourseModal
                    course={modal.course}
                    action={modal.action}
                    disabled={isMutating}
                    onClose={() => setModal(null)}
                    onAction={
                        modal.action === 'inscrever'
                            ? () => handleAskEnroll(modal.course)
                            : modal.action === 'interesse'
                              ? () => handleInterest(modal.course)
                              : modal.action === 'inscrito'
                                ? () => handleUnenroll(modal.course)
                                : modal.action === 'interessado'
                                  ? () => handleRemoveInterest(modal.course)
                                  : undefined
                    }
                />
            )}

            {enrollConfirm && (
                <div
                    className='enroll-confirm__overlay'
                    onClick={() => setEnrollConfirm(null)}
                >
                    <div
                        className='enroll-confirm'
                        onClick={(e) => e.stopPropagation()}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='enroll-confirm-title'
                    >
                        <h3
                            id='enroll-confirm-title'
                            className='enroll-confirm__title'
                        >
                            Inscrição no site do parceiro
                        </h3>
                        <p className='enroll-confirm__body'>
                            A inscrição em{' '}
                            <strong>{enrollConfirm.title}</strong> é feita por
                            meio de um formulário no site do nosso parceiro.
                            Você será redirecionado para a plataforma de
                            inscrição em uma nova aba.
                        </p>
                        <div className='enroll-confirm__actions'>
                            <button
                                type='button'
                                className='enroll-confirm__btn enroll-confirm__btn--outline'
                                onClick={() => setEnrollConfirm(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                type='button'
                                className='enroll-confirm__btn enroll-confirm__btn--primary'
                                onClick={handleConfirmEnroll}
                            >
                                Ir para inscrição
                                <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
