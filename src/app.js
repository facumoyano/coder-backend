import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.js";
import productsRouter from "./routes/products.js";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import Message from "./dao/models/messageModel.js";
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const uri = process.env.MONGODB_URI;
const PORT = 8080;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.log('Error al conectar a MongoDB:', err);
  });

const httpServer = app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
export const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");
});

let messages = [];

io.on("connection", socket => {
  socket.on("message", async data => {
    const messageWithTimestamp = {
      user: data.user,
      message: data.message,
      timestamp: new Date(),
    };
    messages.push(messageWithTimestamp);

    // Guardar el mensaje en la base de datos
    const chatMessage = new Message(messageWithTimestamp);
    await chatMessage.save();

    io.emit('messageLogs', messages)
  });
});
