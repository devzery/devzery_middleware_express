import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { parse } from 'querystring';

interface DevzeryConfig {
  apiEndpoint?: string;
  apiKey?: string;
  sourceName?: string;
}

export default function devzeryMiddleware(config: DevzeryConfig) {
  const { apiEndpoint = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add', apiKey, sourceName } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Wrap the original send method to capture the response content
    const originalSend = res.send;
    let responseContent: any;
    res.send = function (content) {
      responseContent = content;
      return originalSend.call(this, content);
    };

    // Call the next middleware/route handler
    await next();

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
      body = parse(req.body.toString());
    } else {
      body = null;
    }

    try {
      const responseContentString = responseContent.toString();
      responseContent = JSON.parse(responseContentString);
    } catch {
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

    (async () => {
      try {
        if (apiKey && sourceName && responseContent !== null) {
          const headers = {
            'x-access-token': apiKey,
            'source-name': sourceName,
          };
          console.log("Devzery Sending:", data)
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
  };
}