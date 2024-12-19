export interface DevzeryConfig {
    apiEndpoint?: string;
    apiKey: string;
    serverName: string;
}
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
export interface DevzeryRequestContext {
    method: string;
    url: string;
    headers: Record<string, any>;
    body?: any;
    isMultipart?: boolean;
}
export interface DevzeryResponseContext {
    statusCode: number;
    payload?: any;
}
