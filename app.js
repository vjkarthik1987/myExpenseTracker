//Importing modules
const express        = require('express');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const path           = require('path');
const session        = require('express-session');
const flash          = require('connect-flash');
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const MongoDBStore   = require('connect-mongo');
const mongoose       = require('mongoose');
const dotenv         = require('dotenv').config();
const app            = express();

//Importing models
const Expense        = require('./models/Expense');
const Category       = require('./models/Category');
const Mode           = require('./models/Mode');
const User           = require('./models/User');

//Importing other stuff and defining variables
const sumField       = require('./utils/calculator');
const catchAsync     = require('./utils/catchAsync');
const ExpressError   = require('./utils/ExpressError');
const expenses       = require('./routes/expenses');
const users          = require('./routes/users');
const dbUrl          = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected');
})

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});


const sessionConfig  = {
    store: store,
    secret: 'thisisthesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000*60*60*24*7),//Expires after a week
        maxAge: 1000*60*60*24*1,
        httpOnly: true,
    } 
}

//Setting app defaults
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Defining app middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Session and Flash
app.use(session(sessionConfig));
app.use(flash());

//Passport linked to app
app.use(passport.initialize());
app.use(passport.session());

//Flash Message
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success     = req.flash('success');
    res.locals.error       = req.flash('error');
    next();
});

//Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.use('/expenses', expenses);
app.use('/users', users);

//Main Home Route
app.get('/', (req, res) => {
    res.render('home');
})

//Route for pages that are not found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

//General Error Handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', {err: err});
})

app.listen(3000 || process.env, () => {
    console.log('Server started');
})