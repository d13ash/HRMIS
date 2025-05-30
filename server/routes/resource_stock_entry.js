const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer')
const path = require('path')


//get all the data of stock_entry....!
router.get('/allstock_entry', async (req, res) => {
    var query = "SELECT * FROM resource_stock_entry";
    console.log("called");
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});
//get all  the major category of stock
router.get('/getstock_category', async (req, res) => {
    var query = "SELECT * FROM resource_stock_category";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("item_category Not Found");
    return res.json(result);
});

// veiw in stock detail entry
router.get('/view/:id',async (req,resp)=>{
  var query = "SELECT c.item_name AS name,a.description,a.rate,a.quantity,a.amount FROM resource_stock_detail as a INNER JOIN resource_stock_entry as b ON a.purchase_id=b.purchase_id INNER JOIN resource_stock_item_master as c ON c.category_id=b.category_id AND c.sub_category_id=b.subcategory_id WHERE b.purchase_id= ?";
  var getitem = req.params.id;
  try {
      let result = await mysql.exec(query,[getitem])
      if (result.length == 0){
      return resp.status(405).send("item not found");    
      } 
  return resp.json(result);
  }
  catch(err){
    console.log('error',err);
       return resp.status(406).json(err);
  }
  });

//get all the subcategory of the major category
router.get('/getstock_subcategory/:id',async (req,resp)=>{
    var query = "SELECT * FROM resource_stock_subcategory WHERE category_id = ?";
    var getstock_subcategory = req.params.id;
   try {
        let result = await mysql.exec(query,[getstock_subcategory])
        if (result.length == 0){
        return resp.status(405).send("item_subcategory not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
    }
  });



 //iuhgukbhk///not in use 
 
//  router.get('/showdata', async (req, res) => {
//   var query = "SELECT purchase_id,purachase_name,purchase_order_no,agency,bill_no,bill_date,bill_attachment,amount,res.category_id,res.subcategory_id,res.item_id,category_name,item_name,sub_category_name,`description` FROM resource_stock_entry res, resource_stock_item_master rsi,resource_stock_category rsc,resource_stock_subcategory rss WHERE res.item_id=rsi.item_id AND res.category_id=rsc.category_id AND res.subcategory_id=rss.sub_category_id";

//   let result = await mysql.exec(query);
//   if (result.length == 0)
//       return res.status(404).send("item_category Not Found");
//   return res.json(result);
// });

//  date wise data show
router.get('/showdata', async (req, res) => {
  var query = `CALL executeQuery7();`;
  const [result] = await mysql.exec(query);
  // if (result.length == 0)
  //     return res.status(404).send("getall");
  return res.json(result); 
});

router.get('/showdatawithoutproc', async (req, res) => {
  var query = "SELECT purchase_id, purachase_name, purchase_order_no, agency, bill_date FROM resource_stock_entry";
  let result = await mysql.exec(query);
  if (result.length == 0)
      return res.status(404).send("item_category Not Found");
  return res.json(result);
});


// all data show in allresource detail
router.get('/showdata123', async (req, res) => {
  var query = "SELECT purchase_id,purachase_name,purchase_order_no,agency,bill_date FROM resource_stock_entry";
  let result = await mysql.exec(query);
  if (result.length == 0)
      return res.status(404).send("item_category Not Found");
  return res.json(result);
});

 /////table
router.get('/showdata1/:id',async (req,resp)=>{
  var query = "SELECT rs.item_id,rsm.item_name,rs.description,rs.quantity,rs.amount,rs.rate FROM resource_stock_detail rs LEFT JOIN resource_stock_item_master rsm ON rsm.item_id = rs.item_id WHERE purchase_id = ? ";

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
router.delete('/delete/:ID',async (req,res)=>{
    var query = "DELETE FROM resource_stock_entry WHERE purchase_id = ?";
    var Employee_ID = req.params.ID;
  try{
    let result = await mysql.exec(query, Employee_ID)
    if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
       
        console.log("error")
      return res.status(404).send('error...');     
    }
    return res.json({status: "data deleted" })
  }
  
  catch(err){
    if(err){
        console.log("error",err)
        return res.status(404).send('error'); }
  }
  })


//get all the item on the basic of their category and subcategory

router.get('/getitem/:id',async (req,resp)=>{
    var query = "SELECT * FROM resource_stock_entry WHERE purchase_id= ?";
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

  router.post('/post', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
    var values = req.body;
    var query = "INSERT INTO resource_stock_entry SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});


const upload = multer({   //here upload is function
  storage: multer.diskStorage({
    destination: function (req, file, cb) {   //it decide where we want to store our file //cb is a call back function
      cb(null, "upload_section/bill_attachment"); //it contain two parameter second one is upload path(**uploads is a folder name***)
   },
    filename: function (req, file, cb) {
       cb(null, file.originalname+Date.now()+path.extname(file.originalname)); //here first parameter is error ,second parameter is filename(which can be modify)
    }
  }),
  limits:{fileSize:100000000}   //this for limiting file size
});   
        //.single("user")///here we have to define that we have to upload single file or multiple file and also define the key name(field name)
router.use('/api/images', express.static('uploads'));//by using this we can access the node file outside the application  // here we have to pass two parameter first is reference of image path and second is actual image path
router.post("/uploadfile",upload.single("Logo_Path"),(req, resp,next) => {  //here file_Path is the key for image which must be same in frotend(angular)
  const file = req.file;
  if(!file){
    return next("no file found")
  }
   resp.json({
        profile_url: `http://localhost:4000/api/bill_attachment/${req.file.filename}`, //when we are using multer then we get file information on req.file
        // profile_url: `images/${req.file.filename}`,
        sucess:'file uploaded'
    })
    // console.log(req.file)
});



function validatedepartmentdata(departDetail) {
  const schema = Joi.object({
    purachase_name: Joi.string().required(),
    purchase_order_no: Joi.number(),
    agency: Joi.string().required(),
    bill_no: Joi.number().required(),
    bill_attatchment: Joi.string().required(),
    amount:Joi.number(),
    category_id:Joi.number(),
    subcategory_id: Joi.number(),
    item_id: Joi.number(),
    description: Joi.string(),
    
    
      // gender: Joi.string().min(3).required(),
      // dob: Joi.date().required(),
      // Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  }).unknown(true);
  return schema.validate(departDetail);
}

  router.post('/post1/:id', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
       const arr=req.body.paramArray;
       var id = req.params.id;
    try {
      var query = "INSERT INTO resource_stock_detail (purchase_id,item_id,description,rate,quantity,amount) VALUES (?,?,?,?,?,?) ";
      for (const item of arr) {
        await mysql.exec(query,[id,item.name,item.desc,item.rate,item.quant,item.amount]);
      }
        let data =
        res.json({
          message: "Data inserted successfully!"
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});


router.get('/getstock_subcategory/:cat/:sub/:item',async (req,resp)=>{
  var query = "SELECT r.item_name AS name FROM resource_stock_item_master r WHERE r.item_id=? AND r.category_id=? AND r.sub_category_id=? ";
  var cat_id = req.params.cat;
  var sub_id = req.params.sub;
  var item_id = req.params.item;
  
 try {
      let result = await mysql.exec(query,[item_id,cat_id,sub_id])
      if (result.length == 0){
      return resp.status(405).send("item not found");    
      } 
  return resp.json(result);
}
catch(err){
       return resp.status(406).json(err);
  }
});

// ==================================================









module.exports = router;