import { GameWord } from "../types";

//Satunnais Integer luominen
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

//Array sekoitus
export const shuffle = (array: GameWord[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const checkString = (value: unknown): boolean => {
  let result: boolean = true;
  if (!isString(value) || value.length === 0) {
    result = false;
  }
  return result;
};
