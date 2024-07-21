import Jwt  from 'jsonwebtoken';
import { usermodel } from '../../DB/Models/user.model.js';


export const isAuth = ()=>{
    return async(req , res , next)=>{
        const {authorization} = req.headers;

        if(!authorization){
           return res.status(400).json({Message : "Please login first.."}) 
        }
        /* if(!authorization.startsWith('Trello')){
            return res.status(400).json({Message : "Invalid token prefix.."})
        } */

        const deCodedData = Jwt.verify(authorization.split(" ")[1], process.env.PrivateKey)

        if(!deCodedData || !deCodedData._id){
            return res.status(400).json({Message : "Invalid token.."})
        } 
        
        const finduser = await usermodel.findById(deCodedData._id , 'username email');
        if(!finduser){
            return res.status(400).json({Message : "Please sign up first.."})
        }

        req.authUser = finduser;
        next();
    }
}

export const isAuthTask = ()=>{
    return async(req , res , next)=>{
        const {authorization} = req.headers;

        if(!authorization){
           return res.status(400).json({Message : "Please login first.."}) 
        }
        /* if(!authorization.startsWith('Trello')){
            return res.status(400).json({Message : "Invalid token prefix.."})
        }*/

        const deCodedData = Jwt.verify(authorization.split(" ")[1], process.env.PrivateKey)

        if(!deCodedData || !deCodedData._id){
            return res.status(400).json({Message : "Invalid token.."})
        }

        const finduser = await usermodel.findOne({ _id: deCodedData._id }, 'username email isLogged isDeleted');
        if(!finduser){
            return res.status(400).json({Message : "Please sign up first.."})
        }
        
        if (!finduser.isLogged || finduser.isDeleted) {
            return res.status(400).json({ Message: 'Please log in first...' });
        }

        req.authUser = finduser;
        next();
    }
}