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
      ypd.yearly_post_detail_id, 
      mp.Map_post_emp_id,
      f.Financial_name,
      f.Financial_id,
      fpm.Project_ID,
      mpj.Project_name,
      CONCAT('${req.protocol}://${req.get('host')}/api', mp.NOC_reliving) AS NOC_reliving_url,
      mp.Remark,
      mp.Join_date,
      mp.Reliving_order,
      mp.Appointment_order,
      mp.Reliving_date,
      mp.Active_yn,
      mb.Emp_First_Name_E,
      mb.Emp_Id,
      ypd.Post_id,
      p.Post_name
    FROM map_post_emp mp
    LEFT JOIN yearly_post_detail ypd ON ypd.yearly_post_detail_id = mp.yearly_post_detail_id
    LEFT JOIN finance_post_main fpm ON fpm.finance_post_main_id = ypd.finance_post_main_id
    LEFT JOIN m_project mpj ON mpj.Project_ID = fpm.Project_ID
    LEFT JOIN m_financial f ON f.Financial_id = fpm.Financial_id
    LEFT JOIN m_post p ON p.Post_id = ypd.Post_id
    LEFT JOIN manpower_basic_detail mb ON mb.Emp_Id = mp.Emp_Id
    WHERE mp.Delete_YN IS NULL;
  `;
  let result = await mysql.exec(query);
  if (result.length == 0)
    return res.status(404).send("data Not Found");
  return res.json(result);
});
 

router.get('/getProject/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).send('Error: please send valid id');
  }
  const query = `SELECT DISTINCT 
    mp.Project_ID,
    mp.Project_name
    FROM yearly_post_detail ypd
    JOIN finance_post_main fpm ON fpm.finance_post_main_id = ypd.finance_post_main_id
    JOIN m_project mp ON mp.Project_ID = fpm.Project_ID
    WHERE fpm.Financial_id =  ?`;

  try {
    let result = await mysql.exec(query, [id])
    if (result.length == 0) {
      return res.status(405).send("Data not found");
    }
    return res.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
});

router.get('/getPost/:financialId/:projectId', async (req, res) => {
  const { financialId, projectId } = req.params;
  const query = `
    SELECT 
    ypd.yearly_post_detail_id,
    mpst.Post_id,
    mpst.Post_name
    FROM yearly_post_detail ypd
    JOIN finance_post_main fpm ON fpm.finance_post_main_id = ypd.finance_post_main_id
    JOIN m_post mpst ON mpst.Post_id = ypd.Post_id
    WHERE fpm.Financial_id = ?   
    AND fpm.Project_ID = ?; `;
  try {
    const result = await mysql.exec(query, [financialId, projectId]);
    if (result.length === 0) {
      return res.status(404).send("No records found");
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
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