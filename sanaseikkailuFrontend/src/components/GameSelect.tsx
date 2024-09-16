import { Link } from 'react-router-dom';
//Linkit eri peleihin
const GameSelect = () => {
  return (
    <>
      <div>
        <Link to={'/matchgame'}>MatchGame</Link>
      </div>
    </>
  );
};

export default GameSelect;
