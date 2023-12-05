import { Router } from "express";
const router = Router();

import { getNotifications, addNotification, removeNotification } from "../../../controllers/dashboard/notifications/notifications.controller";

import { authenticateTokenDB } from "../../../constants/authenticate";

router.get("", authenticateTokenDB, getNotifications);
router.post("", authenticateTokenDB, addNotification);
router.delete("/notification_id/:notification_id", authenticateTokenDB, removeNotification);

export default router;