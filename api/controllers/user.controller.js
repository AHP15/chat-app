import DB from "../models/index.js";

const User = DB.user;

export const addContact = async (req, res) =>{
    try{
        const user = await User.findById(req.userId);
        const contact = await User.findOne({email:req.body.email});

        if(!contact){
            return res.status(404).send({
                success:false,
                message:`user with email ${req.body.email} does not exist`,
            });
        }
        let  isAlreadyContact = user.contacts.find(id => String(id) === String(contact._id));

        if(isAlreadyContact){
            return res.status(400).send({
                success:false,
                message:`user with email ${req.body.email} already a contact`,
            });
        }

        user.contacts.push(contact._id);
        await user.save();
    
        res.status(201).send({
            success:true,
            contact:{
                id:contact._id,
                email:contact.email,
                username:contact.username
            }
        });
        
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        });
    }
}

export const removeContact = async (req, res) => {
    try{
        const user = await User.findById(req.userId);
        user.contacts = user.contacts.filter(id => String(id) !== req.body.contactId);
        await user.save();
        
        res.status(200).send({
            success:true,
            message:"contact removed succussfully"
        });
    }catch(err){
        res.status(500).send({
            success:false,
            message:err.message
        });
    }
}

export const getuserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate(["contacts", "chats"]);
        
        let userData = {
            id:user._id,
            username:user.username,
            email:user.email,
            contacts:user.contacts.map(contact => (
                {
                    id:contact._id,
                    username:contact.username,
                    email:contact.email
                }
            )),
            chats:user.chats.map(chat => ({
                name:chat.name,
                id:chat._id
            }))
        }
    
        res.status(200).send({
            success: true,
            user:userData,
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message:err.message
        });
    }
}