// const asynhandler=(requeshandler)=>{
//     (req,res,next)=>Promise.resolve(requeshandler(req,res,next))  
//     .catch(error=>next(error))  
// }




const asynhandler=(fun)=>async(req,res,next)=>{
        try{
            return await fun(req,res,next)
        }catch(error){
             const statusCode = typeof error.statusCode === "number" ? error.statusCode : 500;
            res.status(statusCode).json({
                success:false,
                Message:error.message
            })
        }
}
export default asynhandler

