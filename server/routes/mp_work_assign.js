const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const bcrypt = require('bcryptjs');
const CryptoJS = require("crypto-js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage : storage
})

const auth = require('../middleware/auth');
const { has } = require('config');

router.get('/files',express.static('upload/images'));
router.post("/upload",upload.single('profile'),(req,res)=>{
    res.json({
        success:1,
        profile_url:`http://localhost:4000/profile/${req.file.filename}`
    })
})


router.get('/', async (req, res) => {
    var query = "SELECT * FROM manpower_work_allotment";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);

});



router.get('/:id',async (req,resp)=>{
    var query = "SELECT * FROM manpower_work_allotment WHERE id = ?";
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

//   router.get('/Distname/:Dist_Id',async (req,resp)=>{
//     var query = "SELECT * FROM block_name WHERE Dist_Id = ?";
//     var Dist_Id = req.params.Dist_Id;

//    try {
//         let result = await mysql.exec(query,[Dist_Id])
//         if (result.length == 0){
//         return resp.status(405).send("course not found");    
//         } 
//     return resp.json(result);
//   }
//   catch(err){
//          return resp.status(406).json(err);
//     }
//   })



router.post('/', async (req, res) => {
    const { error } = validatemanpowerdata(req.body);
    if (error) {
       return res.status(404).send(error);
    }
    var values = req.body;
    var query = "INSERT INTO manpower_work_allotment SET ? ";

    try {

        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId

        });
    } catch (err) {

        return res.status(404).json(err);
    }
});
function validatemanpowerdata(mp_work_assign) {
    const schema = Joi.object({
        Emp_Document_Detail_Id: Joi.number().required(),
        Emp_Id: Joi.number().required(),
        Project_ID: Joi.number().required(),
        Dept_ID: Joi.number().required(),
        Work_Description: Joi.string().min(3).required(),
        // gender: Joi.string().min(3).required(),
        Work_Assigned_Date: Joi.date().required(),
        // dob: Joi.date().required(),
        // Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        Work_Target_Date:Joi.date().required(),
        Work_Allotment_Period: Joi.string().required(),
        Review_Date: Joi.date().required(),
        Additional_Work_Detail: Joi.string().required(),
        Work_Status: Joi.string().required(),
        Reviewer_Remark: Joi.string().required(),
        Review_By: Joi.number().required(),
    
    }).unknown(true);
    return schema.validate(mp_work_assign);

}
module.exports = router;