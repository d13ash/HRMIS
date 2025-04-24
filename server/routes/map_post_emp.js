const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer')
const path = require('path')

router.get('/getmapData', async (req, res) => {
    var query = 'SELECT mp.Map_post_emp_id,f.Financial_name,f.Financial_id,mp.NOC_reliving, mp.Remark,mp.Join_date,mp.Reliving_order,mp.Appointment_order,mp.Reliving_date, mp.Active_yn,mb.Emp_First_Name_E,mb.Emp_Id,mp.Post_Id,p.Post_name FROM map_post_emp mp LEFT join manpower_basic_detail mb ON mb.Emp_Id = mp.Emp_Id LEFT join m_post p ON p.Post_id = mp.Post_id  LEFT JOIN m_financial f ON f.Financial_id = mp.Financial_id WHERE mp.Delete_YN IS null';
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
      router.use('/api/images', express.static('documents'));//by using this we can access the node file outside the application  // here we have to pass two parameter first is reference of image path and second is actual image path
      router.post("/uploadfile",upload.single("NOC_reliving"),(req, resp,next) => {  //here file_Path is the key for image which must be same in frotend(angular)
        const file = req.file;
        if(!file){
          return next("no file found")
        }
         resp.json({
              profile_url: `http://localhost:3000/api/images/${req.file.filename}`, //when we are using multer then we get file information on req.file
              // profile_url: `images/${req.file.filename}`,
              sucess:'file uploaded'
          })
          // console.log(req.file)
      });

    //   ====================================== new ==========================

    












      

module.exports = router;