import Fastify from 'fastify';
import { greet } from '@kellyapps/utils';

const server = Fastify({ logger: true });

server.get('/', async () => {
  return { message: greet('World') };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('API server running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
