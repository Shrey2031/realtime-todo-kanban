import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getRecentLogs } from "../controllers/log.controller.js";
const router = Router();

router.route("/").get(verifyJWT,getRecentLogs);

export default router;