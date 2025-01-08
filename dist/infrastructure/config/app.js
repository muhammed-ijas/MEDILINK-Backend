"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
//Routes root
const user_route_1 = __importDefault(require("../router/user-route"));
const service_provider_route_1 = __importDefault(require("../router/service-provider-route"));
const admin_route_1 = __importDefault(require("../router/admin-route"));
const chat_route_1 = __importDefault(require("../router/chat-route"));
const app = (0, express_1.default)();
exports.httpServer = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: process.env.CORS_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
}));
app.use("/api/user", user_route_1.default);
app.use("/api/sp", service_provider_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/chat", chat_route_1.default);
