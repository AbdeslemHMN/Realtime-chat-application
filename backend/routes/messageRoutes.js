import express from 'express';
import { sendMessage , getConversations , getMessages , createGroupChat, getGroupChat} from '../controllers/messageController.js';
import protectRoute from '../middlewares/protectRoute.js';




const router = express.Router();
router.get("/conversations", protectRoute, getConversations);
router.get("/groupe", protectRoute, getGroupChat);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);
router.post("/groupe/create", protectRoute, createGroupChat);

export default router;