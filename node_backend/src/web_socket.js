import { WebSocketServer } from 'ws';
import fs from 'fs-extra';
import { dataFolderName } from './constants.js';
import path from "path";

const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3008 });
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    // Handle incoming messages
    ws.on('message', (message) => {
      const payload = JSON.parse(message.toString());
      processPayload(payload);
    });
  });
};

const processPayload = (payload) => {
  const { type, url, data } = payload;
  console.log("*".repeat(80));
  console.log({ type, url, payload });
  console.log("*".repeat(80));

  if (type !== 'rrweb events') {
    return;
  }
  const jsonData = JSON.parse(data);

  // Append a unique identifier to each file name (e.g., session ID)
  const sessionId = Date.now(); // You can use any method to generate a unique session ID
  const dataFilePath = path.join(dataFolderName, `${sessionId}.json`);

  fs.writeJsonSync(dataFilePath, jsonData);
};

export {
  startWebSocketServer,
};
