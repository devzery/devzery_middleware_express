import { FastifyInstance } from 'fastify';
import { DevzeryConfig } from './types';
export default function devzeryFastifyPlugin(fastify: FastifyInstance, config: DevzeryConfig): Promise<void>;
