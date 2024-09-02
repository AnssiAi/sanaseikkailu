import axios from 'axios';
import { apiUrl } from '../constants';

export const getWordCollections = (): Promise<string[]> => {
  const request = axios
    .get(`${apiUrl}/col`)
    .then((response) => {
      const data: string[] = response.data;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return request;
};
