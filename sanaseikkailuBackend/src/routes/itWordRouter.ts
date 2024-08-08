import { Request, Response, Router } from "express";
import { getAllWords } from "../services/mongoService";
import { GameWord } from "../../types";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const itCollection = process.env.IT_COLLECTION_NAME;
    if (!itCollection) {
      throw Error("No environment variable for this collection");
    }
    const wordList: GameWord[] = await getAllWords(itCollection);
    res.status(200).send(wordList);
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

export default router;
