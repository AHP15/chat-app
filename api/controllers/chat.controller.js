import DB from "../models/index.js";

const Chat = DB.chat;
const User = DB.user;

export const addChat = async (req, res) =>{
    try{
        const chat = await Chat.create(req.body);

        chat.users.forEach(async user => {
            const _user = await User.findById(user);
            _user.chats.push(chat._id);
            await _user.save();
        });
        
        /*
        const user = await User.findById(req.userId);
        user.chats.push(chat._id);*/
        
        
        res.status(201).send({
            success: true,
            chat,
        });
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        });
    }
};

export const getChat = async (req, res) =>{
    try{
        const chat = await Chat.findById(req.params.id);
        res.status(200).send({
            success:true,
            chat
        });
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        })
    }
}

export const exitChat = async (req, res) =>{
    try{
        const chat = await Chat.findById(req.body.chatId);
        chat.users = chat.users.filter(user => String(user._id) !== req.userId);
        await chat.save();
        
        res.status(200).send({
            success: true,
            chat:chat._id
        });
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        });
    }
};

export const addMessage = async (req, res) =>{

    try{
        const chat =  await Chat.findById(req.body.chatId);
        chat.messages.push(req.body.message);
        await chat.save();

        res.status(201).send({
            success: true,
            message:chat.messages[chat.messages.length - 1],
        });
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        });
    }
}