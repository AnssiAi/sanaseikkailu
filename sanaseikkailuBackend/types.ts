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

export interface LoggedPlayerUser {
  username: string;
  points: number;
  token: string;
}

export type SecurePlayerUser = Omit<PlayerUser, "id" | "password">;
export type NewPlayerUser = Omit<PlayerUser, "id">;

export enum UserParameters {
  USERNAME = "username",
  PASSWORD = "password",
  POINTS = "points",
}
