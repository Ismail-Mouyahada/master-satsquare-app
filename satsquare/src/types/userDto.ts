export interface UserDTO {
  id: number;
  pseudo: string;
  email: string;
  role: string | null;
  association_id: number | null;
  sponsor_id: number | null;
}
