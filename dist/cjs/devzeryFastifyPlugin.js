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
var devzeryFastifyPlugin_exports = {};
__export(devzeryFastifyPlugin_exports, {
  default: () => devzeryFastifyPlugin
});
module.exports = __toCommonJS(devzeryFastifyPlugin_exports);
var import_DevzeryLogger = require("./DevzeryLogger");
var import_multipart = __toESM(require("@fastify/multipart"));
async function devzeryFastifyPlugin(fastify, config) {
  const devzeryLogger = new import_DevzeryLogger.DevzeryLogger(config);
  try {
    if (!fastify.hasDecorator("multipartErrors")) {
      await fastify.register(import_multipart.default);
    }
  } catch (err) {
    console.warn("Failed to register multipart plugin:", err instanceof Error ? err.message : "Unknown error");
  }
  fastify.addHook("onRequest", async (request, reply) => {
    request.devzeryStartTime = Date.now();
  });
  fastify.addHook("onSend", async (request, reply, payload) => {
    const startTime = request.devzeryStartTime;
    const requestContext = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      isMultipart: request.isMultipart()
    };
    const responseContext = {
      statusCode: reply.statusCode,
      payload
    };
    const logData = devzeryLogger.processLogData(
      requestContext,
      responseContext,
      startTime
    );
    devzeryLogger.sendLog(logData).catch(console.error);
  });
}
