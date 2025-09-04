import { config } from "dotenv";
import cors from "cors";

config();

import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from 'ws';

import { mounthttp, mountws } from "../lib/mount";
import { demoController, demoWSController } from "../controller/demo.controller";

const app = express();
app.use(bodyParser.json()).use(cors());

mounthttp(app, [
    demoController
]);

app.listen(process.env.SERVER_HTTP_PORT, async () => {
    console.log(`App http listening at http://localhost:${process.env.SERVER_HTTP_PORT}`);
});

const wss = new WebSocketServer({ port: Number(process.env.SERVER_WS_PORT), path: '/ws' }, () => {
    console.log(`App websocket listening at ws://localhost:${process.env.SERVER_WS_PORT}`);
});
mountws(wss, [
    demoWSController
]);
