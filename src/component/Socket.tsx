import { io,type Socket } from "socket.io-client";

export const socket: Socket = io("https://captain-thesis-biodiversity-packets.trycloudflare.com", {
  transports: ["websocket"],
  autoConnect: true,
});