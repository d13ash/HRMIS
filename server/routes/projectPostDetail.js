const express = require('express'); 
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const path = require('path');

// post data in project detail
router.post('/postProjecPost', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO project_post_allotment SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});


router.get('/allProject', async (req, res) => {
        var query = "SELECT Project_ID,Project_Name,Project_Type_Name,Project_Short_name,Project_Discription FROM m_project_type JOIN m_project ON m_project.Project_Type_ID=m_project_type.Project_Type_ID";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get only two fields
router.get('/getFinancialYear', async (req, res) => {
    var query = " SELECT Financial_id,Financial_name FROM  m_financial";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get only two fields
router.get('/allpost', async (req, res) => {
    var query = " SELECT Post_id,Post_name FROM  m_post";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/allProjectPostTable',async (req,resp)=>{
    var query = "SELECT pp.Project_post_allotment_ID,pp.Description,f.Financial_id,f.Financial_name,pp.Start_date,pp.End_date, pp.Duration_in_days, pp.Manpower_no,p.Project_ID,ps.Post_id, ps.Post_name,p.Project_name FROM project_post_allotment pp LEFT join m_project p ON p.Project_ID = pp.Project_ID left JOIN m_post ps ON ps.Post_id = pp.Post_id LEFT JOIN m_financial f ON f.Financial_id=pp.Financial_id WHERE pp.Delete_YN IS null";
    var id = req.params.id;
   try {
        let result = await mysql.exec(query,[id])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })


router.get('/allProjectPost',async (req,resp)=>{
    var query = " SELECT * FROM project_post_allotment";
    var id = req.params.id;
   try {
        let result = await mysql.exec(query,[id])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })

// Update Department Detail
router.put('/updateProjectPostDetail/:id',async (req,resp)=>{
    var query = "UPDATE project_post_allotment SET ? WHERE Project_post_allotment_ID = ? ";
    var value = req.body;
    var Project_post_allotment_ID = req.params.id;
    try{        
       let result = await mysql.exec(query,[value, Project_post_allotment_ID])
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
    var query = "update project_post_allotment SET Delete_YN ='Y' where Project_post_allotment_ID = ?";
    var Project_post_allotment_ID = req.params.id;
try{
    let result = await mysql.exec(query, Project_post_allotment_ID)
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



function validateprojectDetail(projectDetail) {
    const schema = Joi.object({
        Student_First_Name: Joi.string().min(3).required(),
        Student_Middle_Name: Joi.string().min(3).required(),
        Student_Last_Name: Joi.string().min(3).required(),
        Student_Father_Name: Joi.string().min(3).required(),
        Student_Mother_Name: Joi.string().min(3).required(),
        // gender: Joi.string().min(3).required(),
        category: Joi.string().min(3).required(),
        // dob: Joi.date().required(),
        Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        Email_id:Joi.string().min(3).required().email(),
        Address: Joi.string().required(),
        State: Joi.required(),
        District: Joi.required(),
        Block: Joi.required(),
    }).unknown(true);
    return schema.validate(projectDetail);
}
module.exports = router;