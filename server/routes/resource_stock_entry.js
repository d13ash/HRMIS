const express = require('express');
const router = express.Router();
const Joi = require('joi');
var mysql = require('../mysql');
require('express-async-errors');
const multer = require('multer');
const path = require('path');

// Get all the data of stock_entry
router.get('/allstock_entry', async (req, res) => {
    var query = "SELECT * FROM resource_stock_entry";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

router.get('/getallunit', async (req, res) => {
    var query = "SELECT * FROM resource_unit";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// Get all the major category of stock
router.get('/getstock_category', async (req, res) => {
    var query = "SELECT * FROM resource_stock_category";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("item_category Not Found");
    return res.json(result);
});

// View in stock detail entry
router.get('/view/:id', async (req, resp) => {
    var query = "SELECT c.item_name AS name,a.description,a.rate,a.quantity,a.amount FROM resource_stock_detail a INNER JOIN resource_stock_entry b ON a.purchase_id=b.purchase_id INNER JOIN resource_stock_item_master c ON c.category_id=b.category_id AND c.subcategory_id=b.subcategory_id WHERE b.purchase_id= ?";
    var getitem = req.params.id;
    try {
        let result = await mysql.exec(query, [getitem]);
        if (result.length == 0) {
            return resp.status(405).send("item not found");
        }
        return resp.json(result);
    }
    catch (err) {
        console.log("Error in view:", err);
        return resp.status(406).json(err);
    }
});

// Get all the subcategory of the major category
router.get('/getstock_subcategory/:id', async (req, resp) => {
    var query = "SELECT * FROM resource_stock_subcategory WHERE category_id = ?";
    var getstock_subcategory = req.params.id;
    try {
        let result = await mysql.exec(query, [getstock_subcategory]);
        if (result.length == 0) {
            return resp.status(405).send("item_subcategory not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
});

// Date wise data show
router.get('/showdata', async (req, res) => {
    var query = `SELECT purchase_id, purachase_name, purchase_order_no, agency, bill_date FROM resource_stock_entry`;
    const result = await mysql.exec(query);
    console.log("resourse", result);
    return res.json(result);
});

router.get('/showdatawithoutproc', async (req, res) => {
    var query = "SELECT purchase_id, purachase_name, purchase_order_no, agency, bill_date FROM resource_stock_entry";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("item_category Not Found");
    return res.json(result);
});

// All data show in allresource detail
router.get('/showdata123', async (req, res) => {
    var query = "SELECT purchase_id,purachase_name,purchase_order_no,agency,bill_date FROM resource_stock_entry";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("item_category Not Found");
    return res.json(result);
});

// Table
router.get('/showdata1/:id', async (req, resp) => {
    var query = "SELECT rs.item_id,rsm.item_name,rs.description,rs.quantity,rs.amount,rs.rate FROM resource_stock_detail rs LEFT JOIN resource_stock_item_master rsm ON rsm.item_id = rs.item_id WHERE purchase_id = ?";
    var getitem = req.params.id;
    try {
        let result = await mysql.exec(query, [getitem]);
        if (result.length == 0) {
            console.log("Error in showdata1:");
            return resp.status(405).send("item not found");
        }
        return resp.json(result);
    }
    catch (err) {
        console.log("Error in showdata1:", err);
        return resp.status(406).json(err);
    }
});

// Get all the item on the basis of their category and subcategory
router.get('/getitem/:id', async (req, resp) => {
    // FIXED: Only filter by sub_category_id for now
    var query = "SELECT * FROM resource_stock_item_master WHERE sub_category_id = ?";
    var getitem = req.params.id;
    try {
        let result = await mysql.exec(query, [getitem]);
        if (result.length == 0) {
            return resp.status(405).send("item not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
});

// Insert stock detail (single correct route)
router.post('/post', async (req, res) => {
    console.log("POST /post route hit");
    var values = req.body;
  //  let {purchase_order_no,}= values;
    let {purchase_order_no,purachase_name, agency, bill_no,bill_date, bill_attatchment, amount, category_id, entrydate,subcategory_id, Unit_ID, item_id,stock_type,product_Description ,rate,quantity} = values;
    console.log("Request body:", values);
    var query = `INSERT INTO  resource_stock_entry(purchase_order_no, purachase_name,agency,stock_type,bill_no,entrydate,amount,bill_date,bill_attachment,category_id,subcategory_id) 
    values("${purchase_order_no}","${purachase_name}","${agency}",'${stock_type}',"${bill_no}",'${entrydate}',${amount},'${bill_date}',"${bill_attatchment}",${category_id},${subcategory_id})`; ;
   
  
    try{
        let data = await mysql.exec(query);
        let purchase_id = data.insertId; // Get the last inserted ID
        console.log("Inserted purchase_id:", purchase_id);

        var query1 = `INSERT INTO resource_stock_detail(purchase_id,item_id,description,quantity,Unit_ID,amount,rate)
    values( ${purchase_id},${item_id}, "${product_Description}", ${quantity}, ${Unit_ID}, ${amount}, ${rate})`;
        let data1 = await mysql.exec(query1);
        res.json({
            id : data.insertId,
            message: "Data inserted successfully!"
        });
    } catch (err) {
        console.log("error",err)
        return res.status(404).json(err);
    }
});

router.post('/post1/:id', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
       const arr=req.body.paramArray;
       var id = req.params.id;
    try {
      var query = "INSERT INTO resource_stock_detail (purchase_id,item_id,description,rate,quantity,amount,Unit_ID) VALUES (?,?,?,?,?,?,?) ";
      for (const item of arr) {
        await mysql.exec(query,[id,item.name,item.desc,item.rate,item.quant,item.amount,item.Unit_ID]);
      }
        let data =
        res.json({
          message: "Data inserted successfully!"
        });
    } catch (err) {
        return res.status(404).json(err);
}
});


// File upload setup
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/resource");
    },
    filename: function (req, file, cb) {
      cb(null, 'BILL_' + Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.use('/api/resource-images', express.static('uploads/resource'));

router.post("/uploadfile", upload.single("Logo_Path"), (req, resp, next) => {
    const file = req.file;
    if (!file) {
        return next("no file found");
    }
    resp.json({
        profile_url: `http://localhost:4000/api/images/${req.file.filename}`,
        sucess: 'file uploaded'
    });
});

// Joi validation function
function validatedepartmentdata(departDetail) {
    const schema = Joi.object({
        purachase_name: Joi.string().required(),
        purchase_order_no: Joi.number(),
        agency: Joi.string().required(),
        bill_no: Joi.number().required(),
        bill_attatchment: Joi.string().required(),
        amount: Joi.number(),
        category_id: Joi.number(),
        subcategory_id: Joi.number(),
        item_id: Joi.number(),
        description: Joi.string(),
    }).unknown(true);
    return schema.validate(departDetail);
}

// Get stock subcategory by cat, sub, item
router.get('/getstock_subcategory/:cat/:sub/:item', async (req, resp) => {
    var query = "SELECT r.item_name AS name FROM resource_stock_item_master r WHERE r.item_id=? AND r.category_id=? AND r.sub_category_id=? ";
    var cat_id = req.params.cat;
    var sub_id = req.params.sub;
    var item_id = req.params.item;
    try {
        let result = await mysql.exec(query, [item_id, cat_id, sub_id]);
        if (result.length == 0) {
            return resp.status(405).send("item not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
});

module.exports = router;