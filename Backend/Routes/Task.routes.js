import { addTask, getTasks,getTaskStatus, getTasksById, updateTask, deleteTask } from "../Controllers/Task.Controller.js";
import { auth , isTeamLeader } from "../middlewares/Auth.Middleware.js";
import express from "express";

const router = express.Router();

router.post("/create-task",auth,isTeamLeader, addTask);
router.delete("/delete-task/:id",auth,isTeamLeader, deleteTask);
router.put("/update-task",auth,isTeamLeader, updateTask);
router.get("/get-all-task", getTasks);
router.get("/get-task/:id", getTasksById);
router.get("/get-task-status", getTaskStatus);

export default router;