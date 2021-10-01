

exports.guard=(req,res,next)=>{
    if(!req.user){
        req.flash('warning',"Vous devez etre connecte pour acceder a cette fonctionalite");
        return res.redirect('/users/login');
    }
    next();
}
