import multer from "multer";
import bodyParser from "body-parser";
import { DevzeryLogger } from "./DevzeryLogger";
const upload = multer();
function devzeryMiddleware(config) {
  const devzeryLogger = new DevzeryLogger(config);
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
    bodyParser.json()(req, res, (err) => {
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
export {
  devzeryMiddleware as default
};
