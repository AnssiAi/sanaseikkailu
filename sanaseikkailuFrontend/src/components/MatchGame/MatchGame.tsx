import { createContext, useContext, useEffect, useState } from 'react';
import { GameSettings, GameWord, MatchWord } from '../../../types';
import { updateUserPoints } from '../../services/userService';
import { UserContext } from '../../App';
import { getRandomInt, shuffle } from '../../utils';
import { useTimer } from '../../hooks/useTimer';
import { useScore } from '../../hooks/useScore';
import MatchWordSelect from './MatchWordSelect';

interface MatchGameProps {
  gameSettings: GameSettings;
  wordList: GameWord[];
}

export const WordContext = createContext<MatchWord>({
  word: '',
  matchKey: '',
});

//Vakiot
const wordCount: number = 5;

const MatchGame = ({ gameSettings, wordList }: MatchGameProps) => {
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [hostSelect, setHostSelect] = useState<string>('');
  const [studySelect, setStudySelect] = useState<string>('');
  const [hostWords, setHostWords] = useState<MatchWord[]>([]);
  const [studyWords, setStudyWords] = useState<MatchWord[]>([]);

  const { user, setUser } = useContext(UserContext);
  const { seconds, minutes } = useTimer(gameSettings.gameTime);
  const { score, streak, resetStreak, incStreak, incScore } = useScore();

  useEffect(() => {
    const setupGame = () => {
      let hostList: MatchWord[] = [];
      let studyList: MatchWord[] = [];
      for (let i = 0; i < wordCount; i++) {
        const words: MatchWord[] = getRandWord();

        hostList = hostList.concat(words[0]);
        studyList = studyList.concat(words[1]);
      }
      setHostWords(shuffle(hostList));
      setStudyWords(shuffle(studyList));
      setGameActive(!gameActive);
    };
    setupGame();
  }, [wordList]);

  //Tarkastetaan sanapari
  useEffect(() => {
    const emptyCheck: boolean =
      hostSelect.length !== 0 && studySelect.length !== 0;
    if (emptyCheck) {
      hostSelect === studySelect ? isMatch() : notMatch();
    }
  }, [hostSelect, studySelect]);

  const getRandWord = (): MatchWord[] => {
    const len: number = wordList.length;
    const randWord: GameWord = wordList[getRandomInt(len)];
    const matchString: string = (
      randWord[gameSettings.hostLanguage] + randWord[gameSettings.studyLanguage]
    )
      .split(' ')
      .join('');
    const hostWord: MatchWord = {
      word: randWord[gameSettings.hostLanguage],
      matchKey: matchString,
    };

    const studyWord: MatchWord = {
      word: randWord[gameSettings.studyLanguage],
      matchKey: matchString,
    };
    return [hostWord, studyWord];
  };

  const handleSelect = (key: string, list: string): void => {
    switch (list) {
      case 'host':
        setHostSelect(key);
        break;
      case 'study':
        setStudySelect(key);
        break;
      default:
        break;
    }
  };
  //Asetettava satunnaiseen paikkaan
  //Toggle complete
  const isMatch = (): void => {
    const newWords: MatchWord[] = getRandWord();

    const newHost = hostWords.map((word) => {
      let result: MatchWord = word;
      if (word.matchKey === hostSelect) {
        result = newWords[0];
      }
      return result;
    });
    const newStudy = studyWords.map((word) => {
      let result: MatchWord = word;
      if (word.matchKey === studySelect) {
        result = newWords[1];
      }
      return result;
    });

    setHostWords(newHost);
    setStudyWords(newStudy);

    incStreak();
    incScore();
    clearSelect();
  };
  const notMatch = (): void => {
    resetStreak();
    clearSelect();
  };

  const clearSelect = (): void => {
    setHostSelect('');
    setStudySelect('');
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
    setGameActive(!gameActive);
  };

  return (
    <>
      <div>
        {gameActive ? (
          <>
            <h2>
              {('0' + minutes).slice(-2)}:{('0' + seconds).slice(-2)}
            </h2>
            <h3>
              Pisteet: {score} Putki: {streak}
            </h3>
            <p>MatchGame</p>
            <WordContext.Provider value={hostWords[0]}>
              <MatchWordSelect list='host' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={hostWords[1]}>
              <MatchWordSelect list='host' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={hostWords[2]}>
              <MatchWordSelect list='host' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={hostWords[3]}>
              <MatchWordSelect list='host' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={hostWords[4]}>
              <MatchWordSelect list='host' handleSelect={handleSelect} />
            </WordContext.Provider>

            <WordContext.Provider value={studyWords[0]}>
              <MatchWordSelect list='study' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={studyWords[1]}>
              <MatchWordSelect list='study' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={studyWords[2]}>
              <MatchWordSelect list='study' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={studyWords[3]}>
              <MatchWordSelect list='study' handleSelect={handleSelect} />
            </WordContext.Provider>
            <WordContext.Provider value={studyWords[4]}>
              <MatchWordSelect list='study' handleSelect={handleSelect} />
            </WordContext.Provider>

            <button onClick={endGame}>End</button>
          </>
        ) : (
          <>
            <h3>
              Pisteet: {score} Putki: {streak}
            </h3>
          </>
        )}
      </div>
    </>
  );
};

export default MatchGame;
