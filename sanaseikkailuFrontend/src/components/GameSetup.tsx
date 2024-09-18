import { useState, useEffect } from 'react';
import MatchGame from './MatchGame/MatchGame';
import { GameSettings, GameWord } from '../../types';
import { getWordCollections } from '../services/collectionService';
import { getWordsFromCollection } from '../services/wordService';
import { checkString } from '../utils';

//Muuttujat peliajan valitsemiseksi
//const shortGame: number = 60;
const medGame: number = 120;
//const longGame: number = 180;

const collections: string[] = await getWordCollections();

//Kielivalinta - Valinnat sulkemaan toisensa pois
const GameSetup = ({ game }: { game: string }) => {
  const [wordList, setWordList] = useState<GameWord[]>([]);
  const [selectedList, setSelectedList] = useState<string>(collections[0]);
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>({
    hostLanguage: 'fin',
    studyLanguage: 'en',
    gameTime: medGame,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: GameWord[] = await getWordsFromCollection(selectedList);
        setWordList(data);
      } catch (err: unknown) {
        let errorMessage: string = 'Error: ';
        if (err instanceof Error) {
          errorMessage += err.message;
        }
        console.log(errorMessage);
      }
    };
    fetchData();
  }, [selectedList]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    //Tarkastettava settings
    const checkHost: boolean = checkString(settings.hostLanguage);
    const checkStudy: boolean = checkString(settings.studyLanguage);
    if (checkHost && checkStudy) {
      setFormComplete(!formComplete);
    } else {
      alert('Valitse kaksi kieltä');
    }
  };
  const handleFormInput = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLSelectElement) {
      const newSettings = {
        ...settings,
        [e.target.name]: e.target.value,
      };
      setSettings(newSettings);
    }
  };
  const handleListChange = (e: React.SyntheticEvent) => {
    e.preventDefault;
    if (e.target instanceof HTMLInputElement) {
      setSelectedList(e.target.value);
    }
  };
  const getGameComponent = () => {
    switch (game) {
      case 'matchGame':
        return <MatchGame gameSettings={settings} wordList={wordList} />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className='gameContainer'>
        {formComplete ? (
          getGameComponent()
        ) : (
          <>
            <fieldset className='tagSet'>
              <legend>Sanastot</legend>
              {collections.map((name, index) => (
                <div key={index} className='tagSelector'>
                  <input
                    id={'tag' + index}
                    type='radio'
                    name='listSelect'
                    value={name}
                    onChange={handleListChange}
                  />
                  <label className='tagLabel' htmlFor={'tag' + index}>
                    {name}
                  </label>
                </div>
              ))}
            </fieldset>
            <form className='setupForm' onSubmit={handleSubmit}>
              <select
                name='hostLanguage'
                onChange={handleFormInput}
                value={settings.hostLanguage}
              >
                <option value='fin'>Suomi</option>
                <option value='en'>Englanti</option>
                <option value='sve'>Ruotsi</option>
              </select>
              <select
                name='studyLanguage'
                onChange={handleFormInput}
                value={settings.studyLanguage}
              >
                <option value='fin'>Suomi</option>
                <option value='en'>Englanti</option>
                <option value='sve'>Ruotsi</option>
              </select>
              <button className='submitBtn' type='submit'>
                start game
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default GameSetup;
