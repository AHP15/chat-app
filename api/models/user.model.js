import mongoose from 'mongoose';
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please enter username"]
    },
    email:{
        type: String,
        required: [true, "Please enter a user email!!"],
        validate:[validator.isEmail, "Please enter a valid email!!"],
        unique: true
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minlength: [8, "name must have at leat 8 characters!!"],
        select: false,
    },
    contacts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    chats:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    role:{
        type:String,
        default:"user"
    }
});

userSchema.pre("save", function(next){
    
    if(!this.isModified("passowrd")){
        next();
    }

    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: parseFloat(process.env.JWT_EXPIRE)
    });
}

userSchema.methods.compatePasswords = function(clientPassword){
    return bcrypt.compareSync(clientPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;