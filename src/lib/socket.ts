import { io, Socket } from 'socket.io-client';
import { TOKEN_KEY } from './api';
import type { Notification } from './notifications';


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface ServerToClientEvents {
  newNotification: (notification: Notification) => void;
  unreadCountUpdate: (count: number) => void;
}

interface ClientToServerEvents {
  joinProfile: (profileId: string) => void;
  leaveProfile: (profileId: string) => void;
  markAsRead: (notificationId: string) => void;
}

let socket: Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null = null;

export function getSocket() {
  if (socket) return socket;

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });






  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}