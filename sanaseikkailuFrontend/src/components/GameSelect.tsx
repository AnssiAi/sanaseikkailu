import { Link } from "react-router-dom";

const GameSelect = () => {
  return (
    <>
      <div>
        <p>App</p>
        <Link to={"/matchgame"}>MatchGame</Link>
      </div>
    </>
  );
};

export default GameSelect;
