import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  const { hostname } = window.location;
  if (import.meta.env.DEV) return `http://${hostname}:3001`;
  return `${window.location.protocol}//${hostname}`;
};

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(getSocketUrl(), { transports: ['websocket', 'polling'], autoConnect: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
