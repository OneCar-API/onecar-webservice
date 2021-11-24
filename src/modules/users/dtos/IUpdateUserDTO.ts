export default interface IUpdateUserDTO {
  user_id?: string;
  name?: string;
  nickname?: string;
  password?: string;
  email?: string;
  phone?: string;
  document?: string;
  cnpj?: string;
  is_legal?: boolean;
}
