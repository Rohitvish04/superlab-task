class ApiError extends Error{
    constructor(
        statuscode,
        Message="not found",
        errors=[],
        stack=""
    ){
        super(Message)
        this.statuscode=statuscode
        this.erros=errors
        this.data=null
        this.success=false
        this.Message=Message
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constrouctor)
        }
    }
}

export {ApiError}
