import axios from 'axios';
import { apiUrl } from '../constants';
import { LoggedPlayerUser, LoginData, NewPlayerUser } from '../../types';

export const userLogin = (user: LoginData): Promise<LoggedPlayerUser> => {
  const request = axios
    .post(`${apiUrl}/login`, user)
    .then((response) => {
      const data: LoggedPlayerUser = response.data;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return request;
};

export const postUser = (user: NewPlayerUser): Promise<LoggedPlayerUser> => {
  const request = axios
    .post(`${apiUrl}/users`, user)
    .then((response) => response.data)
    .catch((err) => {
      throw new Error(err);
    });
  return request;
};
