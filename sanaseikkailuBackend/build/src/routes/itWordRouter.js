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
const express_1 = require("express");
const mongoService_1 = require("../services/mongoService");
const router = (0, express_1.Router)();
const itCollection = process.env.IT_COLLECTION_NAME;
if (!itCollection) {
    throw Error("No environment variable for this collection");
}
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wordList = yield (0, mongoService_1.getAllWords)(itCollection);
        res.status(200).send(wordList);
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
