'use client';
import { CourseAction } from '@/components/CourseCard';
import { CourseDto } from '@/dtos/CourseDto';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './index.scss';

const MODALITY_LABELS: Record<CourseDto['modality'], string> = {
    presencial: 'Presencial',
    online: 'Online',
    hibrido: 'Híbrido',
};

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const GRADIENTS = [
    'linear-gradient(90deg, #43E97B 0%, #83EEEE 100%)',
    'linear-gradient(90deg, #FF77DD 0%, #FF5588 100%)',
    'linear-gradient(90deg, #6D68FF 0%, #7E55B1 100%)',
    'linear-gradient(90deg, #009AE8 0%, #47F3F9 100%)',
    'linear-gradient(90deg, #A28BD7 0%, #F694FF 100%)',
];

const COURSE_EMOJIS: Record<string, string> = {
    'mock-id-1': '🐍',
    'mock-id-2': '📈',
    'mock-id-3': '💻',
    'mock-id-4': '📊',
    'mock-id-5': '🎨',
};

function getGradient(id: string): string {
    const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return GRADIENTS[hash % GRADIENTS.length];
}

function formatPeriod(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${MONTHS[start.getMonth()]} - ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

function getTurma(startDate: string): string {
    const date = new Date(startDate);
    const semester = date.getMonth() < 6 ? '1' : '2';
    return `Turma ${date.getFullYear()}.${semester}`;
}

type CourseModalProps = {
    course: CourseDto;
    action: CourseAction;
    onClose: () => void;
    onAction?: () => void;
};

export function CourseModal({ course, action, onClose, onAction }: CourseModalProps) {
    const hasImage = !!course.imageUrl;
    const headerStyle = hasImage
        ? { backgroundImage: `url(${course.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: getGradient(course.id) };

    function handleAction() {
        onAction?.();
        onClose();
    }

    return (
        <div className='course-modal__overlay' onClick={onClose}>
            <div className='course-modal' onClick={(e) => e.stopPropagation()}>

                <div className='course-modal__header' style={headerStyle}>
                    {!hasImage && (
                        <span className='course-modal__header-emoji' aria-hidden>
                            {COURSE_EMOJIS[course.id] ?? '📚'}
                        </span>
                    )}
                </div>

                <div className='course-modal__content'>
                    <div>
                        <h2 className='course-modal__title'>{course.title}</h2>
                        <p className='course-modal__subtitle'>
                            Instituto Amores Fati · {getTurma(course.startDate)}
                        </p>
                    </div>

                    <p className='course-modal__description'>{course.description}</p>

                    <div className='course-modal__info-grid'>
                        <div className='course-modal__info-item'>
                            <span className='course-modal__info-label'>Carga Horária</span>
                            <span className='course-modal__info-value'>{course.workloadHours} horas</span>
                        </div>
                        <div className='course-modal__info-item'>
                            <span className='course-modal__info-label'>Modalidade</span>
                            <span className='course-modal__info-value'>{MODALITY_LABELS[course.modality]}</span>
                        </div>
                        <div className='course-modal__info-item'>
                            <span className='course-modal__info-label'>Vagas</span>
                            <span className='course-modal__info-value'>{course.vacancyCount} vagas restantes</span>
                        </div>
                        <div className='course-modal__info-item'>
                            <span className='course-modal__info-label'>Período</span>
                            <span className='course-modal__info-value'>
                                {formatPeriod(course.startDate, course.endDate)}
                            </span>
                        </div>
                        <div className='course-modal__info-item'>
                            <span className='course-modal__info-label'>Inscrições</span>
                            <span className='course-modal__info-value'>
                                {formatPeriod(course.enrollmentStart, course.enrollmentEnd)}
                            </span>
                        </div>
                        {course.location && (
                            <div className='course-modal__info-item course-modal__info-item--span2'>
                                <span className='course-modal__info-label'>Local</span>
                                <span className='course-modal__info-value'>{course.location}</span>
                            </div>
                        )}
                    </div>

                    <div className='course-modal__footer'>
                        <button className='course-modal__btn course-modal__btn--outline' onClick={onClose}>
                            Fechar
                        </button>
                        {action === 'inscrito' && (
                            <button className='course-modal__btn course-modal__btn--primary' disabled>
                                <CheckIcon sx={{ fontSize: 16 }} />
                                Inscrito
                            </button>
                        )}
                        {action === 'inscrever' && (
                            <button className='course-modal__btn course-modal__btn--primary' onClick={handleAction}>
                                Inscrever-se
                            </button>
                        )}
                        {action === 'interesse' && (
                            <button className='course-modal__btn course-modal__btn--primary' onClick={handleAction}>
                                <FavoriteIcon sx={{ fontSize: 16 }} />
                                Mostrar Interesse
                            </button>
                        )}
                        {action === 'interessado' && (
                            <button className='course-modal__btn course-modal__btn--yellow' disabled>
                                <FavoriteIcon sx={{ fontSize: 16 }} />
                                Interesse manifestado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
