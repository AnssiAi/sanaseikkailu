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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoService_1 = require("../services/mongoService");
const router = (0, express_1.Router)();
let secret;
if (process.env.SECRET) {
    secret = process.env.SECRET;
}
else {
    throw new Error("SECRET environment variable is not set");
}
router.post("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!_req.body.username || !_req.body.password) {
            throw new Error("Missing username or password");
        }
        const foundUser = yield (0, mongoService_1.getUserByName)(_req.body.username);
        const match = yield bcrypt_1.default.compare(_req.body.password, foundUser.password);
        if (match) {
            const token = jsonwebtoken_1.default.sign({
                username: foundUser.username,
            }, secret, { expiresIn: 60 * 60 });
            const loggedUser = {
                username: foundUser.username,
                points: foundUser.points,
                token: token,
            };
            res.status(200).send(loggedUser);
        }
        else {
            throw new Error("Wrong username or password");
        }
    }
    catch (error) {
        let errorMessage = "Error: ";
        if (error instanceof Error) {
            errorMessage += error.message;
        }
        res.status(500).send(errorMessage);
    }
}));
exports.default = router;
