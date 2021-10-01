var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const User=require('./models/user.model');
const Category=require('./models/categorie.model');
const Book=require('./models/livre.model');
const dotenv=require('dotenv').config;

var app = express();

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  //cookie:{secure:true}
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');






mongoose.connect(process.env.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("Connection to database successfull")}).catch(()=>{console.log('connection to database failed')});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('body-parser').urlencoded({ extended: true }));

//Init passport (apres session)
app.use(passport.initialize());
app.use(passport.session());

//passport local mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Init flash :

app.use(flash());

/*app.use((req,res,next)=>{
  if(req.user){
    Book.find({author:req.user._id},(err,books)=>{
      if(err){
        console.log(err);
      }else{

      res.locals.books=books;
    }
    next();
  })
  }else{
    next();
  }
})*/

app.use((req,res,next)=>{
  if(req.user){
    res.locals.user=req.user;
  }
  res.locals.warning=req.flash('warning');
  res.locals.error=req.flash('error');
  res.locals.success=req.flash('success');
  res.locals.errorForm=req.flash('errorForm');
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
