const categoryModel = require("../models/category");
const responseHelper = require("../helpers/sendResponse");

const getCategory = (req, res) => {
categoryModel
.getCategory().then(({status, result}) => {
    responseHelper.success(res, status, {
        msg: "Category",
        data: result,
    })
}).catch(({status, err}) => {
    console.log(err)
    responseHelper.error(res, status, err)
});
};

module.exports = { getCategory };
