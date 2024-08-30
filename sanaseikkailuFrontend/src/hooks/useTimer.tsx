import { useState, useEffect } from 'react';
import { Timer } from '../../types';

const second: number = 1000;
const minute: number = second * 60;
//Lasketaan millisekunneissa
export const useTimer = (gameTime: number): Timer => {
  const startTime: number = Date.now() + gameTime * second;
  const [timer, setTimer] = useState<number>(startTime - Date.now());

  const getTime = (): void => {
    const time: number = startTime - Date.now();
    if (time <= 0) {
      return;
    }
    setTimer(time);
  };
  useEffect(() => {
    const intervalTimer = setInterval(() => getTime(), second);
    return () => clearInterval(intervalTimer);
  }, []);

  return {
    seconds: Math.floor((timer / second) % 60),
    minutes: Math.floor((timer / minute) % 60),
  };
};
