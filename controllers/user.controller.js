const User = require("../models/user.model");
const passport=require('passport');
const Book=require('../models/livre.model');
const randomToken=require('random-token');
const Reset=require('../models/reset.model');





exports.signup=(req,res)=>{
    const user=new User({
        username:req.body.username,
        prenom:req.body.prenom,
        nom:req.body.nom,
        email:req.body.email
    })

    User.register(user,req.body.password,(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/signup');
        }

        req.flash('success',"Felicitations, vous etes enregistre");
        return res.redirect('/users/login');
    })
}

exports.login=(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    })

    req.login(user,(err)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/login')
        }

        passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Unable to authenticate'})(req,res,(err,user)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/users/login');
            }

            req.flash('success','Felicitations, Vous etes a present connecte');
            return res.redirect('/');
        })
    })


}

exports.list=(req,res)=>{
    Book.find({author:req.user._id}).then((books)=>{return res.render('list',{books:books})}).catch(()=>{return res.redirect('/')});
}

exports.forgotPassword=(req,res,next)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/forgot-password');
        }
        if(!user){
            req.flash('error',"Aucun utilisateur trouve avec cet identifiant");
            return res.redirect('/users/forgot-password');
        }

        const token=randomToken(32);

        const reset=new Reset({
            username:req.body.username,
            resetPasswordToken:token,
            resetExpires:Date.now()+3600000
        })

        reset.save((err,reset)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/users/forgot-password');
        }

        console.log(token);

        req.body.email=user.email;
        req.body.message="Bonjour "+user.prenom+" Utilisez le lien suivant pour reinitialiser votre mot de passe : <br>"+req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;

        next();

            })
        })
    }

    exports.resetPassword=(req,res)=>{
        const token=req.params.token
        Reset.findOne({resetPasswordToken:token,resetExpires:{$gt:Date.now()}},(err,reset)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/users/forgot-password');
            }
            if(!reset){
                req.flash('error',"Invalid Token");
                return res.redirect('/users/forgot-password')
            }

            req.flash('success',"Veuillez entrer votre nouveau mot de passe :");
            return res.render('reset-password');
            
        })
    }

    exports.resetPasswordPost=(req,res)=>{
        const token=req.params.token;
        const password=req.body.password;

        Reset.findOne({resetPasswordToken:token,resetExpires:{$gt:Date.now()}},(err,reset)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/users/reset-password/'+token);
            }
            if(!reset){
                req.flash('error',"Invalid Token");
                return res.redirect('/users/reset-password/'+token);
            }
        User.findOne({username:reset.username},(err,user)=>{
                if(err){
                    req.flash('error',err.message);
                    return res.redirect('/users/reset-password/'+token);
                }
                if(!user){
                    req.flash('error',"Aucun utilisateur trouve avec cet identifiant");
                    return res.redirect('/users/reset-password/'+token);
                }
        user.setPassword(password,(err)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/reset-password/'+token);
            }

            user.save();

            Reset.deleteMany({username:user.username},(err,message)=>{
                if(err){
                    console.log(err);
                }

                console.log(message);
            })

            req.flash("success","Votre mot de passe a bien ete reinitialise");
            return res.redirect("/users/login");
                    })
                })
            })

    }
