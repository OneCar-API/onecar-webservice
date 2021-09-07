export default interface IUserDTO {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone?: string;
  document?: string;
  cnpj?: string;
  is_legal?: string;
  created_at: Date;
  updated_at: Date;
}
