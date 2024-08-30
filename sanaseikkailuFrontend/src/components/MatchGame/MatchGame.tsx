import { useContext, useEffect, useState } from 'react';
import { GameSettings, GameWord } from '../../../types';
import { updateUserPoints } from '../../services/userService';
import { UserContext } from '../../App';
import { getRandomInt } from '../../utils';
import { useTimer } from '../../hooks/useTimer';
import { useScore } from '../../hooks/useScore';

interface MatchGameProps {
  gameSettings: GameSettings;
  wordList: GameWord[];
}

//Pelin lopetus
const MatchGame = ({ gameSettings, wordList }: MatchGameProps) => {
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const setupGame = () => {
      const len: number = wordList.length;
      let list: GameWord[] = [];
      for (let i = 0; i < 5; i++) {
        const randWord: GameWord = wordList[getRandomInt(len)];
        list = list.concat(randWord);
      }
      setGameWords(list);
    };
    setupGame();
  }, [wordList]);
  const { total, seconds, minutes } = useTimer(gameSettings.gameTime);
  const { score, streak, resetStreak, incStreak, incScore } = useScore();

  //Hook ei voi kutsua eventhandlerista joten käytetään apufunktioita
  const handleClick = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (streak >= 5) {
      reset();
    } else {
      increase();
    }
  };
  const increase = (): void => {
    incStreak();
    incScore();
  };
  const reset = (): void => {
    resetStreak();
  };

  const endGame = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (user) {
      const updUser = {
        ...user,
        points: user.points + score,
      };
      setUser(updUser);
      updateUserPoints(updUser);
    }
  };
  return (
    <>
      <div>
        {gameWords ? (
          <>
            <h2>
              {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
            </h2>
            <p>{total}</p>
            <h3>
              Pisteet: {score} Putki: {streak}
            </h3>
            <p>MatchGame</p>
            {gameWords.map((word, index) => (
              <button key={index} onClick={handleClick}>
                {word.en}
              </button>
            ))}
            <button onClick={endGame}>End</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default MatchGame;
