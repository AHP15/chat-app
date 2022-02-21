import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const chatSchema = new mongoose.Schema({
    public_id:{
        type:String,
        default:uuidv4(),
    },
    name:String,
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        id:{
            type:String,
            default:uuidv4(),
        },
        text:{
            type:String,
            required:[true, "Empty message"]
        },
        username:{
            type:String,
            required:[true, "Empty username"]
        },
        sentAt:{
            type:String,
            required:[true, "Please enter a date"],
        },
        userInfo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }],
});

const Chat  = mongoose.model('Chat', chatSchema);

export default Chat;