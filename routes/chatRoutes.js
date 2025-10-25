// routes/chatRoutes.js
import express from "express";
import { sendMessage } from "../controllers/chatController.js"; // usar .js com ES Module

const router = express.Router();

router.get("/", (req, res) => {
  res.render("chat");
});

router.post("/send", sendMessage);

export default router;
