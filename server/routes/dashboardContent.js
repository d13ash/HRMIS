const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

router.get('/projectCount', async (req, res) => {
    var query = 'SELECT COUNT(Project_name) AS project_count FROM m_project';
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});
 
router.get('/workCount', async (req, res) => {
    var query = "SELECT COUNT(alloted_project_work_id) AS countdata FROM alloted_project_work;";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});

router.get('/empCount', async (req, res) => {
    var query = "SELECT COUNT(Emp_id) AS empCount FROM manpower_basic_detail";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});

// Contact-Us
router.post('/Contact', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO contact_us SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});

// GET CONTACT US
router.get('/getTabledata', async (req, res) => {
    var query = "SELECT * FROM contact_us";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});




// Update Department Detail
router.put('/updateMapProDetail/:id',async (req,resp)=>{
    var query = "UPDATE map_project_dept SET ? WHERE ID = ? ";
    var value = req.body;
    var ID = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, ID])
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
    router.delete('/deleteMapdataByid/:id',async (req,res)=>{
        var query = "DELETE FROM map_project_dept WHERE ID = ?";
        var ID = req.params.id;
    try{
        let result = await mysql.exec(query, ID)
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

module.exports = router;