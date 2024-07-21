import { connect } from 'mongoose';

export const DBconnection = async()=> {
    return await connect('mongodb://127.0.0.1:27017/Trello')
    .then((res)=> console.log("DB CONNECTION SUCCESS"))
    .catch((err)=> console.log("DB CONNECTION FAIL" , err))
}