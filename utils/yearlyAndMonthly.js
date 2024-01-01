const Category = require('../models/Category');
const Expense  = require('../models/Expense');
const mongoose = require('mongoose');
const http = require("http");
const flash           = require('connect-flash');

module.exports = async function yearlyAndMonthly(expenses, Arr){
    const dateToday = new Date();
    let obj_yearly = {};
    let obj_monthly = {};
    Arr.forEach(function(a, i) {
        obj_yearly[a] = 0;
        obj_monthly[a] = 0;
    })
    for (let expense of expenses){
        for (let individiualCategory of Arr) {
            const toCheck = (Arr == Category) ? 'category' : 'mode';
            if ((expense[toCheck] == individiualCategory) && (expense.date.getFullYear() == dateToday.getFullYear())) {
                obj_yearly[individiualCategory] = obj_yearly[individiualCategory] + expense.price;
                if(expense.date.getFullYear() == dateToday.getFullYear()) {
                    obj_monthly[individiualCategory] = obj_monthly[individiualCategory] + expense.price;
                }
            }
        }
    }
    const returnValue = [obj_yearly, obj_monthly];
    console.log(returnValue)
    return returnValue;
}