import mongoose from 'mongoose';

const groupChatSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupeName: {
        type: String,
        required: true
    },
    groupePic: {
        type: String,
        default: null
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    lastMessage: {
        text: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        seen: {
            type: Boolean,
            default: false
        },
    },
} ,
    { timeseries: true }
);

const GroupChat = mongoose.model('groupChat', groupChatSchema);

export default GroupChat;

