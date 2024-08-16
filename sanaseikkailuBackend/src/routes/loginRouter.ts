import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByName } from "../services/mongoService";
import { LoggedPlayerUser, PlayerUser } from "../../types";

const router: Router = Router();

let secret: string;
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  throw new Error("SECRET environment variable is not set");
}

router.post("/", async (_req: Request, res: Response) => {
  try {
    if (!_req.body.username || !_req.body.password) {
      throw new Error("Missing username or password");
    }
    const foundUser: PlayerUser = await getUserByName(_req.body.username);

    const match: boolean = await bcrypt.compare(
      _req.body.password,
      foundUser.password
    );
    if (match) {
      const token: string = jwt.sign(
        {
          username: foundUser.username,
        },
        secret
      );

      const loggedUser: LoggedPlayerUser = {
        username: foundUser.username,
        points: foundUser.points,
        token: token,
      };
      res.status(200).send(loggedUser);
    } else {
      throw new Error("Wrong username or password");
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
