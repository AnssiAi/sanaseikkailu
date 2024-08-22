import { useEffect, useState } from "react";
import { GameSettings, GameWord } from "../../../types";
import { getRandomInt } from "../../utils";
import { useTimer } from "../../hooks/useTimer";

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

  return (
    <>
      <div>
        {gameWords ? (
          <>
            <h2>
              {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
            </h2>
            <p>MatchGame</p>
            {gameWords.map((word, index) => (
              <p key={index}>{word.en}</p>
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
