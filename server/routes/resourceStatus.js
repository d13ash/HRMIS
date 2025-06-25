const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const path = require('path');



router.get('/allResource', async (req, res) => {
    var query = "SELECT Resource_Main_ID,Resource_Name FROM resource_detailt_main";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/Status', async (req, res) => {
    var query = "SELECT Availability_Status_ID,Availability_Status FROM resource_availability";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/ResourcestatusMap', async (req, res) => {
    var query = "SELECT resource_status_detail.Resource_status_detail_id,resource_status_detail.file_Path, resource_detailt_main.Resource_Name,resource_availability.Availability_Status,resource_availability.Availability_Status_ID,resource_detailt_main.Resource_Main_ID FROM((resource_status_detail left JOIN resource_detailt_main ON  resource_status_detail.Resource_Main_ID=resource_detailt_main.Resource_Main_ID)  left JOIN resource_availability ON resource_status_detail.Availability_Status_ID=resource_availability.Availability_Status_ID)";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// post data in project detail
router.post('/PostResorcestatus', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO resource_status_detail SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});

// get Resource type
router.get('/resourceType', async (req, res) => {
    var query = "SELECT Resource_Type_ID,Resource_Type_Name FROM m_resource_type";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get Unit type
router.get('/unitType', async (req, res) => {
    var query = "SELECT Unit_ID,Unit_Name FROM resource_unit";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get Unit type
router.get('/resCategory', async (req, res) => {
    var query = "SELECT Resource_Category_ID,Category_Name FROM resource_category";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// // Update Department Detail
router.put('/updateResourceStatus/:id',async (req,resp)=>{
    var query = "UPDATE resource_status_detail SET ? WHERE Resource_status_detail_id = ?";
    var value = req.body;
    var Resource_status_detail_id = req.params.id;
    try{
       let result = await mysql.exec(query,[value, Resource_status_detail_id])
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
    var query = "DELETE FROM resource_status_detail WHERE Resource_status_detail_id = ?";
    var Resource_status_detail_id = req.params.id;
try{
    let result = await mysql.exec(query, Resource_status_detail_id)
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