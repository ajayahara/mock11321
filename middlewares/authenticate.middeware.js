const jwt=require("jsonwebtoken")


const authenticate=(req,res,next)=>{
    const {token}=req.headers;
    if(token==undefined){
        res.send({"msg":"Please Login"})
    }else{
       const data=jwt.verify(token,process.env.KEY);
       if(data){
        req.body.user_id=data.user_id;
        next()
       }else{
        res.send({"error":"Eroor while verifying"})
       }
    }
}
module.exports={
    authenticate
}