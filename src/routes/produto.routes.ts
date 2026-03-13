import { Router } from "express";
import { ProdutoController }  from "../controllers/produto.controller";
import uploadImage from "../middleware/upload.middleware";


const produtoRoutes = Router();
const produtoController = new ProdutoController();

// get
produtoRoutes.get("/", produtoController.listarTodos);
produtoRoutes.get("/:id", produtoController.buscarPorId);

// post
produtoRoutes.post("/", uploadImage, produtoController.criar);

// put
produtoRoutes.put("/:id", produtoController.editar);

// delete
produtoRoutes.delete("/:id", produtoController.deletar);

export default produtoRoutes;