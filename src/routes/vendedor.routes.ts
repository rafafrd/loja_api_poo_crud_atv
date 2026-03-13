import { Router } from "express";
import { VendedorController } from "../controllers/vendedor.controller";

const vendedorRoutes = Router();
const vendedorController = new VendedorController();

// get
vendedorRoutes.get("/", vendedorController.listarTodos);
vendedorRoutes.get("/:id", vendedorController.buscarPorId);

// post
vendedorRoutes.post("/", vendedorController.criar);

// put
vendedorRoutes.put("/:id", vendedorController.editar);

// delete
vendedorRoutes.delete("/:id", vendedorController.deletar);

export default vendedorRoutes;
