import { Request, Response, NextFunction } from 'express';
import { DevzeryConfig, DevzeryRequestContext, DevzeryResponseContext } from './types';
import multer from 'multer';
import bodyParser from 'body-parser';
import { DevzeryLogger } from './DevzeryLogger';

// Configure multer for file uploads
const upload = multer();

/**
 * Creates an Express middleware for logging request and response data
 * @param config Configuration for Devzery logging service
 * @returns Express middleware function
 */
export default function devzeryMiddleware(config: DevzeryConfig) {
  const devzeryLogger = new DevzeryLogger(config);

  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Capture the original send method
    const originalSend = res.send;
    let responseContent: any;

    // Override send method to capture response content
    res.send = function(content: any) {
      responseContent = content;
      const result = originalSend.call(this, content);
      
      // Process and send log after response is sent
      processAndSendLog();
      
      return result;
    };

    /**
     * Processes and sends log data to Devzery service
     */
    function processAndSendLog() {
      // Prepare request context
      const requestContext: DevzeryRequestContext = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        isMultipart: req.is('multipart/form-data') ? true : false
      };

      // Prepare response context
      const responseContext: DevzeryResponseContext = {
        statusCode: res.statusCode,
        payload: responseContent
      };

      // Prepare and send log data
      const logData = devzeryLogger.processLogData(
        requestContext, 
        responseContext, 
        startTime
      );

      devzeryLogger.sendLog(logData).catch(console.error);
    }

    // Middleware to parse request body
    bodyParser.json()(req, res, (err) => {
      if (err) {
        console.error('Error parsing JSON:', err);
        return res.status(400).json({ error: 'Bad Request' });
      }

      // Handle file uploads
      upload.any()(req, res, async (err) => {
        if (err) {
          console.error('Error parsing form data:', err);
          return res.status(400).json({ error: 'Bad Request' });
        }

        // Process the request
        try {
          await next();
        } catch (error) {
          console.error('Request processing error:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    });
  };
}