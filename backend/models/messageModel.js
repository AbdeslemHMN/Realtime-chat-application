import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    groupeChatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupChat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    seen: {
        type: Boolean,
        default: false
    },
    
    img: {
        type: String,
        default: null
    },
} ,
    { timeseries: true }
);

const Message = mongoose.model('message', messageSchema);

export default Message;
