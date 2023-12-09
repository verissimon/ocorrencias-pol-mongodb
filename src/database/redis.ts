import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './config';

const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

export async function conectar() {
    await client.connect();
    client.on('error', err => {
        console.log('Erro: ' + err);
    });
    console.log('Conectado com o Redis');
}
