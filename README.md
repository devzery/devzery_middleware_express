# Devzery Middleware SDK

The Devzery Middleware SDK is a package that allows you to easily integrate request and response logging functionality into your Node.js Express application using the TSOA framework.

## Installation

You can install the Devzery Middleware SDK using npm:

```bash
npm install https://github.com/devzery/devzery_middleware_express
```

## Usage

To use the Devzery Middleware SDK in your Express application, follow these steps:

1. Import the `devzeryMiddleware` function from the package:

   ```typescript
   import devzeryMiddleware from 'devzery_middleware_express';
   ```

2. Configure the middleware with your Devzery API endpoint, API key, and source name:

   ```typescript
   const devzeryConfig = {
     apiEndpoint: 'ENDPOINT', //OPTIONAL FOR DEVELOPMENT/TEST ONLY
     apiKey: 'YOUR_API_KEY',
     sourceName: 'YOUR_SOURCE_NAME',
   };
   ```


   Replace `'YOUR_API_KEY'` with your actual Devzery API key and `'YOUR_SOURCE_NAME'` with a name to identify your application as the source of the logged data.

3. Apply the middleware to your Express application:

   ```typescript
   app.use(devzeryMiddleware(devzeryConfig));
   ```

   Make sure to apply the middleware before defining your routes.

4. Run your Express application

   The Devzery Middleware SDK will now capture the request and response data for each incoming request and send it to the specified Devzery API endpoint.

   ### OR


   ```javascript
    const express = require('express');
    const devzeryMiddleware = require('devzery_middleware_express').default;

    const app = express();

    const devzeryConfig = {
    apiEndpoint: 'ENDPOINT URL', //OPTIONAL FOR DEVELOPMENT/TEST ONLY
    apiKey: 'YOUR_API_KEY',
    sourceName: 'YOUR_SOURCE_NAME',
    };

    app.use(devzeryMiddleware(devzeryConfig));

    app.get('/', (req, res) => {
    res.send('Hello, world!');
    });

    app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });
   ```

## Configuration

The `devzeryMiddleware` function accepts an optional configuration object with the following properties:

- `apiKey` : Your Devzery API key for authentication.
- `sourceName` : A name to identify your application as the source of the logged data.

If the `apiKey` or `sourceName` is not provided, the middleware will log a warning message and skip sending data to the API endpoint.

## TypeScript Support

The Devzery Middleware SDK is written in TypeScript and provides type definitions for enhanced development experience. Make sure to have TypeScript installed and configured in your project to benefit from type checking and autocompletion.

## Logging

The middleware logs the captured request and response data to the console for debugging purposes. It also logs any errors that occur while sending data to the Devzery API endpoint.

