const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');



router.get('/', async (req, res) => {
    var query = "SELECT Project_Type_ID,Project_Type_Name FROM m_project_type";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");

    return res.json(result);

});








module.exports = router;