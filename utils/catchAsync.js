const catchAsync = function(func) {
    return  (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

module.exports = catchAsync;