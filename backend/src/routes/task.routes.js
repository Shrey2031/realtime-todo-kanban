import { Router } from "express";
import { getTasks ,
            createTask,
            updateTask,
            deleteTask,
            smartAssign,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();


router.route("/").get(verifyJWT,getTasks);
router.route("/").post(verifyJWT,createTask);
router.route("/:id").put(verifyJWT,updateTask);
router.route("/:id").delete(verifyJWT,deleteTask);

router.route("/smart-assign/:Id").put(verifyJWT, smartAssign);


export default router;