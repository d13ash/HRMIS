const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer')
const path = require('path');
const { log } = require('console');


router.get('/allDepartment', async (req, res) => {
    var query = "SELECT * FROM m_department";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});



router.get('/allDepartmentWithType', async (req, res) => {
    var query = `SELECT d.Dept_ID,d.Dept_Name,d.Dept_Type_ID,d.Parent_Dept_ID,d.Email_ID,CONCAT('${req.protocol + '://' + req.get('host')}/api/uploads', d.Logo_Path)AS Logo_Path,d.Website_Url,d.About_Department,d.Address,d.State,s.State_id,s.State_name,d.Pincode,d.District,dist.Distric_id,dist.Distric_name,d.Contact_Number,d.Block,d.Contact_Person_ID, d2.Dept_Name AS Parent_Dept_Name,d.Delete_YN,t.Dept_Type_ID,t.Dept_Type_Name FROM m_department d left JOIN m_dept_type t ON t.Dept_Type_ID=d.Dept_Type_ID LEFT JOIN m_department d2 ON d.Parent_Dept_ID = d2.Dept_ID  LEFT JOIN state s ON s.State_id = d.State  LEFT JOIN distric dist ON dist.Distric_id = d.District WHERE d.Delete_YN IS null`;
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});



  router.get('/deptType', async (req, res) => {
    var query = "SELECT * FROM m_dept_type";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);

});


router.get('/allDepartment/:id',async (req,resp)=>{
    
const query = `
SELECT 
    d.Dept_ID,
    d.Dept_Name,
    d.Dept_Type_ID,
    d.Parent_Dept_ID,
    d.Email_ID,
    CONCAT('${req.protocol + '://' + req.get('host')}/api/uploads', d.Logo_Path) AS Logo_Path,
    d.Website_Url,
    d.About_Department,
    d.Address,
    d.State,
    s.State_id,
    s.State_name,
    d.Pincode,
    d.District,
    dist.Distric_id,
    dist.Distric_name,
    d.Contact_Number,
    d.Block,
    d.Contact_Person_ID,
    d2.Dept_Name AS Parent_Dept_Name,
    d.Delete_YN,
    t.Dept_Type_ID,
    t.Dept_Type_Name
    FROM m_department d
    LEFT JOIN m_dept_type t ON t.Dept_Type_ID = d.Dept_Type_ID
    LEFT JOIN m_department d2 ON d.Parent_Dept_ID = d2.Dept_ID
    LEFT JOIN state s ON s.State_id = d.State
    LEFT JOIN distric dist ON dist.Distric_id = d.District
    WHERE d.Delete_YN IS NULL AND d.Dept_ID = ?  `;
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

router.get('/deptType/:id',async (req,resp)=>{
    var query = "SELECT * FROM m_dept_type WHERE Dept_Type_ID = ?";
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


  router.get('/allDepartmentmap', async (req, res) => {
    var query = "SELECT Dept_ID,Dept_Name FROM m_department";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);

});


// Update Department Detail
router.put('/updateDepartmentDetail/:id', async (req, resp) => {
  const Dept_ID = req.params.id;
  let values = req.body;

  try {
    // Get existing department record
    const checkQuery = "SELECT Logo_Path FROM m_department WHERE Dept_ID = ?";
    const existing = await mysql.exec(checkQuery, [Dept_ID]);

    if (!existing || existing.length === 0) {
      return resp.status(404).send('Record not found');
    }

    const currentLogoPath = existing[0].Logo_Path;

    // Only update Logo_Path if new image was uploaded
    if (!values.Logo_Path || values.Logo_Path === '' || values.Logo_Path === null) {
      values.Logo_Path = currentLogoPath;
    }

    const updateQuery = "UPDATE m_department SET ? WHERE Dept_ID = ?";
    const result = await mysql.exec(updateQuery, [values, Dept_ID]);

    if (result.affectedRows < 1) {
      return resp.status(404).send('Update failed');
    }

    return resp.json({ status: "success" });
  } catch (err) {
    return resp.status(500).json({ error: err.message });
  }
});


router.get('/getState', async (req, res) => {
    var query = "SELECT * FROM state";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});


router.get('/getDistric/:id',async (req,resp)=>{
    var query = "SELECT * FROM distric WHERE State_id = ?";
    var State_id = req.params.id;
   try {
        let result = await mysql.exec(query,[State_id])
        if (result.length == 0){
        return resp.status(405).send("District not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })

  router.get('/getBlock/:Id',async (req,resp)=>{
    var query = "SELECT * FROM block WHERE Distric_id = ?";
    var Distric_id = req.params.Id;

   try {
        let result = await mysql.exec(query,[Distric_id])
        if (result.length == 0){
        return resp.status(405).send("Block not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })


// Delete departmetnt detail
    router.delete('/deletedataByid/:id',async (req,res)=>{
        var query = "update m_department SET Delete_YN ='Y' where Dept_ID = ?"

        var Dept_ID = req.params.id;
    try{
        let result = await mysql.exec(query, Dept_ID)
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


// post data in department detail
router.post('/', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
    var values = req.body;
    var query = "INSERT INTO m_department SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});



// Configure Multer for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "uploads/add-dept/logo"; // Use existing subfolder path
      cb(null, uploadPath); // Specify the subfolder as the destination
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const originalName = path.basename(file.originalname, path.extname(file.originalname)); // Remove extension from original name
      const uniqueName = `${originalName}-${timestamp}${path.extname(file.originalname)}`; // Append timestamp and extension
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 100 * 1024 }, // Set file size limit to 100 KB
  fileFilter: function (req, file, cb) {
    // Validate file type if needed (e.g., only images)
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Static route for serving uploaded files
// router.use('/api/images', express.static('uploads'));

// POST route for file upload
router.post("/uploadfile", upload.single("Logo_Path"), (req, resp, next) => {
  const file = req.file;
  if (!file) {
    return next("No file found");
  }
  const profileURL = '/add-dept/logo/' + req.file.filename;
  // console.log("File uploaded successfully:", profileURL);
  // console.log("req.body);
  // console.log(req.file);
  resp.json({
    profile_url: profileURL,
    success: 'File uploaded'
  });
});



function validatedepartmentdata(departDetail) {
    const schema = Joi.object({
        Dept_Name: Joi.string().required(),
        Parent_Dept_ID: Joi.number(),
        Dept_Type_ID: Joi.number().required(),
        Email_ID: Joi.string().required(),
        Website_Url: Joi.string().min(3).required(),
        About_Department: Joi.string().required(),
        Work_Description:Joi.string(),
        Address:Joi.string(),
        State: Joi.number(),
        Distric: Joi.number(),
        Block: Joi.string(),
        Pincode: Joi.string().required(),
        Contact_Number: Joi.string(),
        Contact_Person_ID: Joi.number(),
      
        // gender: Joi.string().min(3).required(),
        // dob: Joi.date().required(),
        // Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    }).unknown(true);
    return schema.validate(departDetail);

}

module.exports = router;