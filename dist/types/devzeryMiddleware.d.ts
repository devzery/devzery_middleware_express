import { Request, Response, NextFunction } from 'express';
import { DevzeryConfig } from './types';
export default function devzeryMiddleware(config: DevzeryConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
