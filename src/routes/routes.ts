import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import produtoRoutes   from "./produto.routes";
import pedidoRoutes    from "./pedido.routes";
import vendedorRoutes  from "./vendedor.routes";
import clienteRoutes   from "./cliente.routes";

const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/vendedores", vendedorRoutes);
router.use("/clientes", clienteRoutes);

export default router;
