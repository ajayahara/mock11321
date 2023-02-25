const mongoose=require('mongoose');
const UserDetailsSchema=mongoose.Schema({
    email:String,
    password:String
})
const UserDetailsModel=mongoose.model("User_Details",UserDetailsSchema);
module.exports={
    UserDetailsModel
}