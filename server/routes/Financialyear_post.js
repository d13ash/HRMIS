const express = require('express');
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require('multer')
const path = require('path');
const config = require('config');
const { json } = require('stream/consumers');
const fd = require('../fileDelete');


router.use('/documents', express.static('documents'));


// Multer for two files: pi_file and wo_file
const uploadfiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "documents");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/addFinancialPost', uploadfiles.fields([
  { name: "PI_refferal_doc", maxCount: 1 },
  { name: "Work_order_doc", maxCount: 1 }
]), async (req, res) => {
  let { Project_ID, Financial_id, PI_ref_no, Work_order_ref_no, postArray } = req.body;

  // Parse postArray if sent as JSON string
  if (typeof postArray === 'string') {
    try {
      postArray = JSON.parse(postArray);
    } catch (err) {
      return res.status(400).json({ error: "Invalid postArray JSON", details: err });
    }
  }

  // Validate postArray structure
  if (!Array.isArray(postArray) || postArray.length === 0) {
    return res.status(400).json({ error: "postArray must be a non-empty array" });
  }

  // Validate required fields in each post
  for (const post of postArray) {
    if (!post.Post_id || !post.Start_date || !post.End_date || !post.Salary) {
      return res.status(400).json({ error: "Each post must contain Post_id, Start_date, End_date, and Salary" });
    }
  }

  // Prepare values for finance_post_main (exclude postArray!)
  let values = {
    Project_ID,
    Financial_id,
    PI_ref_no,
    Work_order_ref_no
  };

  // Handle file uploads
  const files = req.files;
  Object.keys(files).forEach(field => {
    values[field] = files[field][0].path.replace(/\\/g, '/'); // Normalize path
  });

  // console.log("Main values:", values);
  // console.log("Post entries:", postArray);

  let query = "INSERT INTO finance_post_main SET ?";

  try {
    let mainResult = await mysql.exec(query, values);
    const insertedId = mainResult.insertId;

    const postInsertQuery = `
      INSERT INTO yearly_post_detail 
      (finance_post_main_id, Post_id, Start_date, End_date, Salary, Description) 
      VALUES ?
    `;

    const postValues = postArray.map(post => [
      insertedId,
      post.Post_id,
      post.Start_date,
      post.End_date,
      post.Salary,
      post.Description || null
    ]);

    await mysql.exec(postInsertQuery, [postValues]);

    return res.json({
      message: "Financial post and yearly details saved successfully",
      finance_post_main_id: insertedId
    });

  } catch (err) {
    console.error("Insert Error:", JSON.stringify(err, null, 2));
    return res.status(500).json({ error: "Failed to save data", details: err });
  }
});



router.get('/yearly_post_detail', async (req, res) => {
  var query = "SELECT * FROM  yearly_post_detail";
  console.log("called");
  let result = await mysql.exec(query);
  if (result.length == 0)
    return res.status(404).send("Data Not Found");
  return res.json(result);
});


// post data in project detail
router.post('/postYearlyPostDetail', async (req, res) => {
  var values = req.body;
  var query = "INSERT INTO yearly_post_detail SET ? ";
  try {
    let data = await mysql.exec(query, values);
    res.json({
      id: data.insertId
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});


router.get('/getProject', async (req, res) => {
  var query = "SELECT Project_ID,Project_Name FROM m_project";
  console.log("called");
  let result = await mysql.exec(query);
  if (result.length == 0)
    return res.status(404).send("Data Not Found");
  return res.json(result);
});

// get only two fields
router.get('/getFinancialYear', async (req, res) => {
  var query = "SELECT Financial_id,Financial_name FROM  m_financial";
  console.log("called");
  let result = await mysql.exec(query);
  if (result.length == 0)
    return res.status(404).send("Data Not Found");
  return res.json(result);
});

// get only two fields
router.get('/getpost', async (req, res) => {
  var query = " SELECT Post_id,Post_name FROM  m_post";
  // console.log("called");
  let result = await mysql.exec(query);
  if (result.length == 0)
    return res.status(404).send("Data Not Found");
  return res.json(result);
});

router.get('/getTable', async (req, resp) => {
  var query = "SELECT fy.financialyear_post_id,p.Project_ID,p.Project_name,ps.Post_id,ps.Post_name,f.Financial_id,f.Financial_name,fy.PI_ref_no,fy.Work_order_ref_no,fy.Start_date,fy.End_date,fy.Salary,fy.Description FROM financialyear_post fy  LEFT join m_project p ON p.Project_ID = fy.Project_ID left JOIN m_post ps ON ps.Post_id = fy.Post_id  LEFT JOIN m_financial f ON f.Financial_id=fy.Financial_id  WHERE fy.Delete_YN IS NULL";
  var id = req.params.id;
  try {
    let result = await mysql.exec(query, [id])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
})


router.get('/financial_post/:id1/:id2', async (req, resp) => {
  var query = "SELECT fy.Project_post_allotment_ID,p.Project_ID,p.Project_name,ps.Post_id,ps.Post_name,f.Financial_id,f.Financial_name FROM project_post_allotment fy LEFT join m_project p ON p.Project_ID = fy.Project_ID left JOIN m_post ps ON ps.Post_id = fy.Post_id LEFT JOIN m_financial f ON f.Financial_id=fy.Financial_id WHERE fy.Delete_YN IS NULL AND p.Project_ID= ? AND f.Financial_id= ?";
  var id1 = req.params.id1;
  var id2 = req.params.id2;
  try {
    let result = await mysql.exec(query, [id1, id2])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
})


router.get('/PostPreviewDetail', async (req, resp) => {
  var query = "SELECT fp.finance_post_main_id,fp.PI_ref_no,fp.Work_order_ref_no,p.Project_name,f.Financial_name FROM finance_post_main fp LEFT join m_project p ON p.Project_ID = fp.Project_ID LEFT JOIN m_financial f ON f.Financial_id=fp.Financial_id WHERE fp.Delete_YN IS NULL";
  // var id1 = req.params.id1;
  try {
    let result = await mysql.exec(query, [])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
});

router.get('/PostPreviewDetail/:id', async (req, resp) => {
  var query = "SELECT fp.finance_post_main_id,fp.Project_ID,fp.PI_ref_no, fp.PI_refferal_doc,fp.Work_order_ref_no,fp.Work_order_doc,p.Project_name,f.Financial_id FROM finance_post_main fp LEFT join m_project p ON p.Project_ID = fp.Project_ID LEFT JOIN m_financial f ON f.Financial_id=fp.Financial_id WHERE fp.Delete_YN IS NULL AND fp.finance_post_main_id = ?";
  var id = req.params.id;
  try {
    let result = await mysql.exec(query, [id])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    if(result[0].PI_refferal_doc){
      result[0].PI_refferal_doc = config.get('apiUrl') + 'Financialyear_post/' + result[0].PI_refferal_doc;
    }
    if(result[0].Work_order_doc){
      result[0].Work_order_doc = config.get('apiUrl') + 'Financialyear_post/' + result[0].Work_order_doc;
    }

    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
});


router.get('/PostPreviewdata/:id1', async (req, resp) => {
  var query = "SELECT y.yearly_post_detail_id,y.finance_post_main_id,p.Post_name,y.Start_date,y.End_date,y.Salary,y.Description FROM yearly_post_detail y LEFT JOIN m_post p ON p.Post_id=Y.Post_id WHERE y.Delete_YN IS NULL AND y.finance_post_main_id = ?";
  var id1 = req.params.id1;
  try {
    let result = await mysql.exec(query, [id1])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
})


router.get('/bbbbbb/:id1', async (req, resp) => {
  var query = "SELECT * FROM (SELECT y.yearly_post_detail_id,y.finance_post_main_id,p.Post_name,y.Start_date,y.End_date,y.Salary,y.Description FROM yearly_post_detail Y LEFT JOIN m_post p ON p.Post_id=Y.Post_id  WHERE y.Delete_YN IS NULL) TT INNER JOIN (SELECT fp.finance_post_main_id,fp.PI_ref_no,fp.Work_order_ref_no,p.Project_name,f.Financial_name FROM finance_post_main fp   LEFT join m_project p ON p.Project_ID = fp.Project_ID  LEFT JOIN m_financial f ON f.Financial_id=fp.Financial_id) dd ON dd.finance_post_main_id=TT.finance_post_main_id AND dd.finance_post_main_id = ?";
  var id1 = req.params.id1;
  try {
    let result = await mysql.exec(query, [id1])
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
})


// Update Department Detail
// router.put('/updateFinancialPost/:id', async (req, resp) => {
//   var query = "UPDATE financialyear_post SET ? WHERE financialyear_post_id = ? ";
//   var value = req.body;
//   var financialyear_post_id = req.params.id;
//   try {
//     let result = await mysql.exec(query, [value, financialyear_post_id])
//     if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
//       return resp.status(404).send('error....');
//     }
//     return resp.json({ status: "success" })
//   }
//   catch (err) {
//     if (err) {
//       return resp.status(404).send('error');
//     }
//   }
// })

router.put('/updateFinancialPost/:id', uploadfiles.fields([
  { name: "PI_refferal_doc", maxCount: 1 },
  { name: "Work_order_doc", maxCount: 1 }
]), async (req, res) => {
  let { Project_ID, Financial_id, PI_ref_no, Work_order_ref_no, postArray } = req.body;

  let values = {
    Project_ID,
    Financial_id,
    PI_ref_no,
    Work_order_ref_no
  };

  let id = req.params.id;
  let data = await mysql.exec("SELECT * FROM finance_post_main WHERE finance_post_main_id = ? AND (Delete_YN IS NULL OR Delete_YN != 'Y')",[id]);
  if(data.length == 0){
    return res.status(405).send("Record not found");
  }
  

  // Parse postArray if sent as string
  if (typeof postArray === 'string') {
    try {
      postArray = JSON.parse(postArray);
    } catch (err) {
      return res.status(400).json({ error: "Invalid postArray JSON", details: err });
    }
  }

  // Handle file uploads
  const files = req.files;
  Object.keys(files).forEach(field => {
    values[field] = files[field][0].path.replace(/\\/, '/');
  });
// function to delete existing files
  // if(files){
  //   fd.deleteFiles([data[0].PI_refferal_doc, data[0].Work_order_doc]);
  // }
  console.log(values);
  console.log(postArray);
  // Insert into finance_post_main
  let query = "UPDATE finance_post_main SET ? WHERE finance_post_main_id = ?";
  try {
    let mainResult = await mysql.exec(query, [values , id]);

    // Prepare bulk insert into yearly_post_detail
    const postInsertQuery = `
      INSERT INTO yearly_post_detail 
      (finance_post_main_id, Post_id, Start_date, End_date, Salary, Description) 
      VALUES ?
    `;

    const postValues = postArray.map(post => [
      id,
      post.Post_id,
      post.Start_date,
      post.End_date,
      post.Salary,
      post.Description || null
    ]);

    query = 'DELETE FROM yearly_post_detail WHERE finance_post_main_id = ?';
    await mysql.exec(query,[id]);
    // Perform bulk insert
    await mysql.exec(postInsertQuery, [postValues]);

    return res.json({
      message: "Financial post and yearly details saved successfully",
      finance_post_main_id: id
    });

  } catch (err) {
    console.error("Insert Error:", err);
    return res.status(500).json({ error: "Failed to save data", details: err });
  }
});


// Delete departmetnt detail
// router.delete('/deletedataByid/:id',async (req,res)=>{
//     var query = "update finance_post_main SET Delete_YN ='Y' where finance_post_main_id = ?";
//     var financialyear_post_id = req.params.id;
// try{
//     let result = await mysql.exec(query, financialyear_post_id)
//     if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
//         return res.status(404).send('error...');     
//     }
//     return res.json({status: "data deleted" })
// }
// catch(err){
//     if(err){
//         return res.status(404).send('error'); }
//   }
// })

// file Upload

const upload = multer({   //here upload is function
  storage: multer.diskStorage({
    destination: function (req, file, cb) {   //it decide where we want to store our file //cb is a call back function

      cb(null, "uploads"); //it contain two parameter second one is upload path(****uploads is a folder name*****)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now() + path.extname(file.originalname)); //here first parameter is error ,second parameter is filename(which can be modify)
    }
  }),
  limits: { fileSize: 1000000000000000 }   //this for limiting file size
});
//.single("user")///here we have to define that we have to upload single file or multiple file and also define the key name(field name)

//   first file end point

//   router.use('/api/images', express.static('documents'));//by using this we can access the node file outside the application  // here we have to pass two parameter first is reference of image path and second is actual image path
router.post("/uploadPIfile", upload.single("PI_refferal_doc"), (req, resp, next) => {  //here file_Path is the key for image which must be same in frotend(angular)
  const file = req.file;
  if (!file) {
    return next("no file found")
  }
  resp.json({
    profile_url: config.get('apiUrl') + 'images/' + req.file.filename, //when we are using multer then we get file information on req.file
    sucess: 'file uploaded'
  })
  // console.log(req.file)
});


//   second file endpoint
router.post("/uploadWOfile", upload.single("Work_order_doc"), (req, resp, next) => {  //here file_Path is the key for image which must be same in frotend(angular)
  const file = req.file;
  if (!file) {
    return next("no file found")
  }
  resp.json({
    profile_url: config.get('apiUrl') + 'images/' + req.file.filename, //when we are using multer then we get file information on req.file
    sucess: 'file uploaded'
  })
});





// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


router.get('/getPost/:id', async (req, resp) => {
  var query = "SELECT * FROM project_post_allotment y LEFT JOIN m_post p ON p.Post_id=y.Post_id WHERE y.Financial_id = ?";
  var getitem = req.params.id;
  try {
    let result = await mysql.exec(query, [getitem])
    if (result.length == 0) {
      return resp.status(405).send("item not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
});
// ===================== post  ==================================

// post data in project detail
router.post('/postFinancialPost', async (req, res) => {
  var values = req.body;
  var query = "INSERT INTO finance_post_main SET ? ";
  try {
    let data = await mysql.exec(query, values);
    res.json({
      id: data.insertId
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.post('/postArray/:id', async (req, res) => {
  const arr = req.body.paramArray;
  var id = req.params.id;
  try {
    var query = "INSERT INTO yearly_post_detail (finance_post_main_id,Post_id,Start_date,End_date,Salary,Description) VALUES (?,?,?,?,?,?) ";
    for (const item of arr) {
      await mysql.exec(query, [id, item.name, item.sdate, item.edate, item.sal, item.desc]);
    }
    let data =
      res.json({
        message: "Data inserted successfully!"
      });
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.get('/postArray/:id', async (req, res) => {
  const id = req.params.id;
  const query = "SELECT ypd.*, mp.Post_name FROM yearly_post_detail ypd LEFT JOIN m_post mp ON ypd.Post_id = mp.Post_id WHERE ypd.finance_post_main_id = ?";
  try {
    const result = await mysql.exec(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
});

// get name of post through id
router.get('/test/:id1/:id2', async (req, resp) => {
  var query = "SELECT p.Post_name AS name FROM project_post_allotment r LEFT JOIN m_post p ON p.Post_id=r.Post_Id  WHERE r.Post_Id = ? AND r.Financial_id = ? ";
  var fin_id = req.params.id1;
  var Post_id = req.params.id2;

  try {
    let result = await mysql.exec(query, [fin_id, Post_id])
    if (result.length == 0) {
      return resp.status(405).send("data not found");
    }
    return resp.json(result);
  }
  catch (err) {
    return resp.status(406).json(err);
  }
});




router.delete('/deletedataByid/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID not provided' });
  }
  try {
    const selectQuery = 'SELECT * FROM finance_post_main WHERE finance_post_main_id = ?';
    const selectResult = await mysql.exec(selectQuery, [id]);

    if (selectResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    const updateQuery = "UPDATE finance_post_main SET Delete_YN = 'Y' WHERE finance_post_main_id = ?";
    const updateResult = await mysql.exec(updateQuery, [id]);

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Failed to delete data' });
    }

    return res.status(200).json({ success: true, message: 'Data deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});




module.exports = router;