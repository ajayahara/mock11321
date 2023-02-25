const express=require("express");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const { connection } = require("./config/db.js");
const { UserModel } = require("./models/User.model.js");
const bcrypt=require("bcrypt");
const { authenticate } = require("./middlewares/authenticate.middeware.js");
const { UserDetailsModel } = require("./models/UserDetails.model.js");
const app=express()
app.use(cors());
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("You Are In Home Page")
})
app.post('/register',async (req,res)=>{
    const {email,password}=req.body;
    try {
       const users =await UserModel.find({email:email});
       if(users.length>0){
        res.send({"msg":"Registered Already"})
       }else{
        bcrypt.hash(password,5,async (error,hash)=>{
            if(error){
                res.send(error)
            }else{
                const new_user=new UserModel({email:email,password:hash});
                await new_user.save();
                res.send({"msg":"Registered Successfully"})
            }
        })
       }
    } catch (error) {
        res.send({error})
    }
})
app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    try {
       const users =await UserModel.find({email:email});
       if(users.length===0){
        res.send({"msg":"No user found"})
       }else{
       const match=await bcrypt.compare(password,users[0].password);
       if(match){
        const token=jwt.sign({user_id:users[0]._id},process.env.KEY)
        res.send({"msg":"login sucess",token:token})
       }else{
        res.send({"error":"Wrong Credential"})
       }
       }
    } catch (error) {
        res.send({error})
    }
})
app.use(authenticate)
app.get("/getDetails",async (req,res)=>{
    const {user_id}=req.body;
    try {
        const details=await UserDetailsModel.find({user_id:user_id});
        res.send(details)
    } catch (error) {
        res.send({error})
    }
})
app.post("/details",async (req,res)=>{
   
   try {
    const new_details=new UserDetailsModel(req.body)
    new_details.save()
    res.send({"msg":"Addeed Successfully"})
   } catch (error) {
    res.send({error})
   }
})
app.patch("/details",async (req,res)=>{
    const {user_id}=req.body;
    try {
        const details=await UserDetailsModel.find({user_id:user_id});
        await UserDetailsModel.findByIdAndUpdate(details[0]._id,req.body);
        res.send({"msg":"Updated Successfully"})
    } catch (error) {
        res.send({error})
    }
})

app.listen(process.env.PORT,async ()=>{
    try {
        await connection
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
})