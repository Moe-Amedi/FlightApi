import { Router } from "express";
const router = Router();
import { logout } from "../../../controllers/dashboard/auth/logout";
import { authenticateTokenDB } from "../../../constants/authenticate";

router.get("", authenticateTokenDB, logout);

export default router;