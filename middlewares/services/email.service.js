const nodemailer=require('nodemailer');



const emailService=(req,res,next)=>{
    var transporter=nodemailer.createTransport({
        service:"Hotmail",
        auth:{user:"institut-francais-qatar@hotmail.com",
                pass:process.env.PASSWORD}
    })

    var message="<br>Message : "+req.body.message;

    var mailOptions={
        from:"institut-francais-qatar@hotmail.com",
        to:req.body.email,
        subject:"BCDi : Emprunt Livre",
        html:message
    }

    transporter.sendMail(mailOptions,(err,infos)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect("/");
        }else{
            req.flash('success',"Un mail a ete envoye a l'emprunteur: "+req.body.email+" pour l'informer de la date de retour du Livre emprunte");
            return res.redirect('/');
        }
    })

    next();
}

module.exports=emailService;