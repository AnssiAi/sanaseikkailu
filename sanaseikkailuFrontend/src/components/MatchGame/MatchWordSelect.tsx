import { useContext } from 'react';
import { WordContext } from './MatchGame';

interface MatchWordSelectProps {
  list: string;
  handleSelect: (key: string, list: string) => void;
}

const MatchWordSelect = ({ list, handleSelect }: MatchWordSelectProps) => {
  const { word, matchKey, complete } = useContext(WordContext);

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault;
    handleSelect(matchKey, list);
  };
  return (
    <input
      className='matchInput'
      type='button'
      disabled={complete}
      value={word}
      onClick={handleClick}
    />
  );
};

export default MatchWordSelect;
