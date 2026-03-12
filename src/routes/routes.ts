import { Router } from "express";
import categoriaRoutes from "./categoria.routes";

const router = Router();

router.use("/categorias", categoriaRoutes);


export default router;
