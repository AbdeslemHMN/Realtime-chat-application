import express from 'express';
import { signupUser ,loginUser ,logoutUser , followUnfollowUser , updateUser , getProfileUser , getSuggestedUsers , freezeUser } from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/profile/:query", getProfileUser);
router.get("/suggestedUsers", protectRoute , getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze" , protectRoute , freezeUser);

export default router;