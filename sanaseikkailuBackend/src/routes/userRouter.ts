import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {
  addPlayerUser,
  verifyUniqueName,
  getSecureUsers,
  getUserById,
  updatePlayerUserPoints,
} from "../services/mongoService";
import { LoggedPlayerUser, NewPlayerUser, SecurePlayerUser } from "../../types";
import { toNewPlayerUser } from "../../typeParsers";

const router: Router = Router();

let secret: string;
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  throw new Error("SECRET environment variable is not set");
}

const processToken = async (
  auth: string
): Promise<string | jwt.JwtPayload | undefined> => {
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token: string = auth.substring(7);
    let decodedToken: string | jwt.JwtPayload | undefined;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        throw new Error(err.message);
      }
      decodedToken = decoded;
    });
    return decodedToken;
  }
  throw new Error("malformatted credentials");
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const userList: SecurePlayerUser[] = await getSecureUsers();

    res.status(200).send(userList);
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.post("/", async (_req: Request, res: Response) => {
  try {
    //json kenttää arvolla 0 ei tunnisteta. Vaadittujen avainten läsnäolo tarkastetaan vertailemalla taulukoita
    const neededKeys: string[] = ["username", "password", "points"];
    const bodyKeys: string[] = Object.keys(_req.body);
    if (bodyKeys.every(i => neededKeys.includes(i))) {
      throw new Error("Missing fields");
    }
    const nameInUse = await verifyUniqueName(_req.body.username);
    if (nameInUse === true) {
      throw new Error("Create a unique name");
    }
    const newUser: NewPlayerUser = await toNewPlayerUser(_req.body);
    const addedUser: SecurePlayerUser = await addPlayerUser(newUser);

    //Kirjaudutaan sisään luodessa käyttäjä
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
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.get("/:id", async (_req: Request, res: Response) => {
  try {
    const id = _req.params.id;
    const user: SecurePlayerUser = await getUserById(id);

    res.status(200).send(user);
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.put("/:id", async (_req: Request, res: Response) => {
  try {
    const id = _req.params.id;
    const authHeader = _req.get("authorization");
    if (!authHeader) {
      throw new Error("Missing credentials");
    }
    if (!_req.body.points) {
      throw new Error("Missing points");
    }

    const authorized = await processToken(authHeader);
    if (authorized) {
      const { points } = _req.body;
      const user: SecurePlayerUser = await updatePlayerUserPoints(id, points);
      res.status(200).send(user);
    }
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

export default router;
