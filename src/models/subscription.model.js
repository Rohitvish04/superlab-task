import mongoose, { Schema } from "mongoose";

   const subscriptionshema=new mongoose.Schema({
    subscrber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    chennal:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
   })

   export const subscription=mongoose.model("subscription",subscriptionshema)