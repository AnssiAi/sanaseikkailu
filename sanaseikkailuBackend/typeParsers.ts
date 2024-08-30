import bcrypt from 'bcrypt';
import { NewPlayerUser, PlayerUser, SecurePlayerUser } from './types';
import { ObjectId } from 'mongodb';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' || value instanceof Number;
};

const isObjectId = (value: unknown): value is ObjectId => {
  return value instanceof ObjectId;
};

const parseString = (value: unknown): string => {
  if (!isString(value) || value.length === 0) {
    throw new Error('Incorrect or missing value.');
  }
  return value;
};

const parseNumber = (value: unknown): number => {
  if (!isNumber(value)) {
    throw new Error('Incorrect or missing value');
  }
  return value;
};

const parseObjectId = (value: unknown): string => {
  if (!isObjectId(value)) {
    throw new Error('Incorrect or missing value');
  }
  return value.toString();
};

const createPassword = async (value: unknown): Promise<string> => {
  if (!isString(value) || value.length === 0) {
    throw new Error('Incorrect or missing value.');
  }
  const hashValue: string = await bcrypt.hash(value, 10);
  return hashValue;
};

export const toNewPlayerUser = async (
  object: unknown
): Promise<NewPlayerUser> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.');
  }

  if ('username' in object && 'password' in object && 'points' in object) {
    const hashedPassword = await createPassword(object.password);
    const newUser: NewPlayerUser = {
      username: parseString(object.username),
      password: hashedPassword,
      points: parseNumber(object.points),
    };
    return newUser;
  }
  throw new Error('Incorrect data: Missing fields');
};

export const toPlayerUser = (object: unknown): PlayerUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.');
  }

  if (
    '_id' in object &&
    'username' in object &&
    'password' in object &&
    'points' in object
  ) {
    const playerUser: PlayerUser = {
      id: parseObjectId(object._id),
      username: parseString(object.username),
      password: parseString(object.password),
      points: parseNumber(object.points),
    };

    return playerUser;
  }
  throw new Error('Incorrect data: Missing fields');
};

export const toSecurePlayerUser = (object: unknown): SecurePlayerUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.');
  }

  if ('username' in object && 'points' in object) {
    const secureUser: SecurePlayerUser = {
      username: parseString(object.username),
      points: parseNumber(object.points),
    };
    return secureUser;
  }
  throw new Error('Incorrect data: Missing fields');
};
