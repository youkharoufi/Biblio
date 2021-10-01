const mongoose=require('mongoose');


const emprunteurSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    tel:{
        type:Number,
        required:true
    },
    dateEmprunt:{
        type:Date,
        default:Date.now()
    },
    nbEmprunts:{
        type:Number,
        required:true
    },
    livre:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Emprunteur=mongoose.model('Emprunteur',emprunteurSchema);

module.exports=Emprunteur;