import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { skillsApi } from '.';
import { Skill, SkillResponseDto } from './types';
import { ResponseDto } from '../../../dtos/ResponseDto';

export const useGetSkills = () =>
    useQuery({
        queryKey: [QUERY_KEYS.SKILLS],
        queryFn: () =>
            skillsApi
                .get(``)
                .then<SkillResponseDto[]>((res: ResponseDto<Skill[]>) => {
                    const response = res.data;

                    return response.map((skill) => ({
                        ...skill,
                        value: skill.id,
                        label: skill.name,
                    })) as SkillResponseDto[];
                }),
    });
