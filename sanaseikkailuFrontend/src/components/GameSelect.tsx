import { Link } from 'react-router-dom';
//Linkit eri peleihin
const GameSelect = () => {
  return (
    <>
      <div className='gameSelect'>
        <div className='gameCard'>
          <img src='src/assets/icons/matchMap.svg' width={100} height={100} />
          <Link to={'/matchgame'}>MatchGame</Link>
        </div>
      </div>
    </>
  );
};

export default GameSelect;
