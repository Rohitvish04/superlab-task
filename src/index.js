

import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
    path: "./.env"
});
// console.log( process.env.MONGODBURI);


connectDB()
.then(()=>{
app.listen(process.env.PORT|| 8000,()=>{
  console.log(`server runing on port ${process.env.PORT}`)
})

})
.catch((error)=>{
  console.log(`monogodb connection failed ${process.env.PORT}, ${error}`)
  app.on((error)=>{
    console.log(error)
    throw error
  })
})










// import express from "express";
// const app=express()
// ;(async()=>{
//     try{
//         mongoose.connect(`${process.env.MONGOURI}/${db_name}`)
//             app.on("error",(error)=>{
//                 console.log(error)
//                 throw error
//             })
//             app.listen(process.env.PORT,()=>{
//                 console.log(`app is runing ${process.env.PORT}`)
//             })
//     }
//     catch(error){
//             console.log(error)
//             throw error
//     }
// })()