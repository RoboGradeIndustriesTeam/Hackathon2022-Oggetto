import userController from "../controllers/userController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [authMiddleware, roleMiddleware("ADMIN")],
  userController.register
);
router.post("/login", [], userController.auth);
router.get("/me", [authMiddleware], userController.me);
router.patch("/me", [authMiddleware], userController.changeMe);
router.post("/google", [], userController.googleAuth);

export default router;
