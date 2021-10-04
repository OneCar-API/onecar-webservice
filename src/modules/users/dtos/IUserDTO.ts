export default interface IUserDTO {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone?: string;
  document?: string;
  cnpj?: string;
  is_legal: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
