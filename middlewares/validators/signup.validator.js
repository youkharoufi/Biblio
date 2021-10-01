const {Validator} = require('node-input-validator');

const signupValidator=(req,res,next)=>{
    const v=new Validator(req.body,{
        username:'required',
        prenom:'required',
        nom:'required',
        email:'required|email',
        password:'required',
        passwordConfirm:'required|same:password'
    })

    v.check().then((matched)=>{
        if(!matched){
            req.flash('errorForm',v.errors);
            return res.redirect('/users/signup');
        }
        next();
    })
}

module.exports=signupValidator;