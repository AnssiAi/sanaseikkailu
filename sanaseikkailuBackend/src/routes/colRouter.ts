import { Request, Response, Router } from 'express';
import { getWordCollections } from '../services/mongoService';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const collections = await getWordCollections();
    res.status(200).send(collections);
  } catch (error: unknown) {
    let errorMessage = 'Error: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

export default router;
