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
    // filename:(req,file,cb)=>{
    //     return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)} `)
    // }



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
    var query = "SELECT * FROM state_Name";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");

    return res.json(result);

});

router.get('/:id',async (req,resp)=>{
    var query = "SELECT * FROM district_name WHERE id = ?";
    var id = req.params.id;

   try {
        let result = await mysql.exec(query,[id])
        if (result.length == 0){
        return resp.status(405).send("course not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })

  router.get('/Distname/:Dist_Id',async (req,resp)=>{
    var query = "SELECT * FROM block_name WHERE Dist_Id = ?";
    var Dist_Id = req.params.Dist_Id;

   try {
        let result = await mysql.exec(query,[Dist_Id])
        if (result.length == 0){
        return resp.status(405).send("course not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })



router.post('/', async (req, res) => {
    const { error } = validateStudentdata(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
    }
    var values = req.body;
    var query = "INSERT INTO student_details SET ? ";

    try {

        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId

        });
    } catch (err) {

        return res.status(404).json(err);
    }
});
function validateStudentdata(studentdata) {
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
    return schema.validate(studentdata);

}
module.exports = router;