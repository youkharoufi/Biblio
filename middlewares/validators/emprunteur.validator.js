const {Validator}=require('node-input-validator');

const emprunteurValidator=(req,res,next)=>{

    const v = new Validator(req.body,{
        nom:"required",
        email:"required|email",
        tel:"required",
        nbEmprunts:"required"
    })

    v.check().then((matched)=>{
        if(!matched){
            req.flash('errorForm',v.errors);
            return res.redirect("/emprunter-livre/:id");
        }
    next();
    })
}

module.exports=emprunteurValidator;

