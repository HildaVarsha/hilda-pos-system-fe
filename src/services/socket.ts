import { io, type Socket } from 'socket.io-client';
import { env } from '@constants/env';

let socket: Socket | null = null;

/**
 * Lazily creates (or returns) the single Socket.IO connection for the app.
 * Called from `useRealtimeConnection` once a user is authenticated —
 * there is no anonymous realtime access, mirroring the REST API.
 */
export function getSocket(): Socket {
  socket ??= io(env.socketUrl, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
}
