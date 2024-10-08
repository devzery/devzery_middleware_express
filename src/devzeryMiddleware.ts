import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import multer from 'multer';
import bodyParser from 'body-parser';

// ... (DevzeryConfig interface remains the same)
interface DevzeryConfig {
  apiEndpoint?: string;
  apiKey?: string;
  serverName?: string;
}

const upload = multer();

export default function devzeryMiddleware(config: DevzeryConfig) {
  const { apiEndpoint = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add', apiKey, serverName } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Wrap the original send method to capture the response content
    const originalSend = res.send;
    let responseContent: any;
    let headers: any;
    let body: any;
    

    res.send = function (content) {
      responseContent = content;
      const result = originalSend.call(this, content);
      onResponseSent();
      processResponseContent();
      return result;
    };
    function onResponseSent() {
      const elapsedTime = Date.now() - startTime;
      const headers = Object.fromEntries(
        Object.entries(req.headers).filter(([key]) =>
          key.startsWith('http_') || ['content-length', 'content-type'].includes(key)
        )
      );
    }
    function processResponseContent() {
      const responseContentString = responseContent !== undefined ? responseContent : {};

      const data = {
        request: {
          method: req.method,
          path: req.originalUrl,
          headers: req.headers,
          body: req.body,
        },
        response: {
          status_code: res.statusCode,
          content: responseContentString,
        },
        elapsed_time:Date.now() - startTime,
      };

      (async () => {
        try {
          if (apiKey && serverName && responseContentString !== null) {
            const headers = {
              'x-access-token': apiKey,
              'source-name': serverName,
            };
            await axios.post(apiEndpoint, data, { headers });
          } else if (!apiKey || !serverName) {
            console.log('Devzery: No API Key or Source given!');
          } else {
            console.log(`Devzery: Skipping Hit ${req.originalUrl}`);
          }
        } catch (error) {
          console.error(`Error occurred while sending data to API endpoint: ${error}`);
        }
      })();
    }


    // Parse JSON request body
    bodyParser.json()(req, res, (err) => {
      if (err) {
        console.error('Error occurred while parsing JSON:', err);
        return res.status(400).json({ error: 'Bad Request' });
      }

      // Parse form data using multer middleware
      upload.any()(req, res, async (err) => {
        if (err) {
          console.error('Error occurred while parsing form data:', err);
          return res.status(400).json({ error: 'Bad Request' });
        }

        // Call the next middleware/route handler
        try {
          await next();
        } catch (error) {
          console.error('Error occurred during request processing:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const elapsedTime = Date.now() - startTime;
        headers = Object.fromEntries(
          Object.entries(req.headers).filter(([key]) =>
            key.startsWith('http_') || ['content-length', 'content-type'].includes(key)
          )
        );

        if (req.is('application/json')) {
          body = req.body;
        } else if (req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
          body = req.body;
        } else {
          body = null;
        }
       
      });
    });
  };
}

export { devzeryMiddleware, DevzeryConfig };