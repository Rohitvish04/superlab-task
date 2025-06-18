import mongoose from "mongoose";

import { db_name } from "../constains.js";
const connectDB= async()=>{
    try{
      const connectInstance= await  mongoose.connect(`${process.env.MONGODBURI}/${db_name}`)
console.log(`connect successfully host : ${connectInstance.connection.host}`)
    }catch(error){
        console.log("mongodb Connection error"+error)
        process.exit(1);
    }
}

export default connectDB;




















