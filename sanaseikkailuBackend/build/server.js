"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const colRouter_1 = __importDefault(require("./src/routes/colRouter"));
const itWordRouter_1 = __importDefault(require("./src/routes/itWordRouter"));
const userRouter_1 = __importDefault(require("./src/routes/userRouter"));
const loginRouter_1 = __importDefault(require("./src/routes/loginRouter"));
const corsOptions = {
    origin: 'http://localhost:5173',
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.static('dist'));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3001';
app.use('/api/col', colRouter_1.default);
app.use('/api/it', itWordRouter_1.default);
app.use('/api/users', userRouter_1.default);
app.use('/login', loginRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
