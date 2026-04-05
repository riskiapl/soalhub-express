import { Router } from "express";
import {
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limit for user registration
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message:
    "Too many registration attempts from this IP, please try again after 15 minutes",
});

// Rate limit for update user
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many update attempts from this IP, please try again after 15 minutes",
});

router.get("/", getUsers);
router.get("/:id", getUsers); // Bisa digunakan untuk get user by id, tapi belum diimplementasikan di controller
router.post("/", registerLimiter, registerUser);
router.put("/:id", updateLimiter, updateUser);
router.delete("/:id", deleteUser);

export default router;
