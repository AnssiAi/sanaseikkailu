import "dotenv/config";
import { Db, MongoClient, Collection } from "mongodb";
import { GameWord } from "../../types";

//Ehtolauseella käsitellään undefined mahdollisuus.
let connect: string;
if (process.env.DB_CONN_STRING) {
  connect = process.env.DB_CONN_STRING;
} else {
  throw new Error("DB_CONN_STRING environment variable is not set");
}
const client: MongoClient = new MongoClient(connect);

let dbName: string;
if (process.env.DB_NAME) {
  dbName = process.env.DB_NAME;
} else {
  throw new Error("DB_NAME environment variable is not set");
}
//Palautetaan kun käytetään
/*
let userCollection: string;
if (process.env.USER_COLLECTION_NAME) {
  userCollection = process.env.USER_COLLECTION_NAME;
} else {
  throw new Error("USER_COLLECTION_NAME environment variable is not set");
}
  */

const createDbConnection = async (collection: string): Promise<Collection> => {
  await client.connect();
  const db: Db = client.db(dbName);
  return db.collection(collection);
};

const getAllWords = async (collection: string): Promise<GameWord[]> => {
  const data = (await createDbConnection(collection)).find({});
  const dataArray = await data.toArray();

  return dataArray.map(({ fin, sve, en }) => ({
    fin,
    sve,
    en,
  }));
};
/*
//Käyttäjän tiedot
const getUser = async (id: string, onError, onSuccess) => {
  return sendQuery(
    (await createDbConnection(userCollection)).find({
      _id: new ObjectId(`${id}`),
    }),
    onError,
    onSuccess,
    true
  );
};

const getUserByName = async (name: string, onError, onSuccess) => {
  return sendQuery(
    (await createDbConnection(userCollection)).find({
      Name: name,
    }),
    onError,
    onSuccess,
    true
  );
};

const addUser = async (
  { username, password, points }: NewPlayerUser,
  onError,
  onSuccess
) => {
  return sendQuery(
    (await createDbConnection(userCollection)).insertOne({
      Name: username,
      Password: password,
      Points: points,
    }),
    onError,
    onSuccess
  );
};

const updateUserPoints = async (
  { id, points }: PlayerUser,
  onError,
  onSuccess
) => {
  return sendQuery(
    (await createDbConnection(userCollection)).findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: { Points: points } },
      {
        upsert: true,
      }
    ),
    onError,
    onSuccess
  );
};
*/
export default getAllWords;
