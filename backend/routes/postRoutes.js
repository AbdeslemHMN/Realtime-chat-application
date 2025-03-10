import express from 'express';
import { createPost , getPost , deletePost , likeUnlikePost , replyToPost , getFeedPost , getUserPost} from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();


router.get("/feed", protectRoute, getFeedPost);
router.get("/user/:username", getUserPost);
router.get("/:id", getPost);
router.post("/create", protectRoute , createPost);
router.delete("/delete/:id", protectRoute , deletePost);
router.put("/like/:id", protectRoute , likeUnlikePost);
router.put("/reply/:id", protectRoute , replyToPost);

export default router;  