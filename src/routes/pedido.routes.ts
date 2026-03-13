import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";

const pedidoRoutes = Router();
const pedidoController = new PedidoController();

// get
pedidoRoutes.get("/", pedidoController.listarTodos);
pedidoRoutes.get("/:id", pedidoController.buscarPorId);

// post
pedidoRoutes.post("/", pedidoController.criar);

// delete
pedidoRoutes.delete("/:id", pedidoController.deletar);

export default pedidoRoutes;