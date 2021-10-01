var express = require('express');
var router = express.Router();
const userController=require('../controllers/user.controller');
const signupValidator=require('../middlewares/validators/signup.validator');
const loginValidator=require('../middlewares/validators/login.validator');
const emailService=require('../middlewares/services/email2.service');
const {guard}=require('../middlewares/guard')

/* GET users listing. */
router.get('/signup',(req,res)=>{
  return res.render('signup');
})

router.post('/signup',signupValidator, userController.signup);

router.get('/login',(req,res)=>{
  return res.render('login');
})

router.post('/login',loginValidator,userController.login);

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success',"Vous etes deconnecte");
  return res.redirect('/');
})

router.get('/books',guard, userController.list);

router.get('/forgot-password',(req,res)=>{
  return res.render('forgot-password');
});

router.post('/forgot-password',userController.forgotPassword, emailService);

router.get('/reset-password/:token',userController.resetPassword);

router.post('/reset-password/:token', userController.resetPasswordPost);


module.exports = router;
