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
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const upload = (0, multer_1.default)();
function devzeryMiddleware(config) {
    const { apiEndpoint = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add', apiKey, sourceName } = config;
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        // Wrap the original send method to capture the response content
        const originalSend = res.send;
        console.log("Original Send ", originalSend);
        let responseContent;
        let headers;
        let body;
        res.send = function (content) {
            responseContent = content;
            const result = originalSend.call(this, content);
            onResponseSent();
            processResponseContent();
            return result;
        };
        function onResponseSent() {
            const elapsedTime = Date.now() - startTime;
            const headers = Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('http_') || ['content-length', 'content-type'].includes(key)));
        }
        function processResponseContent() {
            const responseContentString = responseContent !== undefined ? responseContent.toString() : '';
            const data = {
                request: {
                    method: req.method,
                    path: req.originalUrl,
                    headers,
                    body,
                },
                response: {
                    statusCode: res.statusCode,
                    content: responseContentString,
                },
                elapsedTime: Date.now() - startTime,
            };
            // console.log("Devzery:", data);
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (apiKey && sourceName && responseContentString !== null) {
                        const headers = {
                            'x-access-token': apiKey,
                            'source-name': sourceName,
                        };
                        // console.log("Devzery Sending:", data);
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
        }
        // Parse JSON request body
        body_parser_1.default.json()(req, res, (err) => {
            if (err) {
                console.error('Error occurred while parsing JSON:', err);
                return res.status(400).json({ error: 'Bad Request' });
            }
            // Parse form data using multer middleware
            upload.any()(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error('Error occurred while parsing form data:', err);
                    return res.status(400).json({ error: 'Bad Request' });
                }
                // Call the next middleware/route handler
                try {
                    yield next();
                }
                catch (error) {
                    console.error('Error occurred during request processing:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const elapsedTime = Date.now() - startTime;
                headers = Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('http_') || ['content-length', 'content-type'].includes(key)));
                if (req.is('application/json')) {
                    body = req.body;
                }
                else if (req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
                    body = req.body;
                }
                else {
                    body = null;
                }
            }));
        });
    });
}
exports.default = devzeryMiddleware;
