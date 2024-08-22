import { useState, useEffect } from "react";
import MatchGame from "./MatchGame/MatchGame";
import { GameSettings, GameWord } from "../../types";
import { getWordsFromCollection } from "../services/wordService";
import { checkString } from "../utils";
//Sanastojen haku. On vain yksi sanasto joten käytetään placeholderia
//Sanasto nimi = hakureitin nimi
const wordLists: string[] = ["itWords"];

//Kielivalinta - Valinnat sulkemaan toisensa pois
const GameSetup = ({ game }: { game: string }) => {
  const [wordList, setWordList] = useState<GameWord[]>([]);
  const [selectedList, setSelectedList] = useState<string>("itWords");
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>({
    hostLanguage: "",
    studyLanguage: "",
    gameTime: 120,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: GameWord[] = await getWordsFromCollection(selectedList);
        setWordList(data);
      } catch (err: unknown) {
        let errorMessage: string = "Error: ";
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
      alert("Choose two languages");
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
    if (e.target instanceof HTMLSelectElement) {
      setSelectedList(e.target.value);
    }
  };
  const getGameComponent = () => {
    switch (game) {
      case "matchGame":
        return <MatchGame gameSettings={settings} wordList={wordList} />;
      default:
        return null;
    }
  };
  return (
    <>
      <div>
        {formComplete ? (
          getGameComponent()
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <select
                name="hostLanguage"
                onChange={handleFormInput}
                value={settings.hostLanguage}
              >
                <option value="fin">Suomi</option>
                <option value="en">Englanti</option>
                <option value="sve">Ruotsi</option>
              </select>
              <select
                name="studyLanguage"
                onChange={handleFormInput}
                value={settings.studyLanguage}
              >
                <option value="fin">Suomi</option>
                <option value="en">Englanti</option>
                <option value="sve">Ruotsi</option>
              </select>
              <select name="list" onChange={handleListChange}>
                {wordLists.map((list, index) => (
                  <option key={index} value={list}>
                    {list}
                  </option>
                ))}
              </select>
              <button type="submit">start game</button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default GameSetup;
