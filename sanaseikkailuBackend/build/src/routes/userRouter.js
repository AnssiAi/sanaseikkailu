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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoService_1 = require("../services/mongoService");
const types_1 = require("../../types");
const typeParsers_1 = require("../../typeParsers");
const router = (0, express_1.Router)();
let secret;
if (process.env.SECRET) {
    secret = process.env.SECRET;
}
else {
    throw new Error('SECRET environment variable is not set');
}
const processToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        let decodedToken;
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                throw new Error(err.message);
            }
            decodedToken = decoded;
        });
        return decodedToken;
    }
    throw new Error('malformatted credentials');
});
router.post('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //json kenttää arvolla 0 ei tunnisteta. Vaadittujen avainten läsnäolo tarkastetaan vertailemalla enumiin
        const bodyKeys = Object.keys(_req.body);
        if (bodyKeys.every((i) => i in types_1.UserParameters)) {
            throw new Error('Missing fields');
        }
        const nameInUse = yield (0, mongoService_1.verifyUniqueName)(_req.body.username);
        if (nameInUse === true) {
            throw new Error('Create a unique name');
        }
        const newUser = yield (0, typeParsers_1.toNewPlayerUser)(_req.body);
        const addedUser = yield (0, mongoService_1.addPlayerUser)(newUser);
        const token = jsonwebtoken_1.default.sign({
            username: addedUser.username,
        }, secret, { expiresIn: 60 * 60 });
        const loggedUser = {
            username: addedUser.username,
            points: addedUser.points,
            token: token,
        };
        res.status(200).send(loggedUser);
    }
    catch (error) {
        let errorMessage = 'Error: ';
        if (error instanceof Error) {
            errorMessage += error.message;
        }
        res.status(500).send(errorMessage);
    }
}));
router.put('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!_req.body.username || !_req.body.points || !_req.body.token) {
            throw new Error('Missing fields');
        }
        const authorized = yield processToken(_req.body.token);
        if (authorized) {
            const { username, points } = _req.body;
            const user = yield (0, mongoService_1.updatePlayerUserPoints)(username, points);
            res.status(200).send(user);
        }
    }
    catch (error) {
        let errorMessage = 'Error: ';
        if (error instanceof Error) {
            errorMessage += error.message;
        }
        res.status(500).send(errorMessage);
    }
}));
exports.default = router;
