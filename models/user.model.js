const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    prenom:{
        type:String,
        required:true
    },
    nom:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    books:{
        type:Array
    }
})

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;