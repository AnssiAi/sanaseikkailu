import { Link } from 'react-router-dom';
import matchMap from '../../src/assets/icons/matchMap.svg';
//Linkit eri peleihin
const GameSelect = () => {
  return (
    <>
      <div className='gameSelect'>
        <div className='gameCard'>
          <img src={matchMap} width={100} height={100} />
          <Link to={'/matchgame'}>MatchGame</Link>
        </div>
      </div>
    </>
  );
};

export default GameSelect;
