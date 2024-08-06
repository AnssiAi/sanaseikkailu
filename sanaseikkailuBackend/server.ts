import express from "express";
import "dotenv/config";
import itRouter from "./src/routes/itWordRouter";

const app = express();
app.use(express.json());

//Palauttaa oikean puolen vasemman ollessa null tai undefined, muussa tapauksessa palauttaa vasemman
const PORT: string = process.env.PORT ?? "3000";

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/itWords", itRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
