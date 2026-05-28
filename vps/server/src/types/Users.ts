export type UserRole = "patient" | "admin";

export interface Profile {
  id: number;
  nom: string | null;
  prenom: string | null;
  role: UserRole;
}
