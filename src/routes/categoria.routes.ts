import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

// get
categoriaRoutes.get("/", categoriaController.listarTodos);
categoriaRoutes.get("/:id", categoriaController.buscarPorId);

// post
categoriaRoutes.post("/", categoriaController.criar);

// put
categoriaRoutes.put("/:id", categoriaController.editar);

// delete
categoriaRoutes.delete("/:id", categoriaController.deletar);

export default categoriaRoutes;