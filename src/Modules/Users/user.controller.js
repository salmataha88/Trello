import { usermodel } from '../../../DB/Models/user.model.js';
import bcrypt from 'bcrypt'
import Jwt  from 'jsonwebtoken';

export const signUP = async(req , res , next)=>{
    const {username , email , password , cPassword , gender , Phone , age } = req.body;
        
    if (password !== cPassword) {
        return res.status(400).json({ Message: 'Passwords do not match' });
    }

    const check = await usermodel.findOne({email});
    if(check){
        return res.status(400).json({Message : 'Email is already exist'})
    }
    
    const hashedPass = bcrypt.hashSync(password , +process.env.SALT_ROUNDS );

    const user = new usermodel({
        username , email , password: hashedPass , gender , Phone , age
    });
    await user.save();

    res.status(201).json({Message : "SignUp Successfully.."}) 
}

export const signIn = async(req , res , next)=>{

    const { email , password } = req.body;
        
    const checkUser = await usermodel.findOne({email});

    if(!checkUser){
        return res.status(400).json({Message : 'Please SignUp first..'})
    }
    
    const passMatch = bcrypt.compareSync(password , checkUser.password); 
    if(!passMatch){
        return res.status(400).json({Message : 'Invalid email or password'})
    }
    
    const userToken = Jwt.sign(
        {email , _id:checkUser._id , username : checkUser.username},
        process.env.PrivateKey ,
        {expiresIn : '1h'}
    )  

    checkUser.isLogged = true;
    await checkUser.save();

    res.status(200).json({Message : "SignIn Successfully.." , userToken}) 
}

export const updatePass= async(req , res , next)=>{

    const {_id} = req.authUser;

    const { oldPassword , newPassword , cPassword} = req.body;
    const { userID} = req.query; 
    
    const checkUser = await usermodel.findById(userID);
    if(!checkUser){
        return res.status(400).json({Message : 'Invalid userID...'})
    }

    if(!checkUser.isLogged || checkUser.isDeleted){
        return res.status(400).json({Message : 'Please Login First...'})
    }

    if(checkUser._id.toString() !== _id.toString()){
        return res.status(401).json({Message : 'unauthorized to take this action..'})
    }

    const passMatch = bcrypt.compareSync(oldPassword , checkUser.password); 
    if(!passMatch){
        return res.status(400).json({Message : 'Invalid Old Password'})
    }

    if (newPassword !== cPassword) {
        return res.status(400).json({ Message: 'Passwords do not match' });
    }

    const hashedPass = bcrypt.hashSync(newPassword , +process.env.SALT_ROUNDS );

    const user = await usermodel.findByIdAndUpdate({_id : userID} , {password: hashedPass})
    
    res.status(200).json({Message : "Updated Successfully.." })  
} 

export const updateUser = async(req , res , next)=>{

    const {_id} = req.authUser;

    const { username , age , Phone} = req.body;
    const { userID} = req.query; 
    
    const checkUser = await usermodel.findById(userID);
    if(!checkUser){
        return res.status(400).json({Message : 'Invalid userID...'})
    }

    if(checkUser.isLogged == false || checkUser.isDeleted == true){
        return res.status(400).json({Message : 'Please Login First...'})
    }

    if(checkUser._id.toString() !== _id.toString()){
        return res.status(401).json({Message : 'unauthorized to take this action..'})
    }
    const user = await usermodel.findByIdAndUpdate({_id : userID} , {username , age , Phone } , {new : true})
    
    res.status(200).json({Message : "Updated Successfully.." , user})  
} 

export const deleteUser = async(req , res , next)=>{

    const {_id} = req.authUser;
    const checkUser = await usermodel.findById(_id);

    if(!checkUser){
        return res.status(400).json({Message : 'Please SignUp first..'})
    }
    if(!checkUser.isLogged){
        return res.status(400).json({Message : 'Please Log in first..'})
    }
    
    await usermodel.findByIdAndDelete(_id);

    res.status(200).json({Message : "User Deleted Successfully.."}) 
}

export const softDelete = async(req , res , next)=>{

    const {_id} = req.authUser;
    const checkUser = await usermodel.findById(_id);

    if(!checkUser){
        return res.status(400).json({Message : 'Please SignUp first..'})
    }
    if(!checkUser.isLogged){
        return res.status(400).json({Message : 'Please login first..'})
    }
    if(checkUser.isDeleted){
        return res.status(400).json({Message : 'Already Deleted..'})
    }
    checkUser.isDeleted = true;
    await checkUser.save();

    res.status(200).json({Message : "Deleted temporarily.."}) 
}

export const logOut = async(req , res , next)=>{

    const {_id} = req.authUser;
    const checkUser = await usermodel.findById(_id);

    if(!checkUser){
        return res.status(400).json({Message : 'Please SignUp first..'})
    }
    if(checkUser.isLogged === false){
        return res.status(400).json({Message : 'Already logged out..'})
    }
    checkUser.isLogged = false;
    await checkUser.save();

    res.status(200).json({Message : "Logged out Successfully.."}) 
}
