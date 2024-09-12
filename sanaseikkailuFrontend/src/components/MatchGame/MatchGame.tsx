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

//Konteksti sanojen välittämiseksi painike komponenteille
export const WordContext = createContext<MatchWord>({
  word: '',
  matchKey: '',
  complete: false,
});

//Vakiot
const wordCount: number = 5;

const MatchGame = ({ gameSettings, wordList }: MatchGameProps) => {
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [hostSelect, setHostSelect] = useState<string>(''); //valitun host-kielen matchKey
  const [studySelect, setStudySelect] = useState<string>(''); //valitun study-kielen matchKey
  const [hostWords, setHostWords] = useState<MatchWord[]>([]); //host-kielen sanalista
  const [studyWords, setStudyWords] = useState<MatchWord[]>([]); //study-kielen sanalista
  const [hostAvailable, setHostAvailable] = useState<MatchWord[]>([]); //vaihdettavat host-kielen sanat
  const [studyAvailable, setStudyAvailable] = useState<MatchWord[]>([]); //vaihdettavat study-kielen sanat

  const { user, setUser } = useContext(UserContext); //Käyttäjä
  const { total, seconds, minutes } = useTimer(gameSettings.gameTime); //Aika
  const { score, streak, resetStreak, incStreak, incScore } = useScore(); //Pisteet

  useEffect(() => {
    const setupGame = () => {
      let hostList: MatchWord[] = [];
      let studyList: MatchWord[] = [];
      for (let i = 0; i < wordCount; i++) {
        const words = getRandWord();

        hostList = hostList.concat(words.host);
        studyList = studyList.concat(words.study);
      }
      setHostWords(shuffle(hostList));
      setStudyWords(shuffle(studyList));
      setGameActive(!gameActive);
    };
    setupGame();
  }, [wordList]);

  //Seurataan pelin päättymistä
  useEffect(() => {
    if (total < 1000) {
      endGame();
    }
  }, [total]);

  //Tarkastetaan sanapari
  useEffect(() => {
    const emptyCheck: boolean =
      hostSelect.length !== 0 && studySelect.length !== 0;
    if (emptyCheck) {
      hostSelect === studySelect ? isMatch() : notMatch();
    }
  }, [hostSelect, studySelect]);

  //Populoidaan listat uudelleen
  useEffect(() => {
    if (hostAvailable.length > 0 && studyAvailable.length > 0) {
      const timeoutId = setTimeout(() => {
        const randHost: MatchWord =
          hostAvailable[getRandomInt(hostAvailable.length)];
        const randStudy: MatchWord =
          studyAvailable[getRandomInt(studyAvailable.length)];
        const newHostAvailable: MatchWord[] = hostAvailable.filter(
          (word) => word.matchKey !== randHost.matchKey
        );
        const newStudyAvailable: MatchWord[] = studyAvailable.filter(
          (word) => word.matchKey !== randStudy.matchKey
        );

        const newWords = getRandWord();

        const newHost = hostWords.map((word) => {
          let result: MatchWord = word;
          if (word.matchKey === randHost.matchKey) {
            result = newWords.host;
          }
          return result;
        });
        const newStudy = studyWords.map((word) => {
          let result: MatchWord = word;
          if (word.matchKey === randStudy.matchKey) {
            result = newWords.study;
          }
          return result;
        });
        setHostAvailable(newHostAvailable);
        setStudyAvailable(newStudyAvailable);
        setHostWords(newHost);
        setStudyWords(newStudy);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hostAvailable, studyAvailable]);

  //Funktiot
  const getRandWord = () => {
    const len: number = wordList.length;
    let result = undefined;
    while (result === undefined) {
      const randWord: GameWord = wordList[getRandomInt(len)];
      const matchString: string = (
        randWord[gameSettings.hostLanguage] +
        randWord[gameSettings.studyLanguage]
      )
        .split(' ')
        .join('');
      const hostWord: MatchWord = {
        word: randWord[gameSettings.hostLanguage],
        matchKey: matchString,
        complete: false,
      };

      const studyWord: MatchWord = {
        word: randWord[gameSettings.studyLanguage],
        matchKey: matchString,
        complete: false,
      };
      const hostCheck: MatchWord | undefined = hostWords.find(
        (word) => word.matchKey === hostWord.matchKey
      );
      const studyCheck: MatchWord | undefined = studyWords.find(
        (word) => word.matchKey === studyWord.matchKey
      );

      if (!hostCheck && !studyCheck) {
        result = { host: hostWord, study: studyWord };
      }
    }
    return result;
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
  const clearSelect = (): void => {
    setHostSelect('');
    setStudySelect('');
  };

  //Toggle complete
  const isMatch = (): void => {
    const hostToChange: MatchWord | undefined = hostWords.find(
      (word) => word.matchKey === hostSelect
    );
    const studyToChange: MatchWord | undefined = studyWords.find(
      (word) => word.matchKey === studySelect
    );

    const hostComplete = hostWords.map((word) => {
      let result: MatchWord = word;
      if (word.matchKey === hostSelect) {
        result = {
          ...word,
          complete: true,
        };
      }
      return result;
    });
    const studyComplete = studyWords.map((word) => {
      let result: MatchWord = word;
      if (word.matchKey === studySelect) {
        result = {
          ...word,
          complete: true,
        };
      }
      return result;
    });
    if (hostToChange && studyToChange) {
      setHostAvailable(hostAvailable.concat(hostToChange));
      setStudyAvailable(studyAvailable.concat(studyToChange));
    }
    setHostWords(hostComplete);
    setStudyWords(studyComplete);

    incStreak();
    incScore();
    clearSelect();
  };
  const notMatch = (): void => {
    resetStreak();
    clearSelect();
  };

  //Pelin lopetus
  const endGame = (): void => {
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
            <div>
              {hostWords.map((word, index) => (
                <WordContext.Provider value={word} key={index}>
                  <MatchWordSelect list='host' handleSelect={handleSelect} />
                </WordContext.Provider>
              ))}
            </div>
            <div>
              {studyWords.map((word, index) => (
                <WordContext.Provider value={word} key={index}>
                  <MatchWordSelect list='study' handleSelect={handleSelect} />
                </WordContext.Provider>
              ))}
            </div>
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
