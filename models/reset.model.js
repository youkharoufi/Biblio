const mongoose=require('mongoose');


const resetSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    resetPasswordToken:{
        type:String,
        required:true
    },
    resetExpires:{
        type:Number,
        required:true
        
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
});


module.exports=mongoose.model('Reset',resetSchema);