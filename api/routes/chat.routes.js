import { 
    addChat,
    exitChat,
    addMessage ,
    getChat
} from '../controllers/chat.controller.js';
import { verifyToken } from "../middleware/authJwt.js";
import express from 'express';

const router = express.Router();

router.route("/chat/new").post(verifyToken, addChat);
router.route("/chat/exist").put(verifyToken, exitChat);
router.route("/chat/messages/new").put(verifyToken, addMessage);
router.route("/chat/:id").get(verifyToken, getChat);

export default router;