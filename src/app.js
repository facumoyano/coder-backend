import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.js";
import productsRouter from "./routes/products.js";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = express();

const PORT = 8080;
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
