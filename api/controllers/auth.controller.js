import DB from "../models/index.js";
import jwt from 'jsonwebtoken';

const User = DB.user;
const RefreshToken = DB.refreshToken;

export const register = async (req, res) =>{
    try{
        const user = await User.create(req.body);
        const token = user.getJwtToken();
        const refreshToken = await RefreshToken.createToken(user);

        res.status(201).send({
            success: true,
            user,
            token,
            refreshToken
        });

    }catch(err){
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

export const login = async (req, res) => {

    try{
        const user = await User.findOne({email: req.body.email})
            .select("+password").populate(["contacts", "chats"]);

        if(!user){
            return res.status(404).send({
                success: false,
                message:`User with email ${req.body.email} does not exist`
            });
        }
        const isPasswordCorrect = user.compatePasswords(req.body.password);
        if(!isPasswordCorrect){
            return res.status(400).send({
                success: false,
                message:`Incorrect Password`
            });
        }

        const token = user.getJwtToken();
        let refreshToken = await RefreshToken.findOne({user:user._id});
        if(refreshToken){
            refreshToken = refreshToken.token
        }else{
            refreshToken = await RefreshToken.createToken(user);
        }
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
            token,
            refreshToken,
        });

    }catch(err){
        res.status(500).send({
            success: false,
            message:err.message
        });
    }
}

export const refreshToken = async (req, res) => {
    try{
        const  _requestToken = req.body.requestToken; 

        if(_requestToken === null){
            return res.status(403).send({message: "Refresh Token is required!"});
        }
    
        const refreshToken = await RefreshToken.findOne({token: _requestToken});
        if(!refreshToken){
            return res.status(403).json({ message:"Refresh token is not in database!"});
        }
        
        // verify if it is not expired yet
        if(RefreshToken.verifyExpiration(refreshToken)){
            await RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false });
    
            return res.status(403).json({
                message: "Refresh token was expired. Please make a new login request",
            });
        }
    
        // the refresh token is valid so create a new token
        let newAccessToken = jwt.sign(
            { id: refreshToken.user._id}
            , process.env.JWT_SECRET, 
            {expiresIn: parseInt(process.env.JWT_EXPIRE)}
        );
    
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    }catch(err){
        console.log(err);
        res.status(500).send({message:err.message});
    }
}