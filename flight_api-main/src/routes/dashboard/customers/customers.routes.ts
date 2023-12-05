import { Router } from "express";
const router = Router();


import { getCustomers, getOtps } from "../../../controllers/dashboard/customers/customers.controller";
import { authenticateTokenDB } from "../../../constants/authenticate";

router.get("", authenticateTokenDB, getCustomers);
router.get("/otp", authenticateTokenDB, getOtps);

export default router;