import jwt from 'jsonwebtoken';
import DB from '../models/index.js';

const User = DB.user;

const { TokenExpiredError } = jwt;
const catchError = (err, res) => {
    if(err instanceof TokenExpiredError){
        return res.status(401).send({message: "Unauthorized! Access Token was expired!"});
    }

    return res.status(401).send({message: "Unauthorized!"});
}

export const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({message: "No token is provided!!"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            console.log(err);
            return catchError(err, res);
        }

        req.userId = decoded.id;
        next();
    });
}
