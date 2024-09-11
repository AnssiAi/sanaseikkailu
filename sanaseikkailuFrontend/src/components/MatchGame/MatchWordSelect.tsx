import { useContext, useEffect, useState } from 'react';
import { WordContext } from './MatchGame';

interface MatchWordSelectProps {
  list: string;
  handleSelect: (key: string, list: string) => void;
}
//Sana
//Match
//Tapahtumakäsittelijä, pääkomponentti check
const MatchWordSelect = ({ list, handleSelect }: MatchWordSelectProps) => {
  const { word, matchKey } = useContext(WordContext);
  const [value, setValue] = useState<string>(word);
  const [isComplete, setComplete] = useState<boolean>(true);

  //Kun sana vaihtuu kontekstissa
  //Odotetaan 3s, Vaihdetaan näkyvä sana, Asetetaan takaisin aktiiviseksi
  useEffect(() => {
    setComplete(!isComplete);
    setTimeout(() => {
      setValue(word);
    }, 3000);
  }, [word]);

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault;
    handleSelect(matchKey, list);
  };
  return (
    <input
      type='button'
      disabled={isComplete}
      value={value}
      onClick={handleClick}
    />
  );
};

export default MatchWordSelect;
