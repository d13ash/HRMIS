const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');


router.get('/allpostdetails', async (req, res) => {
    var query = "SELECT p.Post_id,p.Post_name,p.Post_short_name,p.Post_name_hindi,p.Post_leval,mp.Post_type_name FROM m_post p RIGHT JOIN m_post_type mp ON p.Post_Type_ID = mp.Post_Type_ID";
    let result = await mysql.exec(query);
    
    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);

});

router.get('/postType', async (req, res) => {
    var query = "SELECT * FROM m_post_type";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Post Not Found");

    return res.json(result);

});
// router.get('/Hod', async (req, res) => {
//     var query = "SELECT * FROM m_hod";
//     let result = await mysql.exec(query);
//     if (result.length == 0)
//         return res.status(404).send("HOD Not Found");

//     return res.json(result);

// });


router.put('/updatepostdata/:id',async (req,resp)=>{
    var query = "UPDATE m_post SET ? WHERE Post_id = ? ";
    var value = req.body;
    var Post_id = req.params.id;
    try{
       let result = await mysql.exec(query,[value, Post_id])
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

router.delete('/deletePostByid/:id',async (req,res)=>{
    var query = "DELETE FROM m_post WHERE Post_id = ?";
    var Post_id = req.params.id;
try{
    let result = await mysql.exec(query, Post_id)
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


router.post('/submitPost', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO m_post SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});
// function validatePostdata(post) {
//     const schema = Joi.object({
//         Post_name: Joi.string().min(3).required(),
//         Post_name_hindi: Joi.string().min(3).required(),
//         Post_short_name: Joi.string().min(1).required(),
//         Post_type: Joi.required(),
//         Post_leval: Joi.required(),
//         Display_order: Joi.required(),
//         Is_hod: Joi.required(),

//     }).unknown(true);
//     return schema.validate(post);

// }
module.exports = router;