import { addContact ,removeContact, getuserDetails } from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/authJwt.js";
import express from 'express';

const router = express.Router();

router.route("/contact/new").put(verifyToken, addContact);
router.route("/contact/delete").put(verifyToken, removeContact);
router.route("/user/profile").get(verifyToken, getuserDetails);

export default router;