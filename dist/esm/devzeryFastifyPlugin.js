import { DevzeryLogger } from "./DevzeryLogger";
import multipart from "@fastify/multipart";
async function devzeryFastifyPlugin(fastify, config) {
  const devzeryLogger = new DevzeryLogger(config);
  try {
    if (!fastify.hasDecorator("multipartErrors")) {
      await fastify.register(multipart);
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
export {
  devzeryFastifyPlugin as default
};
