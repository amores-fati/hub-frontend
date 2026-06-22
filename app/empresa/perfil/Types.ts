/* eslint-disable unicorn/filename-case */

export type EditCompanyForm = {
    companyName: string;
    cnpj: string;
    tradeName: string;
    ownerName: string;

    phone: string;
    cep: string;
    address: string;
    complement: string;
    neighbourhood: string;
    city: string;
    state: string;
    email: string;
};

export type EditCompanyFormSetter = React.Dispatch<
    React.SetStateAction<EditCompanyForm>
>;