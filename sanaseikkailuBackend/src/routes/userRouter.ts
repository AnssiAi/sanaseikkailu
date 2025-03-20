import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  addPlayerUser,
  verifyUniqueName,
  updatePlayerUserPoints,
} from '../services/mongoService';
import {
  LoggedPlayerUser,
  NewPlayerUser,
  SecurePlayerUser,
  UserParameters,
} from '../../types';
import { toNewPlayerUser } from '../../typeParsers';

const router: Router = Router();

let secret: string;
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  throw new Error('SECRET environment variable is not set');
}

const processToken = async (
  token: string
): Promise<string | jwt.JwtPayload | undefined> => {
  if (token) {
    let decodedToken: string | jwt.JwtPayload | undefined;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        throw new Error(err.message);
      }
      decodedToken = decoded;
    });
    return decodedToken;
  }
  throw new Error('malformatted credentials');
};

router.post('/', async (_req: Request, res: Response) => {
  try {
    //json kenttää arvolla 0 ei tunnisteta. Vaadittujen avainten läsnäolo tarkastetaan vertailemalla enumiin
    const bodyKeys: string[] = Object.keys(_req.body);
    if (bodyKeys.every((i) => i in UserParameters)) {
      throw new Error('Missing fields');
    }
    const nameInUse: boolean = await verifyUniqueName(_req.body.username);
    if (nameInUse === true) {
      throw new Error('Create a unique name');
    }
    const newUser: NewPlayerUser = await toNewPlayerUser(_req.body);
    const addedUser: SecurePlayerUser = await addPlayerUser(newUser);

    const token: string = jwt.sign(
      {
        username: addedUser.username,
      },
      secret,
      { expiresIn: 60 * 60 }
    );
    const loggedUser: LoggedPlayerUser = {
      username: addedUser.username,
      points: addedUser.points,
      token: token,
    };

    res.status(200).send(loggedUser);
  } catch (error: unknown) {
    let errorMessage = 'Error: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.put('/', async (_req: Request, res: Response) => {
  try {
    if (!_req.body.username || !_req.body.points || !_req.body.token) {
      throw new Error('Missing fields');
    }

    const authorized = await processToken(_req.body.token);
    if (authorized) {
      const { username, points } = _req.body;
      const user: SecurePlayerUser = await updatePlayerUserPoints(username, points);
      res.status(200).send(user);
    }
  } catch (error: unknown) {
    let errorMessage = 'Error: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

export default router;
