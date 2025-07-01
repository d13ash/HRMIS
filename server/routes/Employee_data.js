const express = require("express"); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require("joi"); //joi module return a Class and By covention class name start with capital letter
var mysql = require("../mysql");
require("express-async-errors");
const bcrypt = require("bcrypt");

const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const { promisify } = require("util");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Decide where to store the file
      cb(null, "uploads/employeedata"); // "uploads" is the folder name
    },
    filename: function (req, file, cb) {
      // Modify the file name to include a timestamp
      cb(
        null,
        file.originalname + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 100 * 1024 }, // Limit file size to 100 KB
});

// router.use("/images", express.static("uploads")); //by using this we can access the node file outside the application  // here we have to pass two parameter first is reference of image path and second is actual image path
router.post(
  "/uploadfile",
  upload.single("Emp_Photo_Path"),
  (req, resp, next) => {
    //here file_Path is the key for image which must be same in frotend(angular)
    const file = req.file;
    if (!file) {
      return next("No File Found");
    }
    const profileURL = "/api/uploads/employeedata/" + req.file.filename;
    resp.json({
      profile_url: profileURL,
      success: "File Uploaded Successfully",
    });
  }
);

router.post(
  "/uploadfiles",
  upload.single("Document_Path"),
  (req, resp, next) => {
    //here file_Path is the key for image which must be same in frotend(angular)
    const file = req.file;
    if (!file) {
      return next("no file found");
    }
    const profileURL = "/api/uploads/employeedata/" + req.file.filename;
    resp.json({
      profile_url: profileURL,
      success: "File Uploaded Successfully",
    });
  }
);

router.get("/allempdetails/allemp", async (req, res) => {
  var query =
    "SELECT COUNT(DISTINCT emp.Emp_Id) AS employee_count, COUNT(DISTINCT CASE WHEN proj.Status = 'Complete' THEN proj.Project_ID END) AS completed_projects_count, COUNT(DISTINCT CASE WHEN proj.Status = 'In-Process' THEN proj.Project_ID END) AS in_process_projects_count,COUNT(DISTINCT `mod`.project_module_id) AS module_count,COUNT(DISTINCT CASE WHEN `mod`.Status = 'Complete' THEN `mod`.project_module_id END) AS completed_modules_count, COUNT(DISTINCT CASE WHEN `mod`.Status = 'In-Process' THEN `mod`.project_module_id END) AS in_process_modules_count,total_projects.total_count AS total_projects_count FROM manpower_basic_detail emp LEFT JOIN m_project proj ON 1 = 1 LEFT JOIN project_module `mod` ON 1 = 1 LEFT JOIN ( SELECT COUNT(DISTINCT Project_ID) AS total_count FROM m_project ) AS total_projects ON 1 = 1;";

  let result = await mysql.exec(query);

  if (result.length == 0) return res.status(404).send("Data Not Found");
  return res.json(result);
});

router.post(
  "/uploadfilesig",
  upload.single("Emp_Signature_Path"),
  (req, resp, next) => {
    //here file_Path is the key for image which must be same in frotend(angular)
    const file = req.file;
    if (!file) {
      return next("No File Found");
    }
    const profileURL = "/api/uploads/employeedata/" + req.file.filename;
    resp.json({
      profile_url: profileURL,
      success: "File Uploaded Successfully",
    });
  }
);

router.get("/allempdetails", async (req, res) => {
  var query = `SELECT 
    mbd.Emp_ID, 
    CASE 
        WHEN mbd.Emp_First_Name_E IS NOT NULL THEN 
            CONCAT(
                mbd.Emp_First_Name_E,
                IF(mbd.Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Middle_Name_E), ''),
                IF(mbd.Emp_Last_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Last_Name_E), '')
            )
        ELSE '' 
    END AS FullName,
    mbd.Emp_Photo_Path,
    mbd.Emp_Signature_Path, -- Include the signature path
    mbd.Father_Name_E,
    mbd.Mother_Name_E,
    mbd.Guardian_Name_E,
    mbd.Mobile_No,
    mbd.Email_Id,
    lt.username,
    lt.password,
    mdd.Emp_Document_Detail_Id,
    mdd.Document_Id,
    mdd.Document_Path
FROM 
    manpower_basic_detail mbd
LEFT JOIN 
    login_table lt 
    ON lt.Emp_ID = mbd.Emp_ID
LEFT JOIN 
    manpower_document_detail mdd 
    ON mdd.Emp_ID = mbd.Emp_ID;
`;
  let result = await mysql.exec(query);

  if (result.length == 0) return res.status(404).send("Data Not Found");

  return res.json(result);
});
router.get("/documentsdetail/adddocuments", async (req, res) => {
  var query = "SELECT * FROM manpower_document_detail";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("documents Not Found");

  return res.json(result);
});

// GET username by Emp_Id
router.get("/getid/:id", async (req, res) => {
  const empId = req.params.id;
  const query = "SELECT username FROM login_table WHERE Emp_Id = ?";

  try {
    const result = await mysql.exec(query, [empId]);

    if (result.length > 0) {
      res.status(200).json(result[0]); // sends { username: 'PGMIS0036' }
    } else {
      res.status(404).json({ message: "Username not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
});

router.get("/", async (req, res) => {
  var query = "SELECT * FROM country";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("Country Not Found");
  return res.json(result);
});

router.get("/postdata", async (req, res) => {
  var query =
    "SELECT Post_id, Post_name, Post_name_hindi, Display_order FROM m_post ORDER BY Display_order ASC;";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("Post Not Found");
  return res.json(result);
});
router.get("/documents", async (req, res) => {
  var query = "SELECT * FROM M_Manpower_Document";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("documents Not Found");

  return res.json(result);
});

router.get("/:Country_id", async (req, resp) => {
  var query = "SELECT * FROM state WHERE Country_id = ?";
  var Country_id = req.params.Country_id;

  try {
    let result = await mysql.exec(query, [Country_id]);
    if (result.length == 0) {
      return resp.status(405).send("State not found");
    }
    return resp.json(result);
  } catch (err) {
    return resp.status(406).json(err);
  }
});

router.get("/Statename/:State_id", async (req, resp) => {
  var query = "SELECT * FROM distric WHERE State_id = ?";
  var State_id = req.params.State_id;

  try {
    let result = await mysql.exec(query, [State_id]);
    if (result.length == 0) {
      return resp.status(405).send("District not found");
    }
    return resp.json(result);
  } catch (err) {
    return resp.status(406).json(err);
  }
});

router.get("/Districtname/:Distric_id", async (req, resp) => {
  var query = "SELECT * FROM block WHERE Distric_id = ?";
  var Distric_id = req.params.Distric_id;
  try {
    let result = await mysql.exec(query, [Distric_id]);
    if (result.length == 0) {
      return resp.status(405).send("Block not found");
    }
    return resp.json(result);
  } catch (err) {
    return resp.status(406).json(err);
  }
});

router.get("/sal/salutations", async (req, res) => {
  var query = "SELECT Id, Salutation_Name FROM salutation";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("Salutation Not Found");
  return res.json(result);
});

// Delete departmetnt detail
router.delete("/deletedataByid/:Emp_Id", async (req, res) => {
  var query = "DELETE FROM manpower_basic_detail WHERE Emp_Id = ?";
  var Employee_ID = req.params.Emp_Id;
  try {
    let result = await mysql.exec(query, Employee_ID);
    if (result.affectedRows < 1) {
      //affectRows denote any changes is done through any operation (put,post)
      return res.status(404).send("error...");
    }
    return res.json({ status: "data deleted" });
  } catch (err) {
    if (err) {
      return res.status(404).send("error");
    }
  }
});

// Delete departmetnt detail
router.delete("/deletedByid/:Emp_ID", async (req, res) => {
  var query =
    "DELETE mbd, lt FROM manpower_basic_detail mbd LEFT JOIN login_table lt ON lt.Emp_ID = mbd.Emp_ID WHERE mbd.Emp_ID =  ?";
  var Employee_ID = req.params.Emp_ID;
  try {
    let result = await mysql.exec(query, Employee_ID);
    if (result.affectedRows < 1) {
      //affectRows denote any changes is done through any operation (put,post)
      return res.status(404).send("error...");
    }
    return res.json({ status: "data deleted" });
  } catch (err) {
    if (err) {
      return res.status(404).send("error");
    }
  }
});

router.post("/empdetailsadd", async (req, res) => {
  // const { error } = validateEmployeedata(req.body);
  // if (error) {
  //     res.status(404).send(error.details[0].message);
  // }
  var values = req.body;
  var query = "INSERT INTO manpower_basic_detail SET ? ";

  try {
    let data = await mysql.exec(query, values);
    const email = req.body.Email_Id;
    res.json({
      id: data.insertId,
      email: email,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.post("/user/addlogin", async (req, res) => {
  const password = req.body.password;
  let passwordKey = "08t16e502526fesanfjh8nasd2";
  let passwordDncyt = CryptoJS.AES.decrypt(password, passwordKey).toString(
    CryptoJS.enc.Utf8
  );
  console.log("Decrpyt Pwd", passwordDncyt);
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashed = await bcrypt.hash(passwordDncyt, salt);
  console.log(hashed);
  const { error } = validateusers(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  var values = {
    password: hashed,
    Emp_Id: req.body.Emp_Id,
  };
  var query = "INSERT INTO login_table SET ? ";

  try {
    let data = await mysql.exec(query, values);
    let insertedData = await mysql.exec(
      "SELECT * FROM login_table WHERE id = ?",
      [data.insertId]
    );
    const { id, username } = insertedData[0];
    const decryptedPassword = passwordDncyt;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "mahim.test29@gmail.com", // generated ethereal user
        pass: "ijiu gqcu pxaq oxlt", // generated ethereal password
      },
    });

    const mailOptions = {
      from: "mahim.test29@gmail.com",
      to: req.body.email,
      subject: "Your Userid And Password ",
      text: `Your User ID is ${username}. Your Password is ${decryptedPassword}.`,
    };

    const sendMail = promisify(transporter.sendMail).bind(transporter);
    await sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
});

router.put("/updateuserdata/:id", async (req, resp) => {
  var query = "UPDATE manpower_basic_detail SET ? WHERE Emp_Id = ?";
  var value = req.body;
  let Emp_Id = req.params.id;
  try {
    let result = await mysql.exec(query, [value, Emp_Id]);
    if (result.affectedRows < 1) {
      return resp.status(404).send("error....");
    }
    resp.json({
      id: parseInt(Emp_Id), // Parse the result.Emp_Id as an integer
    });
  } catch (err) {
    if (err) {
      return resp.status(404).send("error..");
    }
  }
});

router.post("/documentsdetail/adddocuments", async (req, res) => {
 
  var values = req.body;
  var query = "INSERT INTO manpower_document_detail SET ? ";

  try {
    let data = await mysql.exec(query, values);
    res.json({
      id: data.insertId,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.get("/documentsdetail/getdocuments/:Emp_Id", async (req, res) => {
  const Emp_Id = req.params.Emp_Id;
  const query = "SELECT * FROM manpower_document_detail WHERE Emp_Id = ?";
  const result = await mysql.exec(query, [Emp_Id]);

  if (!result || result.length === 0) {
    return res.status(404).send("No documents found for the specified Emp_Id");
  }

  res.json(result);
});



router.put("/updatelogindata/:ID", async (req, res) => {
  const password = req.body.password;
  let passwordKey = "08t16e502526fesanfjh8nasd2";
  let passwordDncyt = CryptoJS.AES.decrypt(password, passwordKey).toString(
    CryptoJS.enc.Utf8
  );
  console.log("Decrpyt Pwd", passwordDncyt);

  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashed = await bcrypt.hash(passwordDncyt, salt);
  console.log(hashed);

  // const { error } = validateusers(req.body);
  // if (error) {
  //     res.status(404).send(error.details[0].message);
  // }

  var values = {
    password: hashed,
  };

  var query = "UPDATE login_table SET ? WHERE username = ?";

  try {
    let data = await mysql.exec(query, [values, req.params.ID]);
    res.json({
      id: data.insertId,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});

function validateEmployeedata(employeedata) {
  const schema = Joi.object({
    Salutation_E: Joi.required(),
    Emp_First_Name_E: Joi.string().min(3).required(),
    Emp_Middle_Name_E: Joi.string().min(3).required(),
    Emp_Last_Name_E: Joi.string().min(3).required(),
    Father_Name_E: Joi.string().min(3).required(),
    Mother_Name_E: Joi.string().min(3).required(),
    Guardian_Name_E: Joi.string().min(3).required(),
    Mobile_No: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    Email_Id: Joi.string().min(3).required().email(),
    Gender_Id: Joi.string().required(),
    DOB: Joi.date().required(),
    Permanent_Address: Joi.string().required(),
    Permanent_Country_Id: Joi.required(),
    Permanent_State_Id: Joi.required(),
    Permanent_District_Id: Joi.required(),
    Permanent_Block_Id: Joi.required(),
    Permanent_Pin_Code: Joi.required(),
    Permanent_City: Joi.required(),
    Current_Address: Joi.required(),
    Current_Country_Id: Joi.required(),
    Current_State_Id: Joi.required(),
    Current_District_Id: Joi.required(),
    Current_Block_Id: Joi.required(),
    Current_Pin_Code: Joi.required(),
    Current_City: Joi.required(),
    Emp_Photo_Path: Joi,
  }).unknown(true);
  return schema.validate(employeedata);
}

function validateusers(users) {
  const schema = Joi.object({
    password: Joi.string().min(3).required(),
    Emp_Id: Joi.required(),
  }).unknown(true);
  return schema.validate(users);
}
module.exports = router;
