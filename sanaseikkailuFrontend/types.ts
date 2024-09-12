export interface GameSettings {
  hostLanguage: string;
  studyLanguage: string;
  gameTime: number;
}

export interface LoginData {
  username: string;
  password: string;
}

//Key tyyppiä ei tarvitse määritellä kuin kerran tyyppiä kohden
//Kaikki keyt on string, yksi määrittely riittää
export interface GameWord {
  [fin: string]: string;
  sve: string;
  en: string;
}

export interface MatchWord {
  word: string;
  matchKey: string;
  complete: boolean;
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
  total: number;
  seconds: number;
  minutes: number;
}

export type UserData = LoggedPlayerUser | null;

export type UserObject = {
  user: UserData;
  setUser: (u: UserData) => void;
};

export type SecurePlayerUser = Omit<PlayerUser, 'id' | 'password'>;
export type NewPlayerUser = Omit<PlayerUser, 'id'>;
