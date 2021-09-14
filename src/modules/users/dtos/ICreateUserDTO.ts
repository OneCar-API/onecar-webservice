export default interface ICreateUserDTO {
  name: string;
  nickname: string;
  email: string;
  password: string;
  phone?: string;
  document: string;
  cnpj?: string;
  is_legal: boolean;
}
