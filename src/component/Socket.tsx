import { io,type Socket } from "socket.io-client";

export const socket: Socket = io("https://bet-greene-prayer-francisco.trycloudflare.com", {
  transports: ["websocket"],
  autoConnect: true,
});