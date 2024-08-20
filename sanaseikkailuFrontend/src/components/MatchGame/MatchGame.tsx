import { useEffect, useState } from "react";
import { getWordsFromCollection } from "../../services/wordService";
import { GameSettings, GameWord } from "../../../types";
//Haetaan sanat

const MatchGame = ({ gameSettings }: { gameSettings: GameSettings }) => {
  const [wordData, setWordData] = useState<GameWord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: GameWord[] = await getWordsFromCollection(
          gameSettings.list
        );
        setWordData(data);
      } catch (err: unknown) {
        let errorMessage: string = "Error: ";
        if (err instanceof Error) {
          errorMessage += err.message;
        }
        console.log(errorMessage);
      }
    };
    fetchData();
  }, [gameSettings.list]);

  return (
    <>
      <div>
        <p>MatchGame</p>
        {wordData ? (
          <>
            <p>Sanoja: {wordData.length}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default MatchGame;
