import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import GroupChat from "../models/groupeChatModel.js";


const app = express(); 

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

const userSocketMap = {}

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
}

io.on("connection", async(socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); 

    socket.on("markMessageAsSeen", async (conversationId, groupChatId, userId) => {
        try {
            if (conversationId) {
                await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
                await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
                const conversation = await Conversation.findById(conversationId);
                if (conversation) { 
                    const otherUserId = conversation.participants.find(
                        (participant) => participant._id.toString() !== userId.toString()
                    )
                    if (otherUserId && userSocketMap[otherUserId]) {
                        const otherUserSocketId = userSocketMap[otherUserId];
                        io.to(otherUserSocketId).emit("conversationMessageSeen", conversationId);
                    }
                }
            }

            if (groupChatId) {
                await Message.updateMany({ groupChatId: groupChatId, seen: false }, { $set: { seen: true } });
                await GroupChat.updateOne({ _id: groupChatId }, { $set: { "lastMessage.seen": true } });
                const groupChat = await GroupChat.findById(groupChatId);
                if (groupChat) {
                    groupChat.participants.forEach((participant) => {
                        if (participant._id.toString() !== userId.toString() && userSocketMap[participant._id]) {
                            const participantSocketId = userSocketMap[participant._id];
                            io.to(participantSocketId).emit("groupChatMessageSeen", groupChatId);
                        }
                    }
                    )
                }
            }
        } catch (err) {
            socket.emit("error", {
            event: "markMessageAsSeen",
            message: "Failed to mark message as seen",
            details: err.message
        });
        }
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
}); 


export { io, server, app };

