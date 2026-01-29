import { io,type Socket } from "socket.io-client";

export const socket: Socket = io("https://delight-ice-singing-upcoming.trycloudflare.com", {
  transports: ["websocket"],
  autoConnect: true,
});