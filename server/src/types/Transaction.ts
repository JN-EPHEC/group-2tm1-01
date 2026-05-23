export interface Transaction {
  id: number;
  user_id: string | null;
  total: number | null;
  created_at: string;
}
