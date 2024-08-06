export interface PlayerUser {
  id: string;
  username: string;
  password: string;
  points: number;
}

export interface GameWord {
  fin: string;
  sve: string;
  en: string;
}

export type SecurePlayerUser = Omit<PlayerUser, "id" | "password">;
export type NewPlayerUser = Omit<PlayerUser, "id">;
