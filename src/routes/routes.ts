import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import produtoRoutes   from "./produto.routes";

const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtoRoutes);


export default router;
