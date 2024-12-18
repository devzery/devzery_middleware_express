"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var devzeryMiddleware_exports = {};
__export(devzeryMiddleware_exports, {
  default: () => devzeryMiddleware
});
module.exports = __toCommonJS(devzeryMiddleware_exports);
var import_multer = __toESM(require("multer"));
var import_body_parser = __toESM(require("body-parser"));
var import_DevzeryLogger = require("./DevzeryLogger");
const upload = (0, import_multer.default)();
function devzeryMiddleware(config) {
  const devzeryLogger = new import_DevzeryLogger.DevzeryLogger(config);
  return async (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    let responseContent;
    res.send = function(content) {
      responseContent = content;
      const result = originalSend.call(this, content);
      processAndSendLog();
      return result;
    };
    function processAndSendLog() {
      const requestContext = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        isMultipart: req.is("multipart/form-data") ? true : false
      };
      const responseContext = {
        statusCode: res.statusCode,
        payload: responseContent
      };
      const logData = devzeryLogger.processLogData(
        requestContext,
        responseContext,
        startTime
      );
      devzeryLogger.sendLog(logData).catch(console.error);
    }
    import_body_parser.default.json()(req, res, (err) => {
      if (err) {
        console.error("Error parsing JSON:", err);
        return res.status(400).json({ error: "Bad Request" });
      }
      upload.any()(req, res, async (err2) => {
        if (err2) {
          console.error("Error parsing form data:", err2);
          return res.status(400).json({ error: "Bad Request" });
        }
        try {
          await next();
        } catch (error) {
          console.error("Request processing error:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  };
}
