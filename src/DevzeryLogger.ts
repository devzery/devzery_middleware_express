import axios from 'axios';
import { DevzeryConfig, DevzeryLogData, DevzeryRequestContext, DevzeryResponseContext } from './types';

/**
 * Service responsible for sending logging data to the Devzery endpoint
 */
const DEFAULT_API_ENDPOINT = 'https://server-v3-7qxc7hlaka-uc.a.run.app/api/add';

export class DevzeryLogger {
  private config: DevzeryConfig;

  constructor(config: DevzeryConfig) {
    this.config = {
      apiEndpoint: config.apiEndpoint || DEFAULT_API_ENDPOINT,
      apiKey: config.apiKey,
      serverName: config.serverName
    };
  }

  /**
   * Sends log data to the configured Devzery endpoint
   * @param logData Structured log data to be sent
   */
  async sendLog(logData: DevzeryLogData): Promise<void> {
    const { apiEndpoint, apiKey, serverName } = this.config;

    // Validate required configuration
    if (!apiKey || !serverName) {
      console.log('Devzery: No API Key or Source Name provided!');
      return;
    }

    try {
      await axios.post(apiEndpoint!, {
        ...logData
      }, {
        headers: {
          'x-access-token': apiKey,
          'source-name': serverName
        }
      });
    } catch (error) {
      console.error(`Devzery: Error sending log data - ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Filters and prepares request headers for logging
   * @param headers Original request headers
   * @returns Filtered headers object
   */
  static filterHeaders(headers: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(headers).filter(([key]) =>
        key.startsWith('http_') || ['content-length', 'content-type'].includes(key)
      )
    );
  }

  /**
   * Determines the request body based on content type
   * @param context Request context containing headers and body
   * @returns Parsed request body or null
   */
  static determineRequestBody(context: DevzeryRequestContext): any {
    const contentType = context.headers['content-type'];

    // Handle JSON body
    if (contentType?.includes('application/json')) {
      return context.body;
    }

    // Handle multipart form data
    if (context.isMultipart || contentType?.includes('multipart/form-data')) {
      return context.body;
    }

    // Handle form-encoded content
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      return context.body;
    }

    return null;
  }

  /**
   * Processes and prepares log data for sending
   * @param context Request context
   * @param responseContext Response context
   * @param startTime Request start time
   * @returns Prepared log data
   */
  processLogData(
    context: DevzeryRequestContext,
    responseContext: DevzeryResponseContext,
    startTime: number
  ): DevzeryLogData {
    // Convert payload to string if possible
    const responseContent = responseContext.payload !== undefined
      ? (typeof responseContext.payload === 'string'
        ? responseContext.payload
        : JSON.stringify(responseContext.payload))
      : {};

    return {
      request: {
        method: context.method,
        path: context.url,
        headers: DevzeryLogger.filterHeaders(context.headers),
        body: DevzeryLogger.determineRequestBody(context)
      },
      response: {
        status_code: responseContext.statusCode,
        content: responseContent
      },
      elapsed_time: Date.now() - startTime
    };
  }
}