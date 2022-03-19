import eventController from "../controllers/eventController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", [authMiddleware], eventController.getAll);
router.get("/:id", [authMiddleware], eventController.get);

export default router;
