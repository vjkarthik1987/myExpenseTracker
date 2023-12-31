const express         = require('express');
const router          = express.Router();
const catchAsync      = require('../utils/catchAsync');
const Expense         = require('../models/Expense');
const Category        = require('../models/Category');
const Mode            = require('../models/Mode');
const ExpressError    = require('../utils/ExpressError');
const Joi             = require('joi');
const expenseSchema   = require('../schemas');
    const flash           = require('connect-flash');
const {isLoggedIn}    = require('../middleware');
const sumField        = require('../utils/calculator');
const forDashboard    = require('../utils/forDashboard')
const calcValues      = require('../utils/yearlyAndMonthly');

const User = require('../models/User');
const validateExpense = (req, res, next) => {
    const {item, price, date, category, mode, shop, note} = req.body;
    const result = expenseSchema.validate({item, price, date, category, mode, shop, note});
    if (result.error) {
        throw new ExpressError(result.error.details, 400);
    }
    else {
        next();
    }
}

router.get('/home', async (req, res) => {
    const expenses = await Expense.find({user: req.user._id}).exec();
    let details = {
        year:0,
        month:0,
        yesterday:0,
        today:0,
        credit:0,
        cash:0,
        account:0,
        wallet:0,
        yearlyAverage:0,
        monthlyAverage:0
    };
    const editedDetails = forDashboard(expenses, details)
    res.render('index', {total: (req.user) ?  sumField(expenses, 'price') : 0, details:editedDetails})
})

router.get('/index', isLoggedIn, catchAsync(async (req, res) => {
    const currentUserId = req.user._id;
    const expenses = await Expense.find({user: currentUserId}).sort({date:-1}).exec();
    res.render('./expenses/index', {expenses: expenses})
}))

router.get('/add', isLoggedIn, (req, res) => {
    res.render('./expenses/addExpense', {categories: Category, modes: Mode});
})

router.post('/', validateExpense, isLoggedIn, catchAsync(async (req, res, next) => {
    const {item, price, date, category, mode, shop, note} = req.body;
    const user = req.user._id;
    Expense.create({
        item: item,
        price: parseInt(price),
        date: new Date(date),
        category: category,
        mode: mode,
        shop: shop,
        note: note,
        user: user,
    })
    req.flash('success', 'Successfully added new expense!');
    res.redirect('/expenses/index');
}))


router.get('/:id/update', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundExpense = await Expense.findById(id);
    res.render('./expenses/updateExpense', {categories: Category, modes: Mode, expense: foundExpense});
}))

router.patch('/:id/update', validateExpense, isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const {item, price, date, category, mode, shop, note} = req.body;
    const foundExpense = await Expense.findByIdAndUpdate(id, {
        item: item,
        price: parseInt(price),
        date: new Date(date),
        category: category,
        mode: mode,
        shop: shop,
        note: note
    })
    req.flash('success', 'Successfully updated expense');
    res.redirect('/expenses/index');
}))

router.delete('/:id/delete', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const foundExpense = await Expense.findByIdAndDelete(id).then(console.log("Deleted")).catch(e => console.log(e));
    req.flash('success', 'Successfully deleted expense');
    res.redirect('/expenses/index');
}))

router.get('/categories', isLoggedIn, catchAsync(async (req, res) => {
    const expenses =  await Expense.find({user: req.user._id}).sort({date:-1}).exec();
    const calculatedValues = await calcValues(expenses, Category);
    res.render('./expenses/categories', {categoryWiseExpenses_Year: calculatedValues[0], categoryWiseExpenses_Month: calculatedValues[1]});
}));

router.get('/modes', isLoggedIn, catchAsync(async (req, res) => {
    const expenses =  await Expense.find({user: req.user._id}).sort({date:-1}).exec();
    const calculatedValues = await calcValues(expenses, Mode);
    res.render('./expenses/modes', {categoryWiseExpenses_Year: calculatedValues[0], categoryWiseExpenses_Month: calculatedValues[1]});
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    //658714ae91d787de9fef39d8
    const foundExpense = await Expense.findById(id);
    const user = await User.findById(foundExpense.user.toString());
    res.render('./expenses/getExpense', {foundExpense: foundExpense, user: user});
}))



module.exports = router;
