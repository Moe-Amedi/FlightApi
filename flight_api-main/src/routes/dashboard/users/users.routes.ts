import { Router } from "express";
const router = Router();

import { getUsers, addUser, editUser, removeUser } from "../../../controllers/dashboard/users/users.controller";
import { authenticateTokenDB } from "../../../constants/authenticate";
import checkAccount from "../../../constants/checkAccount";

router.get("", authenticateTokenDB, checkAccount.isAdmin, getUsers);
router.post("", authenticateTokenDB, checkAccount.isAdmin, addUser);
router.put("", authenticateTokenDB, checkAccount.isAdmin, editUser);
router.delete("/user_id/:user_id", authenticateTokenDB, checkAccount.isAdmin, removeUser);

export default router;