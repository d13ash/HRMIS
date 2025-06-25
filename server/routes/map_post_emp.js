const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer')
const path = require('path')

router.get('/getmapData', async (req, res) => {
   var query = `
  SELECT 
    mp.Map_post_emp_id,
    f.Financial_name,
    f.Financial_id,
    CONCAT('${req.protocol}://${req.get('host')}', mp.NOC_reliving) AS NOC_reliving_url,
    mp.Remark,
    mp.Join_date,
    mp.Reliving_order,
    mp.Appointment_order,
    mp.Reliving_date,
    mp.Active_yn,
    mb.Emp_First_Name_E,
    mb.Emp_Id,
    mp.Post_Id,
    p.Post_name
  FROM map_post_emp mp
  LEFT JOIN manpower_basic_detail mb ON mb.Emp_Id = mp.Emp_Id
  LEFT JOIN m_post p ON p.Post_id = mp.Post_id
  LEFT JOIN m_financial f ON f.Financial_id = mp.Financial_id
  WHERE mp.Delete_YN IS NULL
`;
  let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});
 
// get only two fields for post dropdown
router.get('/allpost', async (req, res) => {
    var query = " SELECT Post_id,Post_name FROM  m_post";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get only two fields for employee dropdown
router.get('/allemp', async (req, res) => {
    var query = " SELECT Emp_Id,Emp_First_Name_E FROM manpower_basic_detail ";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/getMapPostEmp', async (req, res) => {
    var query = "SELECT * FROM map_post_emp";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});


// post data in map_post_emp detail
router.post('/postMapPostEmp', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO map_post_emp SET ? ";
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
router.put('/updategetMapPostEmp/:id',async (req,resp)=>{
    var query = "UPDATE map_post_emp SET ? WHERE Map_post_emp_id = ? ";
    var value = req.body;
    var Map_post_emp_id = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, Map_post_emp_id])
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
        var query = "update map_post_emp SET Delete_YN ='Y' where Map_post_emp_id = ?"

        var Map_post_emp_id = req.params.id;
    try{
        let result = await mysql.exec(query, Map_post_emp_id)
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


// file Upload
 

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Assuming the folder structure already exists
      cb(null, "uploads/map-post-emp/noc");
    },
    filename: function (req, file, cb) {
      const baseName = path.basename(file.originalname, path.extname(file.originalname)).replace(/\s+/g, '');
      cb(null, `${baseName}_${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
  limits: { fileSize: 100 * 1024 }, // Max file size 100KB
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF files are allowed!"));
  }
});

// Serve uploaded files statically
// app.use("/api/uploads", express.static("uploads"));

// File upload endpoint
router.post("/uploadfile", upload.single("NOC_reliving"), (req, resp, next) => {
  const file = req.file;
  if (!file) {
    return resp.status(400).json({ error: "No file found or file type not allowed" });
  }

  resp.json({
    profile_url: `/uploads/map-post-emp/noc/${req.file.filename}`,
    success: "File uploaded"
  });
});










      

module.exports = router;