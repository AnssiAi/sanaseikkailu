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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSecurePlayerUser = exports.toPlayerUser = exports.toNewPlayerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isNumber = (value) => {
    return typeof value === 'number' || value instanceof Number;
};
const isObjectId = (value) => {
    return value instanceof mongodb_1.ObjectId;
};
const parseString = (value) => {
    if (!isString(value) || value.length === 0) {
        throw new Error('Incorrect or missing value.');
    }
    return value;
};
const parseNumber = (value) => {
    if (!isNumber(value)) {
        throw new Error('Incorrect or missing value');
    }
    return value;
};
const parseObjectId = (value) => {
    if (!isObjectId(value)) {
        throw new Error('Incorrect or missing value');
    }
    return value.toString();
};
const createPassword = (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isString(value) || value.length === 0) {
        throw new Error('Incorrect or missing value.');
    }
    const hashValue = yield bcrypt_1.default.hash(value, 10);
    return hashValue;
});
const toNewPlayerUser = (object) => __awaiter(void 0, void 0, void 0, function* () {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data.');
    }
    if ('username' in object && 'password' in object && 'points' in object) {
        const hashedPassword = yield createPassword(object.password);
        const newUser = {
            username: parseString(object.username),
            password: hashedPassword,
            points: parseNumber(object.points),
        };
        return newUser;
    }
    throw new Error('Incorrect data: Missing fields');
});
exports.toNewPlayerUser = toNewPlayerUser;
const toPlayerUser = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data.');
    }
    if ('_id' in object &&
        'username' in object &&
        'password' in object &&
        'points' in object) {
        const playerUser = {
            id: parseObjectId(object._id),
            username: parseString(object.username),
            password: parseString(object.password),
            points: parseNumber(object.points),
        };
        return playerUser;
    }
    throw new Error('Incorrect data: Missing fields');
};
exports.toPlayerUser = toPlayerUser;
const toSecurePlayerUser = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data.');
    }
    if ('username' in object && 'points' in object) {
        const secureUser = {
            username: parseString(object.username),
            points: parseNumber(object.points),
        };
        return secureUser;
    }
    throw new Error('Incorrect data: Missing fields');
};
exports.toSecurePlayerUser = toSecurePlayerUser;
