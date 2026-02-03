import { io,type Socket } from "socket.io-client";

export const socket: Socket = io("https://unavailable-hand-semester-consultancy.trycloudflare.com", {
  transports: ["websocket"],
  autoConnect: true,
});