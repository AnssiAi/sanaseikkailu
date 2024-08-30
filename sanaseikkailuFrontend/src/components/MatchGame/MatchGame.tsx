import { useEffect, useState } from 'react';
import { GameSettings, GameWord } from '../../../types';
import { getRandomInt } from '../../utils';
import { useTimer } from '../../hooks/useTimer';
import { useScore } from '../../hooks/useScore';

//Ajastin
//Pisteet
//Pelin lopetus
const MatchGame = ({
  gameSettings,
  wordList,
}: {
  gameSettings: GameSettings;
  wordList: GameWord[];
}) => {
  const [gameWords, setGameWords] = useState<GameWord[]>([]);

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
  const { seconds, minutes } = useTimer(gameSettings.gameTime);
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
  return (
    <>
      <div>
        {gameWords ? (
          <>
            <h2>
              {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
            </h2>
            <h3>
              Pisteet: {score} Putki: {streak}
            </h3>
            <p>MatchGame</p>
            {gameWords.map((word, index) => (
              <button key={index} onClick={handleClick}>
                {word.en}
              </button>
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default MatchGame;
