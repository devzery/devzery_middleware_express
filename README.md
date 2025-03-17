# Devzery Middleware SDK  

The Devzery Middleware SDK is a package that allows you to easily integrate request and response logging functionality into your **Node.js Express application** using the TSOA framework, which supports applications built with both **TypeScript** and **JavaScript**. 



## 🎯 Purpose of Integration  

The Devzery Middleware SDK helps you:  
- **Monitor API traffic**: Capture detailed logs of requests and responses for all API calls in your application.  
- **Debug efficiently**: Identify issues in real-time by analyzing API behavior through captured logs.  
- **Improve reliability**: Track and monitor API performance across environments (e.g., staging, production).  

By integrating this SDK, you can streamline debugging and enhance observability for your microservices.

**Prerequisites**
- Basic understanding of Node.js and Express.js.
- Familiarity with RESTful API development.
- Installed and configured Node.js environment.

**System Requirements**
- Node.js version: >=18.x
- Express.js version: >=4.18.x
- Internet connectivity to send logs to Devzery.


## 📦 Installation  

Install the SDK via npm: 

```bash  
npm install devzery 
```


## 🛠️ Quick Start Guide

**Step 1:** Import the middleware into your application:

#### Express Applications
>For ES6 -
```js
import devzeryMiddleware from 'devzery_middleware_express';
```

For CommonJS -
```js
const devzeryMiddleware = require('devzery_middleware_express');
```

#### Fastify Applications
```js
const { devzeryFastifyPlugin } = require( 'devzery_middleware_express');
```

**Step 2:** Configure the middleware with your Devzery API endpoint, API key, and server name:
```js 
const devzeryConfig = {
  apiKey: 'YOUR_API_KEY', // Replace with your API key
  serverName: 'YOUR_MICROSERVICE_NAME', // Replace with your microservice name
};
```
Replace **'YOUR_API_KEY'** with your actual Devzery API key and **'YOUR_MICROSERVICE_NAME'** with a name to identify your microservice’s source server.




**Step 3:** Apply the middleware to your Express application:

```js 
app.use(devzeryMiddleware(devzeryConfig));
```

#### Fastify Applications
```js
await fastify.register(fastifyMultipart);
await fastify.register(otherPlugins);

// Then register the Devzery plugin last
await devzeryFastifyPlugin(fastify, devzeryConfig);
```

Make sure to apply the middleware before defining your routes or other middlewares.



**Basic Express Integration Example**

```js 
const express = require('express');
const devzeryMiddleware = require('devzery_middleware_express').default;

const app = express();

const devzeryConfig = {
    apiKey: 'YOUR_API_KEY',
    serverName: 'YOUR_MICROSERVICE_NAME',
};

app.use(devzeryMiddleware(devzeryConfig));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

**Basic Fastify Integration Example**

```js
const { devzeryFastifyPlugin } = require('devzery_middleware_express');
const fastify = require('fastify')();
const port = process.env.SERVER_PORT || 3000;

const devzeryConfig = {
  apiKey: 'YOUR_API_KEY',
  serverName: 'YOUR_SOURCE_NAME'
};

const start = async () => {
  try {
    // Register your application plugins first
    await fastify.register(require('@fastify/multipart'));
    await fastify.register(require('@fastify/cors'));
    
    // Register the Devzery plugin AFTER other plugins
    await devzeryFastifyPlugin(fastify, devzeryConfig);

    // Define your routes
    fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    });

    fastify.post('/data', async (request, reply) => {
      return { status: 'received' }
    });

    // Start the server
    await fastify.listen({ port });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
```


**Step 4:** Run your Express application

- Save all your changes.  
- Open your terminal and navigate to your project directory.  
- Start you application.

The Devzery Middleware SDK will now capture the request and response data for each incoming request and send it to Devzery.


**Step 5:** Verify SDK Integration:

- Start using your application either by interacting with the User Interface or hitting APIs.
- Go back to the Devzery dahsboard and check for the integration status whether it is successful or not.


## ⚙️ Configuration  
Parameters and Payloads
- `apiKey`: Authenticates requests to the Devzery API. 
- `serverName`: Identifies your application’s server in logs. 

| **Prameter**   | **Type**   | **Description**    | **Required**   |
|------------|------------|------------|------------|
| `apiKey` | `String` | Your unique Devzery API key | Yes |
| `serverName` | `String` | Microservice name | Yes |


## 📝 Features and Functionality: 

**Overview of Features**
- Captures request and response data automatically.
- Sends data to Devzery for centralized logging.
- Built-in error handling and debugging logs.

**Detailed Functionality**
- Request Logging: Captures HTTP method, headers, and body.
- Response Logging: Captures status codes, headers, and response body.
- Error Reporting: Logs transmission errors to the console.

## 💡Troubleshooting:

**Verify API Key**:
- Ensure the API key provided is correct and active.  

**Check Microservice Name**:
- Confirm that the server name matches the microservice name and URL being logged. 
 
**Environment Mismatch**:
- Ensure the SDK is integrated into the same environment you want to monitor (e.g., staging or production). e.g., Logs will not appear if APIs are hit on production while Devzery SDK is integrated on staging.

**Middleware not logging data:**
- Ensure the middleware is applied before defining routes.

**Error Codes**
- 401 Unauthorized: Invalid API key.
- 500 Internal Server Error: Devzery server issue.

**Best Practices**
- Use environment variables for sensitive data.
- Apply middleware before any route definitions or other middlewares.
- Monitor console logs during development for debugging.

**Glossary**
- API Key: A unique identifier for authenticating API requests.
- Middleware: A function that processes requests and responses in an Express app.
- TSOA: TypeScript framework for building APIs, supports both TypeScript and JavaScript application.

## 🙋 Support:

- Email: support@devzery.com
- Feedback Mechanism: Submit feedback or issues on the [GitHub Repository](https://github.com/devzery/devzery_middleware_express/issues).

## ⚡ Updates and Version History:

**Changelog:**
- `v1.0.0` Initial release with basic request and response logging.

**License**
- The SDK is distributed under the `Apache 2.0 License`

## 🔗 Links
[![portfolio](https://img.shields.io/badge/Devzery-000?style=for-the-badge&logo=ko-fi&logoColor=pink)](https://www.devzery.com)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/devzery/)

[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/devzery)
