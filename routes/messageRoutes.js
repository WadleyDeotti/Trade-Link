import express from "express";
import MessageController from "../controllers/MessageController.js";

const router = express.Router();

router.post("/", MessageController.enviarMensagem);
router.get("/:usuarioId/:contatoId", MessageController.listarMensagens);

export default router;
