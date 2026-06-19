export type Skill = {
    id: string;
    name: string;
};

export type SkillResponseDto = {
    value: string;
    label: string;
} & Skill;
