export default interface ICreateUserDTO {
  name: string;
  nickname: string;
  email: string;
  phone?: string;
  password: string;
  cnpj?: string;
  document: string;
  is_legal: boolean;
  is_active: boolean;
}
