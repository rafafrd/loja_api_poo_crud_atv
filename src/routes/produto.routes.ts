import { Router } from "express";
import { ClienteController }  from "../controllers/cliente.controller";

const clienteRoutes = Router();
const clienteController = new ClienteController();

// get
clienteRoutes.get("/", clienteController.listarTodos);
clienteRoutes.get("/:id", clienteController.buscarPorId);

// post
clienteRoutes.post("/", clienteController.criar);
// put
clienteRoutes.put("/:id", clienteController.editar);
// delete
clienteRoutes.delete("/:id", clienteController.deletar);

export default clienteRoutes;