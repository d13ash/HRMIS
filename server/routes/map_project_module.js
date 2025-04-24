const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

router.get('/getmapData', async (req, res) => {
    var query = 'SELECT w.Map_module_id,p.Project_name,m.module_name,w.Description,w.Delete_YN,p.Project_ID,m.project_module_id FROM map_project_module w  left JOIN m_project p ON p.Project_ID = w.Project_ID  left JOIN project_module m ON m.project_module_id = w.project_module_id WHERE w.Delete_YN IS NULL ';
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});
// get only two fields
router.get('/getallProject', async (req, res) => {
    var query = " SELECT Project_ID,Project_name FROM  m_project";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/getallModule', async (req, res) => {
    var query = " SELECT project_module_id,module_name FROM  project_module";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});



// post data in project_map detail
router.post('/postMapData', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
    var values = req.body;
    var query = "INSERT INTO map_project_module SET ? ";
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
router.put('/updateMapProDetail/:id',async (req,resp)=>{
    var query = "UPDATE map_project_module SET ? WHERE Map_module_id = ? ";
    var value = req.body;
    var Map_module_id = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, Map_module_id])
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
        var query = "update map_project_module SET Delete_YN ='Y' where Map_module_id = ?"

        var Map_module_id = req.params.id;
    try{
        let result = await mysql.exec(query, Map_module_id)
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