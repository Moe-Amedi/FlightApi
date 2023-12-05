import { Router } from "express";
const router = Router();


import { getCenterUsers, addCenterUser, editCenterUser, removeCenterUser } from "../../../controllers/admin/users/users.controller";


import { authenticateTokenDB } from "../../../constants/authenticate";
import checkAccount from "../../../constants/checkAccount";

router.get("/center_id/:center_id", authenticateTokenDB, checkAccount.isSuperAdmin, getCenterUsers);
router.post("", authenticateTokenDB, checkAccount.isSuperAdmin, addCenterUser);
router.put("", authenticateTokenDB, checkAccount.isSuperAdmin, editCenterUser);
router.delete("/account_id/:account_id", authenticateTokenDB, checkAccount.isSuperAdmin, removeCenterUser);

export default router;