'use client';
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

const GRADIENTS = [
    'linear-gradient(90deg, #43E97B 0%, #83EEEE 100%)',
    'linear-gradient(90deg, #FF77DD 0%, #FF5588 100%)',
    'linear-gradient(90deg, #6D68FF 0%, #7E55B1 100%)',
    'linear-gradient(90deg, #009AE8 0%, #47F3F9 100%)',
    'linear-gradient(90deg, #A28BD7 0%, #F694FF 100%)',
];

function getGradient(id: string): string {
    const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return GRADIENTS[hash % GRADIENTS.length];
}

export type CourseAction = 'inscrito' | 'inscrever' | 'interesse' | 'interessado';

type CourseCardProps = {
    course: CourseDto;
    action: CourseAction;
    onSaibaMais: () => void;
    onAction?: () => void;
    disabled?: boolean;
};

export function CourseCard({ course, action, onSaibaMais, onAction, disabled }: CourseCardProps) {
    const headerBg = course.imageUrl
        ? { backgroundImage: `url(${course.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: getGradient(course.id) };

    return (
        <div className='course-card'>
            {/* Header — altura 91px, border-radius só no topo */}
            <div className='course-card__header' style={headerBg}>
                <span className='course-card__modality-badge'>
                    {MODALITY_LABELS[course.modality].toUpperCase()}
                </span>
            </div>

            {/* Body — border-radius só na base, outline 1px */}
            <div className='course-card__body'>
                <div className='course-card__info'>
                    <p className='course-card__title'>{course.title}</p>
                    <p className='course-card__description'>{course.description}</p>
                </div>

                <div className='course-card__footer'>
                    <div className='course-card__meta'>
                        <span className='course-card__hours'>⏱ {course.workloadHours}h</span>
                        <span className='course-card__vacancies'>{course.vacancyCount} Vagas</span>
                    </div>

                    <div className='course-card__actions'>
                        <button className='course-card__saiba-mais' onClick={onSaibaMais}>
                            Saiba mais →
                        </button>
                        {action === 'inscrito' && (
                            <button className='course-card__btn'>
                                <CheckIcon sx={{ fontSize: 14 }} />
                                Inscrito
                            </button>
                        )}
                        {action === 'inscrever' && (
                            <button className='course-card__btn' onClick={onAction} disabled={disabled}>
                                Inscrever-se
                            </button>
                        )}
                        {action === 'interesse' && (
                            <button className='course-card__btn' onClick={onAction} disabled={disabled}>
                                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                Tenho interesse
                            </button>
                        )}
                        {action === 'interessado' && (
                            <button className='course-card__btn course-card__btn--yellow' disabled>
                                <FavoriteIcon sx={{ fontSize: 14 }} />
                                Interesse manifestado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
