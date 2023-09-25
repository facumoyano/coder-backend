import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.js";
import productsRouter from "./routes/products.js";
import viewsRouter from "./routes/views.js";
import userRouter from './routes/users.js';
import sessionsRouter from './routes/sessions.js';
import {__dirname} from "./utils/constants.js";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import Message from "./dao/models/messageModel.js";
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import initializePassport from "./config/passportConfig.js";
import passport from "passport";

const app = express();
dotenv.config();

const uri = process.env.MONGODB_URI;
const PORT = 8080;

mongoose.connect(uri)
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

app.engine("handlebars", handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    },
    first: function (array) {
      return array[0];
    },
    gt: function (v1, v2) {
      return v1 > v2;
    }
  }
}));

app.set("views", path.resolve(__dirname, '../views'));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cookieParser());
app.use(session({
  store: new mongoStore({
    mongoUrl: uri,
    ttl: 1800,
  }),
  secret: process.env.SECRET_SESSION_KEY,
  resave:false,
  saveUnitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', userRouter);
app.use('/api/sessions', sessionsRouter);
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
