/**
 * Configuration options for Devzery middleware
 */
export interface DevzeryConfig {
  apiEndpoint?: string;
  apiKey: string;
  serverName: string;
}

/**
 * Request/Response Log Data
 */
export interface DevzeryLogData {
  request: {
    method: string;
    path: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
  };
  response: {
    status_code: number;
    content: any;
  };
  elapsed_time: number;
}

/**
 * Utility interface for request processing
 */
export interface DevzeryRequestContext {
  method: string;
  url: string;
  headers: Record<string, any>;
  body?: any;
  isMultipart?: boolean;
}

/**
 * Utility interface for response processing
 */
export interface DevzeryResponseContext {
  statusCode: number;
  payload?: any;
}
