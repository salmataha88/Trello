import { Router } from "express";
import * as controller from './task.controller.js'
import { asyncHandler } from './../../utils/errorHandling.js';
import { isAuthTask } from "../../middlewares/auth.js";

const router = Router();

router.post('/addTask' , isAuthTask() , asyncHandler(controller.addTask));
router.put('/updateTask/:id' , isAuthTask() , asyncHandler(controller.updateTask));
router.delete('/deleteTask' , isAuthTask() , asyncHandler(controller.deleteTask));
router.get('/getAllTasks' , asyncHandler(controller.getTasks));
router.get('/getTasksWithUsers' , asyncHandler(controller.getTasksWithUsers));
router.get('/getTasksOfUser' , isAuthTask() , asyncHandler(controller.getTasksOfUser));
router.get('/getLateTasks' , asyncHandler(controller.getLateTasks));

export default router; 