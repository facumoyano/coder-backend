import { Router } from "express";
import ProductController from "../dao/controllers/productController.js";

const router = Router();
const controller = new ProductController();

router.get("/", controller.getProducts);
router.get("/:pid", controller.getProductById);
router.post("/", controller.addProduct);
router.put("/:pid", controller.editProductById);
router.delete("/:pid", controller.deleteProductById);




export default router;
