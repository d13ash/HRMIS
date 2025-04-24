const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const path = require('path');
const { error } = require('console');
//for financial_year in dropdown
router.get('/getfinancialyear', async (req, res) => {

    var query = "SELECT * FROM m_financial";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("year not found");
        }
        return res.json(result);         
    } 
    catch (err) {

        return res.status(404).json(err);
    }
});
//for getting all the of table finance_budget_master for budget form
router.get('/getalldata', async (req, res) => {

    var query = "SELECT * FROM finance_budget_master";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("data not found");
        }
        return res.json(result);         
    } 
    catch (err) {

        return res.status(404).json(err);
    }
});

//for post all the value in table finance_budget_master
router.post('/Postfinance_budget_master', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO finance_budget_master SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});

// for table
router.get('/mattable', async (req, res) => {
    var query = "SELECT * FROM finance_budget_master p INNER JOIN m_financial m ON p.financial_id=m.financial_id where p.Delete_YN is null";
    console.log("called");
    let result = await mysql.exec(query);
    return res.json(result);
});


  router.put('/update/:id',async (req,resp)=>{
    var query = "UPDATE finance_budget_master SET ? WHERE budget_head_id = ? ";
    var value = req.body;
    var resource_assignment_main_ID = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, resource_assignment_main_ID])
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({status: "success" })    
     }
     catch(err){
            if(err){
                return resp.status(404).send(err);   
  }
}
})
router.delete('/delete/:id',async (req,resp)=>{

    var query = "UPDATE finance_budget_master p set p.Delete_YN='Y' WHERE p.budget_head_id= ?";
    var id = req.params.id;
    
try{
    let result = await mysql.exec(query, id)
    if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
        return resp.status(404).send('error');     
    }
    return resp.json({status: "data deleted" })
}

catch(err){
    if(err){
        return resp.status(404).send('error'); }
    }
})









module.exports = router;