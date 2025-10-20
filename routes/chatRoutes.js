import { Router } from "express";
import { renderChatPage, sendMessage } from "../controllers/chatController.js";

const router = Router();

router.get("/", renderChatPage);
router.post("/send", sendMessage);

export default router;

router.post('/chat', sendMessage);
router.get('/chat', listMessages);
