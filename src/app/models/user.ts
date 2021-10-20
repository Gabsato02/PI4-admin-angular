export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}
