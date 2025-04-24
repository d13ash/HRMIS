const express = require('express');
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

router.get('/allProjectWorkDetail', async (req, res) => {
    var query = "SELECT * FROM project_work_detail";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});


// get data in dropdown
router.get('/allProjectmap', async (req, res) => {
    var query = " SELECT Project_ID,Project_name FROM  m_project";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});


// get data in dropdown
router.get('/allmodulemap/:Project_ID',async (req,resp)=>{
    var query = "SELECT mp.project_module_id,m.module_name FROM  map_project_module mp LEFT JOIN project_module m ON m.project_module_id=mp.project_module_id WHERE Project_ID = ?";
    var Project_ID = req.params.Project_ID;
   try {
        let result = await mysql.exec(query,[Project_ID])
        if (result.length == 0){
        return resp.status(405).send("State");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })  

//   get work in dropdown
router.get('/allWork/:project_module_id',async (req,resp)=>{
    var query = "SELECT w.Project_work_main_id,w.Work_name FROM  project_work_main w WHERE project_module_id = ?";
    var project_module_id = req.params.project_module_id;
   try {
        let result = await mysql.exec(query,[project_module_id])
        if (result.length == 0){
        return resp.status(405).send("data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })



// get data in dropdown
router.get('/getProjectWork', async (req, res) => {
    var query = " SELECT Project_work_main_id,Work_name FROM  project_work_main";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// for table
router.get('/allProjectWorkDetaildata', async (req, res) => {
    var query = "SELECT d.Project_work_detail_id,p.Project_name,p.Project_ID,d.project_module_id,md.module_name,d.Detail_work_name,d.Description,d.remark,d.Start_date,d.End_date,d.Project_work_main_id,w.Work_name FROM  project_work_detail d LEFT join m_project p ON p.Project_ID = d.Project_ID LEFT JOIN project_module md ON md.project_module_id = d.project_module_id left JOIN project_work_main w ON w.Project_work_main_id = d.Project_work_main_id WHERE d.Delete_YN IS null";
    console.log("called");
    let result = await mysql.exec(query);

    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});

// post data in project work detail
router.post('/PostProjectWorkDetail', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO project_work_detail SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});


// // Update Department Detail
router.put('/updateProjectWorkDetail/:id',async (req,resp)=>{
    var query = "UPDATE project_work_detail SET ? WHERE Project_work_detail_id = ? ";
    var value = req.body;
    var Project_work_detail_id = req.params.id;
    try{
       let result = await mysql.exec(query,[value, Project_work_detail_id])
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({status: "success" })    
     }
     catch(err){
            if(err){
                return resp.status(404).send('error..');   
  }
}
})

 // Delete departmetnt detail
router.delete('/deletedataByid/:id',async (req,res)=>{
    var query = "DELETE FROM project_work_detail WHERE Project_work_detail_id = ?";
    var Project_work_detail_id = req.params.id;
try{
    let result = await mysql.exec(query, Project_work_detail_id)
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


// function validateResourceDetail(ResourceDetail) {
//     const schema = Joi.object({
//         Student_First_Name: Joi.string().min(3).required(),
//         Student_Middle_Name: Joi.string().min(3).required(),
//         Student_Last_Name: Joi.string().min(3).required(),
//         Student_Father_Name: Joi.string().min(3).required(),
//         Student_Mother_Name: Joi.string().min(3).required(),
//         // gender: Joi.string().min(3).required(),
//         category: Joi.string().min(3).required(),
//         // dob: Joi.date().required(),
//         Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
//         Email_id:Joi.string().min(3).required().email(),
//         Address: Joi.string().required(),
//         State: Joi.required(),
//         District: Joi.required(),
//         Block: Joi.required(),
//     }).unknown(true);
//     return schema.validate(ResourceDetail);
// }
module.exports = router;