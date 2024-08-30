"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const itWordRouter_1 = __importDefault(require("./src/routes/itWordRouter"));
const userRouter_1 = __importDefault(require("./src/routes/userRouter"));
const loginRouter_1 = __importDefault(require("./src/routes/loginRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Palauttaa oikean puolen vasemman ollessa null tai undefined, muussa tapauksessa palauttaa vasemman
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000";
app.get("/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
});
app.use("/api/itWords", itWordRouter_1.default);
app.use("/api/users", userRouter_1.default);
app.use("/login", loginRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
