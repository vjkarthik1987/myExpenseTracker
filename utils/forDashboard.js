function checkDateEquality(firstDate, secondDate){
    return ((firstDate.getDate() ==  secondDate.getDate()) && (firstDate.getMonth() ==  secondDate.getMonth()) && (firstDate.getMonth() ==  secondDate.getMonth()))
}

function forDashboard(expenses, details){
    const editedDetails = details;
    const modes = require('../models/Mode');
    const dateToday = new Date();
    const dateYesterday = new Date(dateToday - 1000*60*60*24) 
    
    for (let expense of expenses) {
        //Checking for same year and same month
        if (expense.date.getFullYear() ==  dateToday.getFullYear()){
            details.year = details.year + expense.price;
            if (expense.date.getMonth() ==  dateToday.getMonth()){
                details.month = details.month + expense.price;
            }
        }
        //Checking for yesterday
        if (checkDateEquality(expense.date, dateYesterday)){ 
            details.yesterday = details.yesterday + expense.price;
        }

        //Checking for today
        if (checkDateEquality(expense.date, dateToday)){
            details.today = details.today + expense.price;
        }

        //Checking for different modes
        for (let individialMode of modes) {
            if (expense.mode == individialMode) {
                editedDetails[individialMode.toLowerCase()] = editedDetails[individialMode.toLowerCase()] + expense.price;
            }
        }  
    }
    return editedDetails;
}

module.exports = forDashboard;
