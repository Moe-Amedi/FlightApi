import { Router } from "express";
const router = Router();

import { getCenters, addCenter, editCenter, removeCenter } from "../../../controllers/admin/center/centers.controller";
import { authenticateTokenDB } from "../../../constants/authenticate";
import checkAccount from "../../../constants/checkAccount";

router.get("", authenticateTokenDB, checkAccount.isSuperAdmin, getCenters);
router.post("", authenticateTokenDB, checkAccount.isSuperAdmin, addCenter);
router.put("", authenticateTokenDB, checkAccount.isSuperAdmin, editCenter);
router.delete("/center_id/:center_id", authenticateTokenDB, checkAccount.isSuperAdmin, removeCenter);

export default router;