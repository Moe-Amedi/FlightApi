import { Router } from "express";
const router = Router();
import login from "../../../controllers/dashboard/auth/login";

router.post("/", login.login);

export default router;