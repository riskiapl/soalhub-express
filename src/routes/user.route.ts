import { Router } from "express";
import {
  // registerUser,
  getUsers,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// router.post("/", registerUser); // POST /api/users
router.get("/", getUsers); // GET /api/users
router.delete("/:id", deleteUser); // DELETE /api/users/:id

export default router;
