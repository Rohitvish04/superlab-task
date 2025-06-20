import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true

}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))//use for url encoded like  sapce code is %20
app.use(express.static("public"))
app.use(cookieParser())

//routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter)





export { app };
