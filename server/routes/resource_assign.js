const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

// router.get('/getmapData', async (req, res) => {
    
//     var query = 'SELECT map_project_dept.ID,m_project.Project_Name,m_department.Dept_Name,map_project_dept.Description FROM ((map_project_dept LEFT JOIN m_project ON map_project_dept.Project_ID=m_project.Project_ID) LEFT JOIN m_department ON map_project_dept.Parent_Dept_ID = m_department.Dept_ID)';

//     let result = await mysql.exec(query);
//     if (result.length == 0)
//         return res.status(404).send("data Not Found");
//     return res.json(result);
// });
 
router.get('/', async (req, res) => {
    var query = "SELECT * FROM resource_assignment_main";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});

router.get('/allAssignResourceMap', async (req, res) => {
    var query = "SELECT ram.resource_assignment_main_ID,rm.Resource_Name,p.Project_name,p.Project_ID,rm.Resource_Main_ID,ram.Quantity,ram.From_Date,ram.To_Date FROM resource_assignment_main ram left JOIN m_project p ON p.Project_ID = ram.Project_ID left JOIN resource_detailt_main rm ON rm.Resource_Main_ID = ram.Resource_Main_ID"
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get Resource type
router.get('/allResource', async (req, res) => {
    var query = "SELECT Resource_Main_ID,Resource_Name FROM resource_detailt_main";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get only two fields
router.get('/allProject', async (req, res) => {
    var query = " SELECT Project_ID,Project_name FROM  m_project";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});



// post data in assign detail
router.post('/PostAssignRes', async (req, res) => {
   
    var values = req.body;
    var query = "INSERT INTO resource_assignment_main SET ? ";
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
router.put('/updateResourceAssign/:id',async (req,resp)=>{
    var query = "UPDATE resource_assignment_main SET ? WHERE resource_assignment_main_ID = ? ";
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
                return resp.status(404).send('error');   
  }
}
})

// Delete departmetnt detail
    router.delete('/deleteAssignData/:id',async (req,res)=>{
        var query = "update resource_assignment_main SET Delete_YN ='Y' where resource_assignment_main_ID = ? ";
        // var query = "DELETE FROM resource_assignment_main WHERE resource_assignment_main_ID = ?";
        var resource_assignment_main_ID = req.params.id;
    try{
        let result = await mysql.exec(query, resource_assignment_main_ID)
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