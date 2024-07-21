import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type : String,
        enum : ['female' , 'male' , 'not specified'],
        default : 'not specified'
    },
    Phone:{
        type:String,
        required:true,
        unique:true,
    },
    isLogged:{
        type :Boolean,
        default : false
    },
    isDeleted : {
        type :Boolean,
        default : false
    }
});

//Export the model
export const usermodel = model('User', userSchema);