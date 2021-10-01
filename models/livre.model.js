const mongoose=require('mongoose');

const livreSchema=mongoose.Schema({
    titre:{
        type:String,
        required:true
    },
    auteur:{
        type:String,
        required:true
    },
    categorie:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    resume:{
        type:String,
    },
    publishedAt:{
        type:Date,
        default:Date.now()
    },
    nbExemplaires:{
        type:Number,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})

const Livre=mongoose.model('Livre',livreSchema);

module.exports=Livre;