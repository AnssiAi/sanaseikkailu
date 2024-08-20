import { useState } from "react";
import MatchGame from "./MatchGame";
import { GameSettings } from "../../../types";
//Sanastojen haku. On vain yksi sanasto joten käytetään placeholderia
//Sanasto nimi = hakureitin nimi
const wordLists: string[] = ["itWords"];

//Kielivalinta - Valinnat sulkemaan toisensa pois
const MatchGameSetup = () => {
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>({
    hostLanguage: "",
    studyLanguage: "",
    list: wordLists[0],
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormComplete(!formComplete);
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
  return (
    <>
      <div>
        {formComplete ? (
          <MatchGame gameSettings={settings} />
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <select name="hostLanguage" onChange={handleFormInput}>
                <option value="fin">Suomi</option>
                <option value="en">Englanti</option>
                <option value="sve">Ruotsi</option>
              </select>
              <select name="studyLanguage" onChange={handleFormInput}>
                <option value="fin">Suomi</option>
                <option value="en">Englanti</option>
                <option value="sve">Ruotsi</option>
              </select>
              <select name="list" onChange={handleFormInput}>
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

export default MatchGameSetup;
