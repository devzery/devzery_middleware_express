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
var DevzeryLogger_exports = {};
__export(DevzeryLogger_exports, {
  DevzeryLogger: () => DevzeryLogger
});
module.exports = __toCommonJS(DevzeryLogger_exports);
var import_axios = __toESM(require("axios"));
class DevzeryLogger {
  constructor(config) {
    this.config = {
      apiEndpoint: config.apiEndpoint || "https://server-v3-7qxc7hlaka-uc.a.run.app/api/add",
      apiKey: config.apiKey,
      serverName: config.serverName
    };
  }
  /**
   * Sends log data to the configured Devzery endpoint
   * @param logData Structured log data to be sent
   */
  async sendLog(logData) {
    const { apiEndpoint, apiKey, serverName } = this.config;
    if (!apiKey || !serverName) {
      console.log("Devzery: No API Key or Source Name provided!");
      return;
    }
    try {
      await import_axios.default.post(apiEndpoint, {
        ...logData
      }, {
        headers: {
          "x-access-token": apiKey,
          "source-name": serverName
        }
      });
    } catch (error) {
      console.error(`Devzery: Error sending log data - ${error instanceof Error ? error.message : error}`);
    }
  }
  /**
   * Filters and prepares request headers for logging
   * @param headers Original request headers
   * @returns Filtered headers object
   */
  static filterHeaders(headers) {
    return Object.fromEntries(
      Object.entries(headers).filter(
        ([key]) => key.startsWith("http_") || ["content-length", "content-type"].includes(key)
      )
    );
  }
  /**
   * Determines the request body based on content type
   * @param context Request context containing headers and body
   * @returns Parsed request body or null
   */
  static determineRequestBody(context) {
    const contentType = context.headers["content-type"];
    if (contentType?.includes("application/json")) {
      return context.body;
    }
    if (context.isMultipart || contentType?.includes("multipart/form-data")) {
      return context.body;
    }
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      return context.body;
    }
    return null;
  }
  /**
   * Processes and prepares log data for sending
   * @param context Request context
   * @param responseContext Response context
   * @param startTime Request start time
   * @returns Prepared log data
   */
  processLogData(context, responseContext, startTime) {
    const responseContent = responseContext.payload !== void 0 ? typeof responseContext.payload === "string" ? responseContext.payload : JSON.stringify(responseContext.payload) : {};
    return {
      request: {
        method: context.method,
        path: context.url,
        headers: DevzeryLogger.filterHeaders(context.headers),
        body: DevzeryLogger.determineRequestBody(context)
      },
      response: {
        status_code: responseContext.statusCode,
        content: responseContent
      },
      elapsed_time: Date.now() - startTime
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DevzeryLogger
});
