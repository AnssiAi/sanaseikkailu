import "dotenv/config";
import { Db, MongoClient, Collection, ObjectId } from "mongodb";
import { GameWord, NewPlayerUser, SecurePlayerUser } from "../../types";
import { toSecurePlayerUser } from "../../typeParsers";

//Ehtolauseella käsitellään undefined mahdollisuus.
let connect: string;
if (process.env.DB_CONN_STRING) {
  connect = process.env.DB_CONN_STRING;
} else {
  throw new Error("DB_CONN_STRING environment variable is not set");
}

let dbName: string;
if (process.env.DB_NAME) {
  dbName = process.env.DB_NAME;
} else {
  throw new Error("DB_NAME environment variable is not set");
}

let userCollection: string;
if (process.env.USER_COLLECTION_NAME) {
  userCollection = process.env.USER_COLLECTION_NAME;
} else {
  throw new Error("USER_COLLECTION_NAME environment variable is not set");
}

const client: MongoClient = new MongoClient(connect);

const createDbConnection = async (collection: string): Promise<Collection> => {
  await client.connect();
  const db: Db = client.db(dbName);
  return db.collection(collection);
};

export const getAllWords = async (collection: string): Promise<GameWord[]> => {
  const data = (await createDbConnection(collection)).find({});
  const dataArray = await data.toArray();

  return dataArray.map(({ fin, sve, en }) => ({
    fin,
    sve,
    en,
  }));
};

export const getSecureUsers = async (): Promise<SecurePlayerUser[]> => {
  const data = (await createDbConnection(userCollection)).find({});
  const dataArray = await data.toArray();

  return dataArray.map(({ username, points }) => ({
    username,
    points,
  }));
};

//Käytetään parsereita oikean tyypin saamiseksi
export const getUserById = async (id: string): Promise<SecurePlayerUser> => {
  const result: Promise<SecurePlayerUser> = (
    await createDbConnection(userCollection)
  )
    .findOne({
      _id: new ObjectId(id),
    })
    .then(data => {
      const result: SecurePlayerUser = toSecurePlayerUser(data);
      return result;
    })
    .catch(err => {
      throw Error(err);
    });
  return result;
};

export const addPlayerUser = async (
  entry: NewPlayerUser
): Promise<SecurePlayerUser> => {
  const result: Promise<SecurePlayerUser> = (
    await createDbConnection(userCollection)
  )
    .insertOne(entry)
    .then(async data => {
      const result: SecurePlayerUser = await getUserById(
        data.insertedId.toString()
      );
      return result;
    })
    .catch(err => {
      throw Error(err);
    });
  return result;
};

export const updatePlayerUserPoints = async (
  id: string,
  points: number
): Promise<SecurePlayerUser> => {
  const result: Promise<SecurePlayerUser> = (
    await createDbConnection(userCollection)
  )
    .updateOne({ _id: new ObjectId(id) }, { $set: { points: points } })
    .then(async () => {
      const updatedPlayer: SecurePlayerUser = await getUserById(id);
      return updatedPlayer;
    })
    .catch(err => {
      throw Error(err);
    });
  return result;
};

export const verifyUniqueName = async (name: string): Promise<boolean> => {
  const result: Promise<boolean> = (await createDbConnection(userCollection))
    .findOne({
      username: name,
    })
    .then(data => {
      let result = false;
      if (data) {
        result = true;
      }
      return result;
    })
    .catch(err => {
      throw Error(err);
    });

  return result;
};
