import { FastifyInstance } from 'fastify';
import { DevzeryConfig, DevzeryRequestContext, DevzeryResponseContext } from './types';
import { DevzeryLogger } from './DevzeryLogger';
import multipart from '@fastify/multipart';

/**
 * Fastify plugin for Devzery logging middleware
 * @param fastify Fastify instance
 * @param config Devzery configuration options
 */
export default async function devzeryFastifyPlugin(
  fastify: FastifyInstance, 
  config: DevzeryConfig
) {
  const devzeryLogger = new DevzeryLogger(config);

  // Register multipart plugin to handle file uploads, only if not already registered
  try {
    if (!fastify.hasDecorator('multipartErrors')) {
      await fastify.register(multipart);
    }
  } catch (err: unknown) {
    // Log the error but don't fail the plugin registration
    console.warn('Failed to register multipart plugin:', err instanceof Error ? err.message : 'Unknown error');
  }

  // Add a global request hook for logging
  fastify.addHook('onRequest', async (request, reply) => {
    // Attach start time to the request for tracking
    (request as any).devzeryStartTime = Date.now();
  });

  // Hook into the response lifecycle for comprehensive logging
  fastify.addHook('onSend', async (request, reply, payload) => {
    const startTime = (request as any).devzeryStartTime;
    
    // Prepare request context
    const requestContext: DevzeryRequestContext = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      isMultipart: request.isMultipart()
    };

    // Prepare response context
    const responseContext: DevzeryResponseContext = {
      statusCode: reply.statusCode,
      payload
    };

    // Prepare and send log data
    const logData = devzeryLogger.processLogData(
      requestContext, 
      responseContext, 
      startTime
    );

    // Send log asynchronously without blocking the response
    devzeryLogger.sendLog(logData).catch(console.error);
  });
}