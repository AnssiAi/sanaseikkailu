import { Request, Response, Router } from "express";
//import jwt from "jsonwebtoken";
import {
  addPlayerUser,
  verifyUniqueName,
  getSecureUsers,
  getUserById,
  updatePlayerUserPoints,
} from "../services/mongoService";
import { NewPlayerUser, SecurePlayerUser } from "../../types";
import { toNewPlayerUser } from "../../typeParsers";

const router: Router = Router();

/*
let secret: string;
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  throw new Error("SECRET environment variable is not set");
}

const processToken = (req: Request) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const decodedToken = jwt.verify(token, secret);
  }
  throw new Error("malformatted credentials");
};
*/

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
    if (!_req.body.username || !_req.body.password) {
      throw new Error("Missing username or password");
    }
    const nameInUse = await verifyUniqueName(_req.body.username);
    if (nameInUse === true) {
      throw new Error("Create a unique name");
    }
    const newUser: NewPlayerUser = await toNewPlayerUser(_req.body);
    const addedUser: SecurePlayerUser = await addPlayerUser(newUser);
    res.status(200).send(addedUser);
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
    /*
    if (!_req.get("authorization")) {
      throw new Error("Missing credentials");
    }
      */
    if (!_req.body.points) {
      throw new Error("Missing points");
    }

    const { points } = _req.body;
    const user: SecurePlayerUser = await updatePlayerUserPoints(id, points);

    res.status(200).send(user);
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(500).send(errorMessage);
  }
});

export default router;
