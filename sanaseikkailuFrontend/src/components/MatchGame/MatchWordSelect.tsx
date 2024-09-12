import { useContext } from 'react';
import { WordContext } from './MatchGame';

interface MatchWordSelectProps {
  list: string;
  handleSelect: (key: string, list: string) => void;
}

const MatchWordSelect = ({ list, handleSelect }: MatchWordSelectProps) => {
  const { word, matchKey, complete } = useContext(WordContext);
  //Tila hallitsemaan ilmettä?

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault;
    handleSelect(matchKey, list);
  };
  return (
    <input
      type='button'
      disabled={complete}
      value={word}
      onClick={handleClick}
    />
  );
};

export default MatchWordSelect;