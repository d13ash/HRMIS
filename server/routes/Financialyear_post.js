const express = require('express'); 
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer')
const path = require('path');
const config = require('config');


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
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/getTable',async (req,resp)=>{
    var query = "SELECT fy.financialyear_post_id,p.Project_ID,p.Project_name,ps.Post_id,ps.Post_name,f.Financial_id,f.Financial_name,fy.PI_ref_no,fy.Work_order_ref_no,fy.Start_date,fy.End_date,fy.Salary,fy.Description FROM financialyear_post fy  LEFT join m_project p ON p.Project_ID = fy.Project_ID left JOIN m_post ps ON ps.Post_id = fy.Post_id  LEFT JOIN m_financial f ON f.Financial_id=fy.Financial_id  WHERE fy.Delete_YN IS NULL";
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


  router.get('/financial_post/:id1/:id2',async (req,resp)=>{
    var query = "SELECT fy.Project_post_allotment_ID,p.Project_ID,p.Project_name,ps.Post_id,ps.Post_name,f.Financial_id,f.Financial_name FROM project_post_allotment fy LEFT join m_project p ON p.Project_ID = fy.Project_ID left JOIN m_post ps ON ps.Post_id = fy.Post_id LEFT JOIN m_financial f ON f.Financial_id=fy.Financial_id WHERE fy.Delete_YN IS NULL AND p.Project_ID= ? AND f.Financial_id= ?";
    var id1 = req.params.id1;
    var id2 = req.params.id2;
   try {
        let result = await mysql.exec(query,[id1,id2])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })


  router.get('/PostPreviewDetail',async (req,resp)=>{
    var query = "SELECT fp.finance_post_main_id,fp.PI_ref_no,fp.Work_order_ref_no,p.Project_name,f.Financial_name FROM finance_post_main fp LEFT join m_project p ON p.Project_ID = fp.Project_ID LEFT JOIN m_financial f ON f.Financial_id=fp.Financial_id WHERE fp.Delete_YN IS NULL";
    var id1 = req.params.id1;
   try {
        let result = await mysql.exec(query,[id1])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })

  
  router.get('/PostPreviewdata/:id1',async (req,resp)=>{
    var query = "SELECT y.yearly_post_detail_id,y.finance_post_main_id,p.Post_name,y.Start_date,y.End_date,y.Salary,y.Description FROM yearly_post_detail y LEFT JOIN m_post p ON p.Post_id=Y.Post_id WHERE y.Delete_YN IS NULL AND y.finance_post_main_id = ?";
    var id1 = req.params.id1;
   try {
        let result = await mysql.exec(query,[id1])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  })

   
  router.get('/bbbbbb/:id1',async (req,resp)=>{
    var query = "SELECT * FROM (SELECT y.yearly_post_detail_id,y.finance_post_main_id,p.Post_name,y.Start_date,y.End_date,y.Salary,y.Description FROM yearly_post_detail Y LEFT JOIN m_post p ON p.Post_id=Y.Post_id  WHERE y.Delete_YN IS NULL) TT INNER JOIN (SELECT fp.finance_post_main_id,fp.PI_ref_no,fp.Work_order_ref_no,p.Project_name,f.Financial_name FROM finance_post_main fp   LEFT join m_project p ON p.Project_ID = fp.Project_ID  LEFT JOIN m_financial f ON f.Financial_id=fp.Financial_id) dd ON dd.finance_post_main_id=TT.finance_post_main_id AND dd.finance_post_main_id = ?";
    var id1 = req.params.id1;
   try {
        let result = await mysql.exec(query,[id1])
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
router.put('/updateFinancialPost/:id',async (req,resp)=>{
    var query = "UPDATE financialyear_post SET ? WHERE financialyear_post_id = ? ";
    var value = req.body;
    var financialyear_post_id = req.params.id;
    try{        
       let result = await mysql.exec(query,[value, financialyear_post_id])
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
    var query = "update financialyear_post SET Delete_YN ='Y' where financialyear_post_id = ?";
    var financialyear_post_id = req.params.id;
try{
    let result = await mysql.exec(query, financialyear_post_id)
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

const upload = multer({   //here upload is function
    storage: multer.diskStorage({
      destination: function (req, file, cb) {   //it decide where we want to store our file //cb is a call back function
       
        cb(null, "documents"); //it contain two parameter second one is upload path(****uploads is a folder name*****)
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname+Date.now()+path.extname(file.originalname)); //here first parameter is error ,second parameter is filename(which can be modify)
      }
    }),
    limits:{fileSize:1000000000000000}   //this for limiting file size
  });   
          //.single("user")///here we have to define that we have to upload single file or multiple file and also define the key name(field name)

        //   first file end point

//   router.use('/api/images', express.static('documents'));//by using this we can access the node file outside the application  // here we have to pass two parameter first is reference of image path and second is actual image path
  router.post("/uploadPIfile",upload.single("PI_refferal_doc"),(req, resp,next) => {  //here file_Path is the key for image which must be same in frotend(angular)
    const file = req.file;
    if(!file){
      return next("no file found")
    }
     resp.json({
          profile_url: config.get('apiUrl') + 'images/' + req.file.filename, //when we are using multer then we get file information on req.file
          sucess:'file uploaded'
      })
      // console.log(req.file)
  });


//   second file endpoint
  router.post("/uploadWOfile",upload.single("Work_order_doc"),(req, resp,next) => {  //here file_Path is the key for image which must be same in frotend(angular)
    const file = req.file;
    if(!file){
      return next("no file found")
    }
     resp.json({
          profile_url: config.get('apiUrl') + 'images/' + req.file.filename, //when we are using multer then we get file information on req.file
          sucess:'file uploaded'
      })
  });

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  
router.get('/getPost/:id',async (req,resp)=>{
  var query = "SELECT * FROM project_post_allotment y LEFT JOIN m_post p ON p.Post_id=y.Post_id WHERE y.Financial_id = ?";
  var getitem = req.params.id;
 try {
      let result = await mysql.exec(query,[getitem])
      if (result.length == 0){
      return resp.status(405).send("item not found");    
      } 
  return resp.json(result);
}
catch(err){
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
  const arr=req.body.paramArray;
  var id = req.params.id;
try {
 var query = "INSERT INTO yearly_post_detail (finance_post_main_id,Post_id,Start_date,End_date,Salary,Description) VALUES (?,?,?,?,?,?) ";
 for (const item of arr) {
   await mysql.exec(query,[id,item.name,item.sdate,item.edate,item.sal,item.desc]);
 }
   let data =
   res.json({
     message: "Data inserted successfully!"
   });
} catch (err) {
   return res.status(404).json(err);
}
});

// get name of post through id
router.get('/test/:id1/:id2',async (req,resp)=>{
  var query = "SELECT p.Post_name AS name FROM project_post_allotment r LEFT JOIN m_post p ON p.Post_id=r.Post_Id  WHERE r.Post_Id = ? AND r.Financial_id = ? ";
  var fin_id = req.params.id1;
  var Post_id = req.params.id2;
  
 try {
      let result = await mysql.exec(query,[fin_id,Post_id])
      if (result.length == 0){
      return resp.status(405).send("data not found");    
      } 
  return resp.json(result);
}
catch(err){
       return resp.status(406).json(err);
  }
});




module.exports = router;