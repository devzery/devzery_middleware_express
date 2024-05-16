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
const axios_1 = __importDefault(require("axios"));
const querystring_1 = require("querystring");
function devzeryMiddleware(config) {
    const { apiEndpoint = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add', apiKey, sourceName } = config;
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        // Wrap the original send method to capture the response content
        const originalSend = res.send;
        let responseContent;
        res.send = function (content) {
            responseContent = content;
            return originalSend.call(this, content);
        };
        // Call the next middleware/route handler
        yield next();
        const elapsedTime = Date.now() - startTime;
        const headers = Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('http_') || ['content-length', 'content-type'].includes(key)));
        let body;
        if (req.is('application/json')) {
            body = req.body;
        }
        else if (req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
            body = (0, querystring_1.parse)(req.body.toString());
        }
        else {
            body = null;
        }
        try {
            const responseContentString = responseContent.toString();
            responseContent = JSON.parse(responseContentString);
        }
        catch (_a) {
            responseContent = null;
        }
        const data = {
            request: {
                method: req.method,
                path: req.originalUrl,
                headers,
                body,
            },
            response: {
                statusCode: res.statusCode,
                content: responseContent,
            },
            elapsedTime,
        };
        console.log("Devzery:", data);
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                if (apiKey && sourceName && responseContent !== null) {
                    const headers = {
                        'x-access-token': apiKey,
                        'source-name': sourceName,
                    };
                    console.log("Devzery Sending:", data);
                    yield axios_1.default.post(apiEndpoint, data, { headers });
                }
                else if (!apiKey || !sourceName) {
                    console.log('Devzery: No API Key or Source given!');
                }
                else {
                    console.log(`Devzery: Skipping Hit ${req.originalUrl}`);
                }
            }
            catch (error) {
                console.error(`Error occurred while sending data to API endpoint: ${error}`);
            }
        }))();
    });
}
exports.default = devzeryMiddleware;
