import axios from "axios";
import { GameWord } from "../../types";
import { apiUrl } from "../constants";

export const getWordsFromCollection = (
  collection: string
): Promise<GameWord[]> => {
  const request = axios
    .get(`${apiUrl}/${collection}`)
    .then(response => {
      const data: GameWord[] = response.data;
      return data;
    })
    .catch(err => {
      throw new Error(err);
    });
  return request;
};
