export interface GameSettings {
  hostLanguage: string;
  studyLanguage: string;
  gameTime: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface GameWord {
  fin: string;
  sve: string;
  en: string;
}
export interface PlayerUser {
  id: string;
  username: string;
  password: string;
  points: number;
}
export interface LoggedPlayerUser {
  username: string;
  points: number;
  token: string;
}
export interface Timer {
  seconds: number;
  minutes: number;
}

export type SecurePlayerUser = Omit<PlayerUser, "id" | "password">;
export type NewPlayerUser = Omit<PlayerUser, "id">;
