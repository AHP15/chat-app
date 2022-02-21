import mongoose from 'mongoose';
import User from "./user.model.js";
import Chat from "./chat.model.js";
import RefreshToken from "./RefreshToken.model.js";

const DB = {
    mongoose,
    chat:Chat,
    user:User,
    refreshToken:RefreshToken,
}

export default DB;
