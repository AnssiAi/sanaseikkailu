import getAllWords from "../services/mongoService";
import { Request, Response, Router } from "express";
import { GameWord } from "../../types";

const router: Router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const wordList: GameWord[] = await getAllWords("it");

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
