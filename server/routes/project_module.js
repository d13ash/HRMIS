const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();  
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');

router.get('/getModule_type', async (req, res) => {
    var query = "SELECT * FROM project_module_type";
    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("Course Not Found");
        }
        return res.json(result);         
    } 
    catch (err) {

        return res.status(404).json(err);
    }
});


router.get('/getallProject_module', async (req, res) => {
    var query ="SELECT m.project_module_id,m.Description, m.module_name, m.module_Short_Name, p.project_module_type_id,p.project_module_type_name FROM project_module m left JOIN project_module_type p  ON p.project_module_type_id = m.project_module_type_id WHERE m.Delete_YN IS null"  
    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("Course Not Found");
        }
        return res.json(result);  
    } 
    catch (err) {
        return res.status(404).json(err);
    }
});

// post data in assign detail
router.post('/postprojectmodule', async (req, res) => {
   
    var values = req.body;
    var query = "INSERT INTO project_module SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});



// Update Department Detail
router.put('/updatemodule/:id',async (req,resp)=>{
    var query = "UPDATE project_module SET ? WHERE project_module_id = ? ";
    var value = req.body;
    var project_module_id = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, project_module_id])
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

// Delete departmetnt detail
    router.delete('/deletedataByid/:id',async (req,res)=>{
        var query = "update project_module SET Delete_YN ='Y' where project_module_id = ?";
        // var query = "DELETE FROM resource_assignment_main WHERE resource_assignment_main_ID = ?";
        var project_module_id = req.params.id;
    try{
        let result = await mysql.exec(query, project_module_id)
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return res.status(404).send('error...');     
        }
        return res.json({status: "data deleted" })
    }
    catch(err){
        if(err){
            return res.status(404).send('error.'); }
      }
    })

module.exports = router;