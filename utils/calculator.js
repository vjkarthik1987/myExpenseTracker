const Expense = require('../models/Expense');

const sumField = function convertArray(arr, field) {
    const convertedArr =  arr.map(arrItem => arrItem[field]);
    return convertedArr.reduce(function (acc, curr) {
        return acc + curr;
    });
}

module.exports = sumField;
