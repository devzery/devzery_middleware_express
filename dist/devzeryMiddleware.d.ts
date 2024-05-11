import { Request, Response, NextFunction } from 'express';
interface DevzeryConfig {
    apiEndpoint?: string;
    apiKey?: string;
    sourceName?: string;
}
export default function devzeryMiddleware(config: DevzeryConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
