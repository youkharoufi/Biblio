const mongoose=require('mongoose');


const categorieSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
})


const Categorie=mongoose.model('Categorie',categorieSchema);

module.exports=Categorie;