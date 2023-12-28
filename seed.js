const mongoose  = require('mongoose');
const User      = require('./models/User');
const Expense   = require('./models/Expense');

async function updater() {
    console.log(await Expense.find().populate('user'));
}

updater();
