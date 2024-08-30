"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUniqueName = exports.updatePlayerUserPoints = exports.addPlayerUser = exports.getUserByName = exports.getUserById = exports.getSecureUsers = exports.getAllWords = void 0;
require("dotenv/config");
const mongodb_1 = require("mongodb");
const typeParsers_1 = require("../../typeParsers");
//Ehtolauseella käsitellään undefined mahdollisuus.
let connect;
if (process.env.DB_CONN_STRING) {
    connect = process.env.DB_CONN_STRING;
}
else {
    throw new Error("DB_CONN_STRING environment variable is not set");
}
let dbName;
if (process.env.DB_NAME) {
    dbName = process.env.DB_NAME;
}
else {
    throw new Error("DB_NAME environment variable is not set");
}
let userCollection;
if (process.env.USER_COLLECTION_NAME) {
    userCollection = process.env.USER_COLLECTION_NAME;
}
else {
    throw new Error("USER_COLLECTION_NAME environment variable is not set");
}
const client = new mongodb_1.MongoClient(connect);
const createDbConnection = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    const db = client.db(dbName);
    return db.collection(collection);
});
const getAllWords = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (yield createDbConnection(collection)).find({});
    const dataArray = yield data.toArray();
    return dataArray.map(({ fin, sve, en }) => ({
        fin,
        sve,
        en,
    }));
});
exports.getAllWords = getAllWords;
const getSecureUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = (yield createDbConnection(userCollection)).find({});
    const dataArray = yield data.toArray();
    return dataArray.map(({ username, points }) => ({
        username,
        points,
    }));
});
exports.getSecureUsers = getSecureUsers;
//Käytetään parsereita oikean tyypin saamiseksi
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield createDbConnection(userCollection))
        .findOne({
        _id: new mongodb_1.ObjectId(id),
    })
        .then(data => {
        const result = (0, typeParsers_1.toSecurePlayerUser)(data);
        return result;
    })
        .catch(err => {
        throw Error(err);
    });
    return result;
});
exports.getUserById = getUserById;
const getUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield createDbConnection(userCollection))
        .findOne({
        username: name,
    })
        .then(data => {
        const result = (0, typeParsers_1.toPlayerUser)(data);
        return result;
    })
        .catch(err => {
        throw Error(err);
    });
    return result;
});
exports.getUserByName = getUserByName;
const addPlayerUser = (entry) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield createDbConnection(userCollection))
        .insertOne(entry)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, exports.getUserById)(data.insertedId.toString());
        return result;
    }))
        .catch(err => {
        throw Error(err);
    });
    return result;
});
exports.addPlayerUser = addPlayerUser;
const updatePlayerUserPoints = (name, points) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield createDbConnection(userCollection))
        .updateOne({ username: name }, { $set: { points: points } })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPlayer = (0, typeParsers_1.toSecurePlayerUser)(yield (0, exports.getUserByName)(name));
        return updatedPlayer;
    }))
        .catch(err => {
        throw Error(err);
    });
    return result;
});
exports.updatePlayerUserPoints = updatePlayerUserPoints;
const verifyUniqueName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield createDbConnection(userCollection))
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
});
exports.verifyUniqueName = verifyUniqueName;
