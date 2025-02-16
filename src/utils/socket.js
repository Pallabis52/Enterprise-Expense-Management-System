import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_WS_URL);

export const subscribeToUpdates = (callback) => {
  socket.on("update", (data) => callback(data));
};

export const sendUpdate = (data) => {
  socket.emit("update", data);
};
