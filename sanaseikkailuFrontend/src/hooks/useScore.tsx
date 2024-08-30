import { useState } from 'react';

export const useScore = () => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const resetStreak = (): void => {
    setStreak(0);
  };
  const incStreak = (): void => {
    setStreak((prev) => prev + 1);
  };
  //Eriytetään, jos komponentti ei käytä streakia
  const incScore = (): void => {
    setScore((prev) => prev + 1 + streak);
  };

  return {
    score,
    streak,
    resetStreak,
    incStreak,
    incScore,
  };
};
