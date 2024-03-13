import express from 'express';
import fs from "fs";
import path from 'path';
import { dataFolderName } from './constants.js';

const __dirname = path.resolve();

const startHttpServer = () => {
  const app = express();
  app.use(express.static('public'));

  // Define route to fetch rrweb events based on session ID
  app.get('/api-rrweb-events', (req, res) => {
    const sessionId = req.query.id; // Retrieve session ID from query parameter
    const rrwebEvents = fetchRrwebEvents(sessionId);
    res.json(rrwebEvents);
  });

  const port = 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

const fetchRrwebEvents = (sessionId) => {
  const dataFilePath = path.join(dataFolderName, `${sessionId}.json`);
  if (!fs.existsSync(dataFilePath)) {
    return []; // Return empty array if session data does not exist
  }
  const rrwebEvents = fs.readFileSync(dataFilePath, 'utf-8');
  return rrwebEvents.split("\n").filter(line => line.length > 0).map(ff => JSON.parse(ff));
}

export {
  startHttpServer
}
