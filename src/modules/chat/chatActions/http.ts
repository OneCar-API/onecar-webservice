import 'reflect-metadata';
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

const serverHttpSocket = http.createServer(app);

const io = new Server(serverHttpSocket);

export { serverHttpSocket, io };
