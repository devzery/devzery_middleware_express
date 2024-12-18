import { DevzeryConfig, DevzeryLogData, DevzeryRequestContext, DevzeryResponseContext } from './types';
export declare class DevzeryLogger {
    private config;
    constructor(config: DevzeryConfig);
    sendLog(logData: DevzeryLogData): Promise<void>;
    static filterHeaders(headers: Record<string, any>): Record<string, any>;
    static determineRequestBody(context: DevzeryRequestContext): any;
    processLogData(context: DevzeryRequestContext, responseContext: DevzeryResponseContext, startTime: number): DevzeryLogData;
}
