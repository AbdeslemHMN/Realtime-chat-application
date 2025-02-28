import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import GroupChat from "../models/groupeChatModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { getRecipientSocketId ,io } from "../socket/socket.js";


async function sendMessage(req, res) {
    try {
        const { recipientId, groupChatId, message } = req.body;
        const senderId = req.user?._id;
        let { img } = req.body;
        
        // Validate that either recipientId OR groupChatId is provided, not both
        if ((recipientId && groupChatId) || (!recipientId && !groupChatId)) {
            return res.status(400).json({ error: "Provide either recipientId for direct message OR groupChatId for group message" });
        }
        
        // Handle direct message
        if (recipientId) {
            if (!mongoose.Types.ObjectId.isValid(recipientId)) {
                return res.status(400).json({ error: "Invalid recipient ID" });
            }

            if (!mongoose.Types.ObjectId.isValid(senderId)) {
                return res.status(400).json({ error: "Invalid sender ID" });
            }

            let conversation = await Conversation.findOne({ participants: { $all: [req.user._id, recipientId] } });

            if (!conversation) {
                conversation = new Conversation({
                    participants: [senderId, recipientId],
                    lastMessage: {
                        text: message,
                        sender: senderId,
                    },  
                });
                await conversation.save();
            }
            
            if (img) {
                const result = await cloudinary.uploader.upload(img);
                img = result.secure_url;
            }
            
            const newMessage = new Message({
                conversationId: conversation._id,
                sender: senderId,
                text: message,
                img: img || null
            });
            
            await Promise.all([
                newMessage.save(),
                conversation.updateOne({
                    lastMessage: {
                        text: message,
                        sender: senderId,
                    },
                })
            ]);

            const recipientSocketId = getRecipientSocketId(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("newMessage", newMessage);
            } 
            return res.status(201).json({ message: "Message sent successfully" });
        }
        
        // Handle group message
        if (groupChatId) {
            if (!mongoose.Types.ObjectId.isValid(groupChatId)) {
                return res.status(400).json({ error: "Invalid group chat ID" });
            }
            
            // Check if group exists and user is a participant
            const groupChat = await GroupChat.findById(groupChatId);
            if (!groupChat) {
                return res.status(404).json({ error: "Group chat not found" });
            }
            
            if (!groupChat.participants.includes(senderId)) {
                return res.status(403).json({ error: "You are not a member of this group" });
            }
            
            if (img) {
                const result = await cloudinary.uploader.upload(img);
                img = result.secure_url;
            }
            
            const newMessage = new Message({
                groupChatId: groupChatId,  
                sender: senderId,
                text: message,
                img: img || null
            });

            
            
            await Promise.all([
                newMessage.save(),
                groupChat.updateOne({
                    lastMessage: {
                        text: message,
                        sender: senderId,
                        seen: false
                    },
                })
            ]);
            
            return res.status(201).json({ message: "Group message sent successfully" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getConversations = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid user ID" });

        const conversations = await Conversation.find({ participants: userId }).populate({
            path: 'participants',
            select : "username profilePic"
        })

        //remove the current user from the participants array

        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
        });
        
        res.status(200).json(
            conversations
            )
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}

const getGroupChat = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid user ID" });
        const groupChats = await GroupChat.find({ participants: userId }).populate({
            path: 'participants',
            select: "username profilePic"
        })
        res.status(200).json(groupChats);
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
} 

const getMessages = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid user ID" });

        const { otherUserId, groupeChatId } = req.params;

        if ((otherUserId && groupeChatId) || (!otherUserId && !groupeChatId)) {
            return res.status(400).json({ error: "Provide either otherUserId for direct message OR groupChatId for group message" });
        }
        
        if (otherUserId) {
            if (!mongoose.Types.ObjectId.isValid(otherUserId)) return res.status(400).json({ error: "Invalid user ID" });
            const conversation = await Conversation.findOne({ participants: { $all: [userId, otherUserId] } });
            if (!conversation) return res.status(404).json({ error: "Conversation not found" });
            const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: -1 });
            res.status(200).json(messages);    
        }

        if (groupeChatId) { 
            if (!mongoose.Types.ObjectId.isValid(groupeChatId)) return res.status(400).json({ error: "Invalid group chat ID" });
            const groupChat = await GroupChat.findById(groupeChatId);
            if (!groupChat) return res.status(404).json({ error: "Group chat not found" });
            if(!groupeChatId.participants.includes(userId)) return res.status(401).json({ error: "You are not part of this group chat" });
            const messages = await Message.find({ groupeChatId: groupeChat._id }).sort({ createdAt: -1 });
            res.status(200).json(messages);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createGroupChat = async (req, res) => { 
    try {
        const { groupeName, participants } = req.body;
        let { groupePic } = req.body;
        
        if (!groupeName || !participants || participants.length < 2 || !Array.isArray(participants)) {
            return res.status(400).json(
                {
                    error: "Please provide a group name and at least 2 participants" 
                });
        }

        // Add the current user (assuming you have authentication middleware)
        // If the user is already included in participants, this avoids duplication
        if (!participants.includes(req.user._id)) {
            participants.push(req.user._id);
        }

        if (groupePic) {
            const result = await cloudinary.uploader.upload(groupePic);
            groupePic = result.secure_url;
        }
        const newGroupChat = await GroupChat.create({
            owner: req.user._id,
            groupeName,
            participants,
            groupePic : groupePic || null
        });

        // Populate the participants information for the response
        const fullGroupChat = await GroupChat.findById(newGroupChat._id)
            .populate("participants", "name email profilePic")
            .exec();
        
        return res.status(201).json(fullGroupChat);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { sendMessage ,getConversations , getMessages , createGroupChat ,getGroupChat};