const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

router.post('/addcategory', async (req, res) => {
    // const { error } = validateEmployeedata(req.body);
    // if (error) {
    //     res.status(404).send(error.details[0].message);
    // }
    var values = req.body;
    var query = "INSERT INTO resource_stock_category SET ? ";
  
    try {
  
      let data = await mysql.exec(query, values);

      res.json({
        id: data.insertId,
      });
    } catch (err) {
  
      return res.status(404).json(err);
    }
  });

  router.post('/addsubcategory', async (req, res) => {
    // const { error } = validateEmployeedata(req.body);
    // if (error) {
    //     res.status(404).send(error.details[0].message);
    // }
    var values = req.body;
    var query = "INSERT INTO resource_stock_subcategory SET ? ";
  
    try {
  
      let data = await mysql.exec(query, values);

      res.json({
        id: data.insertId,
      });
    } catch (err) {
  
      return res.status(404).json(err);
    }
  });

router.post('/additem', async (req, res) => {
    // const { error } = validateEmployeedata(req.body);
    // if (error) {
    //     res.status(404).send(error.details[0].message);
    // }
    var values = req.body;
    var query = "INSERT INTO resource_stock_item_master SET ? ";
  
    try {
  
      let data = await mysql.exec(query, values);

      res.json({
        id: data.insertId,
      });
    } catch (err) {
  
      return res.status(404).json(err);
    }
  });

  
router.get('/allitem', async (req, res) => {
    var query = "SELECT i.item_id,i.item_name,c.category_id,c.category_name,s.sub_category_id,s.sub_category_name,i.Description FROM resource_stock_item_master i LEFT JOIN resource_stock_category c ON i.category_id = c.category_id LEFT JOIN resource_stock_subcategory s ON i.sub_category_id = s.sub_category_id;";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});

router.put('/updateallitem/:id',async (req,resp)=>{

    // const {error} = validateCourse(req.body)
    // if (error){
    //    return resp.status(404).send(error.details[0].message) 
    // }
    var query = "UPDATE resource_stock_item_master SET ? WHERE item_id = ? ";
    var value = req.body;
    var item_id = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, item_id])
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({status: "success" })    
     }
     catch(err){
            if(err){
                return resp.status(404).send('error');   
  }
}
})

router.delete('/deletedByid/:ID',async (req,res)=>{
    var query = "DELETE FROM resource_stock_item_master WHERE item_id = ?;";
    var Employee_ID = req.params.ID;
  try{
    let result = await mysql.exec(query, Employee_ID)
    if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
        return res.status(404).send('error...');     
    }
    return res.json({status: "data deleted" })
  }
  
  catch(err){
    if(err){
        return res.status(404).send('error'); }
  }
  })

module.exports = router;