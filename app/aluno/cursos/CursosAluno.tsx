'use client';
import { CourseAction, CourseCard } from '@/components/CourseCard';
import { CourseModal } from '@/components/CourseModal';
import { Loading } from '@/components/base';
import { CourseDto } from '@/dtos/CourseDto';
import { UserRole } from '@/dtos/UserDto';
import { useAuth } from '@/providers/Auth/AuthProvider';
import { useGetCourses, useGetMyEnrollments } from '@/services/api/courses/queries';
import { useGetPublicSetting } from '@/services/api/settings/queries';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useState } from 'react';
import './index.scss';

type ModalState = { course: CourseDto; action: CourseAction } | null;

export default function CursosAluno() {
    const { user } = useAuth();
    const isStudent = user?.role === UserRole.STUDENT;

    const { data: courses, isLoading: coursesLoading } = useGetCourses();
    const { data: enrollments, isLoading: enrollmentsLoading } =
        useGetMyEnrollments(isStudent);
    const { data: whatsappSetting } = useGetPublicSetting('support_whatsapp_number');

    const [modal, setModal] = useState<ModalState>(null);

    const isLoading = coursesLoading || (isStudent && enrollmentsLoading);

    const enrollmentMap = new Map(
        (enrollments ?? []).map((e) => [e.courseId, e.status]),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrolledCourses = (courses ?? []).filter((c) => enrollmentMap.get(c.id) === 'enrolled');
    const interestedCourses = (courses ?? []).filter((c) => enrollmentMap.get(c.id) === 'interested');
    const notEnrolled = (courses ?? []).filter((c) => !enrollmentMap.has(c.id));
    const availableCourses = notEnrolled.filter((c) => new Date(c.enrollmentStart) <= today);
    const upcomingCourses = notEnrolled.filter((c) => new Date(c.enrollmentStart) > today);

    const whatsappNumber = whatsappSetting?.value;
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

    const displayName = user?.email?.split('@')[0]?.toUpperCase() ?? 'ALUNO';

    function openModal(course: CourseDto, action: CourseAction) {
        setModal({ course, action });
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
                            Olá, <span className='ca-banner__name'>{displayName}!</span> 👋
                        </h1>
                        <p>
                            Bem-vindo à sua plataforma de aprendizado. Continue sua jornada
                            de formação e construa seu futuro profissional.
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
                        <button className='ca-banner__btn ca-banner__btn--yellow'>
                            <AssignmentIndIcon sx={{ fontSize: 16 }} />
                            Meu Currículo
                        </button>
                        <button className='ca-banner__btn ca-banner__btn--outline'>
                            <PersonIcon sx={{ fontSize: 16 }} />
                            Meu Perfil
                        </button>
                    </div>
                </div>

                {/* Cursos Inscritos */}
                {enrolledCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>🌟 Cursos Inscritos</h2>
                        <div className='ca-grid'>
                            {enrolledCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='inscrito'
                                    onSaibaMais={() => openModal(course, 'inscrito')}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Interesse Manifestado */}
                {interestedCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>💛 Interesse Manifestado</h2>
                        <div className='ca-grid'>
                            {interestedCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='interessado'
                                    onSaibaMais={() => openModal(course, 'interessado')}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Cursos Disponíveis */}
                {availableCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>Cursos Disponíveis</h2>
                        <div className='ca-grid'>
                            {availableCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='inscrever'
                                    onSaibaMais={() => openModal(course, 'inscrever')}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Em breve */}
                {upcomingCourses.length > 0 && (
                    <div className='ca-section'>
                        <h2 className='ca-section__title'>Em breve — não perca a chance!</h2>
                        <div className='ca-grid'>
                            {upcomingCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    action='interesse'
                                    onSaibaMais={() => openModal(course, 'interesse')}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sem nenhum curso */}
                {enrolledCourses.length === 0 && interestedCourses.length === 0 && availableCourses.length === 0 && upcomingCourses.length === 0 && (
                    <div className='ca-section'>
                        <div className='ca-empty'>
                            <p>Nenhum curso disponível no momento.</p>
                            <small>Novos cursos serão divulgados em breve. Volte mais tarde.</small>
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
                    onClose={() => setModal(null)}
                />
            )}
        </>
    );
}
