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
const {isLoggedIn}      = require('../middleware');
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

router.get('/index', isLoggedIn, catchAsync(async (req, res) => {
    console.log(req.user);
    const currentUserId = req.user._id;
    const expenses = await Expense.find({user: currentUserId}).exec();
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

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    //658714ae91d787de9fef39d8
    const foundExpense = await Expense.findById(id);
    const user = await User.findById(foundExpense.user.toString());
    console.log(user);
    res.render('./expenses/getExpense', {foundExpense: foundExpense, user: user});
}))


module.exports = router;
