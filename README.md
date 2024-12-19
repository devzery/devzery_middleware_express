# Devzery Middleware SDK

The Devzery Middleware SDK is a package that allows you to easily integrate request and response logging functionality into your Node.js Express application using the TSOA framework.

## Installation

You can install the Devzery Middleware SDK using npm or yarn:

```bash
npm install https://github.com/devzery/devzery_middleware_express
```
### OR

```bash
yarn add https://github.com/devzery/devzery_middleware_express
```


## Usage

To use the Devzery Middleware SDK in your Express application, follow these steps:

1. Import the `devzeryMiddleware` function from the package:

   #### Express Typescript/ESM
   ```typescript
   import devzeryMiddleware from 'devzery_middleware_express';
   ```
   #### Express Common Javascript
   ```javascript
   const devzeryMiddleware = require('devzery_middleware_express');
   ```
   #### Fastify Typescript/ESM
   ```typescript
   import { devzeryFastifyPlugin } from 'devzery_middleware_express';
   ```
   #### Fastify Common Javascript
   ```javascript
   const { devzeryFastifyPlugin } = require('devzery_middleware_express');
   ```

2. Configure the middleware with your Devzery API endpoint, API key, and source name:

   ```typescript
   const devzeryConfig = {
     apiKey: 'YOUR_API_KEY',
     serverName: 'YOUR_SOURCE_NAME',
   };
   ```


   Replace `'YOUR_API_KEY'` with your actual Devzery API key and `'YOUR_SOURCE_NAME'` with a name to identify your application as the source of the logged data.

3. Apply the middleware to your Express application:

   #### Express
   ```typescript
   app.use(devzeryMiddleware(devzeryConfig));
   ```
   
   #### Fastify
   ```javascript
   fastify.register(devzeryFastifyPlugin, devzeryConfig);
   ```

   Make sure to apply the middleware before defining your routes.

4. Run your Express application

   The Devzery Middleware SDK will now capture the request and response data for each incoming request and send it to the specified Devzery API endpoint.

## Configuration

The `devzeryMiddleware` function accepts an optional configuration object with the following properties:

- `apiKey` : Your Devzery API key for authentication.
- `serverName` : A name to identify your application as the source of the logged data.

If the `apiKey` or `serverName` is not provided, the middleware will log a warning message and skip sending data to the API endpoint.

## TypeScript Support

The Devzery Middleware SDK is written in TypeScript and provides type definitions for enhanced development experience. Make sure to have TypeScript installed and configured in your project to benefit from type checking and autocompletion.

## Logging

The middleware logs the captured request and response data to the console for debugging purposes. It also logs any errors that occur while sending data to the Devzery API endpoint.

