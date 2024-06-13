import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import multer from 'multer';
import bodyParser from 'body-parser';

// ... (DevzeryConfig interface remains the same)
interface DevzeryConfig {
  apiEndpoint?: string;
  apiKey?: string;
  sourceName?: string;
}

const upload = multer();

export default function devzeryMiddleware(config: DevzeryConfig) {
  const { apiEndpoint = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add', apiKey, sourceName } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Wrap the original send method to capture the response content
    const originalSend = res.send;
    console.log("Original Send ", originalSend)
    let responseContent: any;
    

    res.send = function (content) {
      console.log("Content res.send ", content)
      responseContent = content;
      const result = originalSend.call(this, content);
      onResponseSent();
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
        const headers = Object.fromEntries(
          Object.entries(req.headers).filter(([key]) =>
            key.startsWith('http_') || ['content-length', 'content-type'].includes(key)
          )
        );

        let body: any;
        if (req.is('application/json')) {
          body = req.body;
        } else if (req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
          body = req.body;
        } else {
          body = null;
        }

        let responseContentString: string;
        console.log(typeof responseContent)
        if (typeof responseContent === 'string') {
          responseContentString = responseContent;
        } else if (Buffer.isBuffer(responseContent)) {
          responseContentString = responseContent.toString('utf-8');
        } else if (typeof responseContent === 'object') {
          responseContentString = JSON.stringify(responseContent);
        } else {
          responseContentString = responseContent.toString();
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
            content: responseContentString,
          },
          elapsedTime,
        };

        console.log("Devzery:", data);

        (async () => {
          try {
            if (apiKey && sourceName && responseContentString !== null) {
              const headers = {
                'x-access-token': apiKey,
                'source-name': sourceName,
              };
              console.log("Devzery Sending:", data);
              await axios.post(apiEndpoint, data, { headers });
            } else if (!apiKey || !sourceName) {
              console.log('Devzery: No API Key or Source given!');
            } else {
              console.log(`Devzery: Skipping Hit ${req.originalUrl}`);
            }
          } catch (error) {
            console.error(`Error occurred while sending data to API endpoint: ${error}`);
          }
        })();
      });
    });
  };
}