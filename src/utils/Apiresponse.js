class Apiresponse {
    constructor(statuscode,data,Message="success"){
        this.statuscode=statuscode
        this.Message=Message
        this.data=data
        this.success=statuscode < 400
    }
}
export {Apiresponse}