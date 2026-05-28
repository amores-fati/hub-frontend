/* eslint-disable unicorn/filename-case */
import {
    StudentProfile,
    UpdateStudentProfilePayload,
} from '@/dtos/StudentProfileDto';
import { phoneNumberRegex } from '@/utils/regex';
import { formatDate } from '@/utils/shared-functions/date';
import { EditProfileForm } from './Types';

export function profileToForm(data: StudentProfile): EditProfileForm {
    const disabilityType = data.disability?.type ?? '';
    const disabilityTypes = disabilityType
        ? disabilityType
              .split(',')
              .filter(Boolean)
              .map((t) => t.toUpperCase())
        : [];

    return {
        fullName: data.fullName ?? '',
        socialName: data.socialName ?? '',
        cpf: data.cpf ?? '',
        hasDisability: data.disability?.hasDisability ?? false,
        disabilityTypes,

        phoneNumber: phoneNumberRegex(data.contact?.phone ?? '') ?? '',
        cep: (data.contact?.cep ?? '').replace(/\D/g, ''),
        address: data.contact?.address ?? '',
        complement: data.contact?.complement ?? '',
        neighbourhood: data.contact?.neighbourhood ?? '',
        city: data.contact?.city ?? '',
        state: data.contact?.state ?? '',

        education: data.education,
        course: data.courseName ?? '',
        institution: data.institution ?? '',

        currentlyWorking: !!data.activityArea,
        activityArea: data.activityArea ?? '',
        hasProgrammingExperience: data.hasProgrammingExperience,
        hasParticipatedOnCourses: undefined,

        birthDate: isoToDisplayDate(data.birthDate),
        gender: data.gender,
        race: data.race,
        howHeard: data.howHeard,
        hasComputer: data.hasComputer ?? false,
        hasInternet: data.hasInternet ?? false,
        committedToParticipate: data.committedToParticipate ?? false,
        householdSize:
            data.householdSize !== undefined && data.householdSize !== null
                ? String(data.householdSize)
                : '',
        socialBenefit: data.socialBenefits?.[0]?.benefit,
        motivation: data.motivation ?? '',
    };
}

export function formToUpdatePayload(
    form: EditProfileForm,
    id: string,
): UpdateStudentProfilePayload {
    const householdSize = form.householdSize.trim()
        ? Number(form.householdSize)
        : undefined;

    return {
        id,
        fullName: form.fullName.trim(),
        socialName: form.socialName.trim() || null,
        birthDate: formatDate(form.birthDate) ?? undefined,
        gender: form.gender,
        race: form.race,
        education: form.education,
        courseName: form.course.trim() || undefined,
        institution: form.institution.trim() || undefined,
        activityArea: form.currentlyWorking
            ? form.activityArea.trim() || undefined
            : undefined,
        motivation: form.motivation.trim() || undefined,
        howHeard: form.howHeard,
        hasComputer: form.hasComputer,
        hasInternet: form.hasInternet,
        hasProgrammingExperience: form.hasProgrammingExperience,
        committedToParticipate: form.committedToParticipate,
        householdSize: Number.isFinite(householdSize)
            ? householdSize
            : undefined,
        contact: {
            phone: form.phoneNumber.replace(/\D/g, '') || undefined,
            cep: form.cep.replace(/\D/g, '') || undefined,
            address: form.address.trim() || undefined,
            complement: form.complement.trim() || undefined,
            neighbourhood: form.neighbourhood.trim() || undefined,
            city: form.city.trim() || undefined,
            state: form.state.trim() || undefined,
        },
        disability: {
            hasDisability: form.hasDisability,
            type:
                form.hasDisability && form.disabilityTypes.length
                    ? form.disabilityTypes.join(',')
                    : null,
        },
        socialBenefits: form.socialBenefit
            ? [{ benefit: form.socialBenefit }]
            : undefined,
    };
}

function isoToDisplayDate(iso: string | undefined | null): string {
    if (!iso) return '';
    const datePart = iso.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
}
