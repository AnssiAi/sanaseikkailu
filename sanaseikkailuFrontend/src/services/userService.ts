import axios from 'axios';
import { apiUrl } from '../constants';
import { LoggedPlayerUser } from '../../types';

export const updateUserPoints = (user: LoggedPlayerUser): void => {
  axios.put(`${apiUrl}/users`, user).catch((err) => {
    throw new Error(err);
  });
};
