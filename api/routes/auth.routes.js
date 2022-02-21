import { register ,login, refreshToken} from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/auth/refresh_token").post(refreshToken);

export default router;