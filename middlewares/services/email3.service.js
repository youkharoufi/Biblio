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
            req.flash('success',"Un mail de rappel a ete envoye a : "+req.body.email+" pour rendre le livre emprunte.");
            return res.redirect('/');
        }
    })
}

module.exports=emailService;