import { Router } from "express";
import * as controller from './user.controller.js'
import { asyncHandler } from './../../utils/errorHandling.js';
import { isAuth } from './../../middlewares/auth.js';

const router = Router();

router.post('/signup' , asyncHandler(controller.signUP));
router.post('/signin' , asyncHandler(controller.signIn));
router.patch('/changePassword' , isAuth() , asyncHandler(controller.updatePass));
router.put('/update' , isAuth() , asyncHandler(controller.updateUser));
router.delete('/delete' , isAuth() , asyncHandler(controller.deleteUser));
router.patch('/softDelete' , isAuth() , asyncHandler(controller.softDelete));
router.patch('/logout' , isAuth() , asyncHandler(controller.logOut));

export default router;