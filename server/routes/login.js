const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");


var config = require('config');
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }
    var username = req.body.username;
    var password = req.body.password;
    var query = "SELECT * FROM login_table WHERE username = ? ";
    try {
        let result = await mysql.exec(query, [username]);
        console.log(result[0].password);
        var Emp_Id=result[0].Emp_Id;
        var role=result[0].role;
        let passwordKey = '08t16e502526fesanfjh8nasd2';
        let passwordDncyt = CryptoJS.AES.decrypt(password, passwordKey).toString(CryptoJS.enc.Utf8);
        console.log('Decrpyt Pwd', passwordDncyt);
        const validPassword = await bcrypt.compare(passwordDncyt, result[0].password);
        if (!validPassword) {
            return res.status(200).send({
                success: 0,
                message: `Wrong credential.`
            });
        }
        else if (validPassword) {
            let response =
            {
                username: username,
                Emp_Id :Emp_Id,
                role:role
            }
            const token = jwt.sign(response, config.get('jwtPrivateKey'),
                {
                    expiresIn: '24h' // expires in 24 hours; expiresIn: '60s' expires in 24 hours
                });
            return res.json
                ({
                    token: token, success: 1, username: username, Emp_Id :Emp_Id,role:role,
                    message: 'Login Success'
                });
        }
        else {
            return res.json
                ({
                    success: 0,
                    message: `Wrong credential.`
                });
        }

    }
    catch (err) {
        console.log('errr'); 
        return res.json({
            success:0,
            message:'error occured',
        })
        // return res.status(404).json(err);
    }
});

router.get('/allEmplogin/:id', async (req, resp) => {
    // var query = "SELECT * FROM manpower_basic_detail WHERE Emp_Id = ?";
    const query = `
    SELECT 
    mbd.Emp_ID, 
    CASE 
        WHEN mbd.Emp_First_Name_E IS NOT NULL THEN CONCAT(mbd.Emp_First_Name_E, IF(mbd.Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Middle_Name_E), ''), IF(mbd.Emp_Last_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Last_Name_E), ''))
        ELSE '' 
    END AS FullName,
    CONCAT('${req.protocol}://${req.get('host')}', mbd.Emp_Photo_Path) AS Emp_Photo_Path,
    mbd.Father_Name_E,
    mbd.Mother_Name_E,
    mbd.Guardian_Name_E,
    p.Post_id,
    p.Post_Name
FROM 
    manpower_basic_detail mbd
LEFT JOIN 
    m_post p ON mbd.Post_id = p.Post_id
WHERE 
    mbd.Emp_Id = ?;

`;

    var Emp_Id = req.params.id;
    try {
        let result = await mysql.exec(query, [Emp_Id])
        if (result.length == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
   }
})

function validateUser(login) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).unknown(true);
    return schema.validate(login);
}

router.get('/userlogindetail/:id',async (req,resp)=>{
    var query = "SELECT mbd.Emp_Id,s.Salutation_Name,mbd.Emp_First_Name_E,mbd.Emp_Middle_Name_E,mbd.Emp_Last_Name_E,mbd.Mobile_No,mbd.Email_Id,mbd.Salutation_E FROM  manpower_basic_detail mbd  LEFT JOIN salutation s ON mbd.Salutation_E = s.Id WHERE mbd.Emp_Id = ?";
   
    var Emp_Id = req.params.id;
   try {
        let result = await mysql.exec(query,[Emp_Id])
        if (result.length == 0){
        return resp.status(405).send("Data not found");    
        } 
    return resp.json(result);
  }
  catch(err){
         return resp.status(406).json(err);
  }
 })

module.exports=router;