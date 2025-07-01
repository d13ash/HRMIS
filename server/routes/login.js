const express = require("express"); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require("joi"); //joi module return a Class and By covention class name start with capital letter
var mysql = require("../mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

var config = require("config");
router.post("/", async (req, res) => {
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
    var Emp_Id = result[0].Emp_Id;
    var role = result[0].role;
    let passwordKey = "08t16e502526fesanfjh8nasd2";
    let passwordDncyt = CryptoJS.AES.decrypt(password, passwordKey).toString(
      CryptoJS.enc.Utf8
    );
    console.log("Decrpyt Pwd", passwordDncyt);
    const validPassword = await bcrypt.compare(
      passwordDncyt,
      result[0].password
    );
    if (!validPassword) {
      return res.status(200).send({
        success: 0,
        message: `Wrong credential.`,
      });
    } else if (validPassword) {
      let response = {
        username: username,
        Emp_Id: Emp_Id,
        role: role,
      };
      const token = jwt.sign(response, config.get("jwtPrivateKey"), {
        expiresIn: "24h", // expires in 24 hours; expiresIn: '60s' expires in 24 hours
      });
      return res.json({
        token: token,
        success: 1,
        username: username,
        Emp_Id: Emp_Id,
        role: role,
        message: "Login Success",
      });
    } else {
      return res.json({
        success: 0,
        message: `Wrong credential.`,
      });
    }
  } catch (err) {
    console.log("errr");
    return res.json({
      success: 0,
      message: "error occured",
    });
    // return res.status(404).json(err);
  }
});

// router.get('/allEmplogin/:id', async (req, resp) => {
//     // var query = "SELECT * FROM manpower_basic_detail WHERE Emp_Id = ?";
//     const query = `
//     SELECT
//     mbd.Emp_ID,
//     CASE
//         WHEN mbd.Emp_First_Name_E IS NOT NULL THEN CONCAT(mbd.Emp_First_Name_E, IF(mbd.Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Middle_Name_E), ''), IF(mbd.Emp_Last_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Last_Name_E), ''))
//         ELSE ''
//     END AS FullName,
//     CONCAT('${req.protocol}://${req.get('host')}', mbd.Emp_Photo_Path) AS Emp_Photo_Path,
//     mbd.Father_Name_E,
//     mbd.Mother_Name_E,
//     mbd.Guardian_Name_E,
//     p.Post_id,
//     p.Post_Name
// FROM
//     manpower_basic_detail mbd
// LEFT JOIN
//     m_post p ON mbd.Post_id = p.Post_id
// WHERE
//     mbd.Emp_Id = ?;

// `;

//     var Emp_Id = req.params.id;
//     try {
//         let result = await mysql.exec(query, [Emp_Id])
//         if (result.length == 0) {
//             return resp.status(405).send("Data not found");
//         }
//         return resp.json(result);
//     }
//     catch (err) {
//         return resp.status(406).json(err);
//    }
// })

router.get("/allEmplogin/:id", async (req, resp) => {
  const query = `
    SELECT 
        mbd.Emp_ID, 
        CASE 
            WHEN mbd.Emp_First_Name_E IS NOT NULL THEN CONCAT(mbd.Emp_First_Name_E, IF(mbd.Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Middle_Name_E), ''), IF(mbd.Emp_Last_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Last_Name_E), ''))
            ELSE '' 
        END AS FullName,
        CONCAT('${req.protocol}://${req.get(
    "host"
  )}/api', mbd.Emp_Photo_Path) AS Emp_Photo_Path,
        mbd.Father_Name_E,
        mbd.Mother_Name_E,
        mbd.Guardian_Name_E,
        mbd.Mobile_No,
        mbd.Email_Id,
        mbd.DOB,
        mbd.Permanent_Address,
        mbd.Current_Address,
        mbd.Permanent_Pin_Code,
        mbd.Current_Pin_Code,
        p.Post_id,
        p.Post_Name,
        lt.username
    FROM 
        manpower_basic_detail mbd
    LEFT JOIN 
        m_post p ON mbd.Post_id = p.Post_id
    LEFT JOIN 
        login_table lt ON mbd.Emp_ID = lt.Emp_Id
    WHERE 
        mbd.Emp_Id = ?;
    `;

  const Emp_Id = req.params.id;
  try {
    const result = await mysql.exec(query, [Emp_Id]);
    if (result.length === 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  } catch (err) {
    return resp.status(406).json(err);
  }
});

function validateUser(login) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true);
  return schema.validate(login);
}

router.get("/userlogindetail/:id", async (req, resp) => {
  var query = `SELECT 
    mbd.Emp_Id,
    s.Salutation_Name,
    mbd.Emp_First_Name_E,
    mbd.Emp_Middle_Name_E,
    mbd.Emp_Last_Name_E,
    mbd.Guardian_Name_E,
    mbd.Mobile_No,
    mbd.Email_Id,
    mbd.Father_Name_E,
    mbd.Mother_Name_E,
    mbd.Gender_Id,
    mbd.DOB,
    mbd.Permanent_Address,
    mbd.Current_Address,
    mbd.Salutation_E,
    CONCAT('${req.protocol}://${req.get(
    "host"
  )}', mbd.Emp_Photo_Path) AS Emp_Photo_Path,
    CONCAT('${req.protocol}://${req.get(
    "host"
  )}', mbd.Emp_Signature_Path) AS Emp_Signature_Path,
    mbd.Permanent_Block_Id,
    mbd.Permanent_District_Id,
    mbd.Permanent_State_Id,
    mbd.Permanent_Country_Id,
    mbd.Permanent_Pin_Code,
    mbd.Permanent_City,
    mbd.Current_Block_Id,
    mbd.Current_District_Id,
    mbd.Current_State_Id,
    mbd.Current_Country_Id,
    mbd.Current_Pin_Code,
    mbd.Current_City,
    md.Document_Id,
    md.Document_Path
FROM 
    manpower_basic_detail mbd
LEFT JOIN 
    salutation s ON mbd.Salutation_E = s.Id
LEFT JOIN 
    country pc ON mbd.Permanent_Country_Id = pc.Country_id
LEFT JOIN 
    country cc ON mbd.Current_Country_Id = cc.Country_id
LEFT JOIN
    state ps ON mbd.Permanent_State_Id = ps.State_id
LEFT JOIN
    state cs ON mbd.Current_State_Id = cs.State_id
LEFT JOIN
    distric pd ON mbd.Permanent_District_Id = pd.Distric_id
LEFT JOIN
    distric cd ON mbd.Current_District_Id = cd.Distric_id
LEFT JOIN
    block pb ON mbd.Permanent_Block_Id = pb.Block_id      
LEFT JOIN
    block cb ON mbd.Current_Block_Id = cb.Block_id
LEFT JOIN
    manpower_document_detail md ON mbd.Emp_Id = md.Emp_Id
WHERE 
    mbd.Emp_Id = ?;
`;
  var Emp_Id = req.params.id;
  try {
    let result = await mysql.exec(query, [Emp_Id]);
    if (result.length == 0) {
      return resp.status(405).send("Data not found");
    }
    return resp.json(result);
  } catch (err) {
    return resp.status(406).json(err);
  }
});

module.exports = router;
