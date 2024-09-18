import { Link } from 'react-router-dom';
//Linkit eri peleihin
const GameSelect = () => {
  return (
    <>
      <div className='gameSelect'>
        <div className='gameCard'>
          <Link to={'/matchgame'}>MatchGame</Link>
        </div>
      </div>
    </>
  );
};

export default GameSelect;
