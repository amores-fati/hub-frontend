/* eslint-disable unicorn/filename-case */
import {
    Gender,
    Race,
    Scholarship,
    SocialBenefit,
    WhoInformed,
} from '@/dtos/StudentDto';

export type EditProfileForm = {
    fullName: string;
    socialName: string;
    cpf: string;
    hasDisability: boolean;
    disabilityTypes: string[];

    phoneNumber: string;
    cep: string;
    address: string;
    complement: string;
    neighbourhood: string;
    city: string;
    state: string;

    education: Scholarship | undefined;
    course: string;
    institution: string;

    currentlyWorking: boolean;
    activityArea: string;
    hasProgrammingExperience: boolean | undefined;
    hasParticipatedOnCourses: boolean | undefined;

    birthDate: string;
    gender: Gender | undefined;
    race: Race | undefined;
    howHeard: WhoInformed | undefined;
    hasComputer: boolean;
    hasInternet: boolean;
    committedToParticipate: boolean;
    householdSize: string;
    socialBenefit: SocialBenefit | undefined;
    motivation: string;
};

export type EditProfileFormSetter = React.Dispatch<
    React.SetStateAction<EditProfileForm>
>;
