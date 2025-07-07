const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
var config = require('config');
const multer = require('multer');
const path = require('path');

// * ---------------------------------profile page---------------------------------- * //
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/employeedata");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
}); 

router.get('/profile/:id', async (req, resp) => {
    // var query = "SELECT * FROM manpower_basic_detail WHERE Emp_Id = ?";
    const query = `
SELECT 
    mbd.Emp_ID, 
    CASE 
        WHEN mbd.Emp_First_Name_E IS NOT NULL THEN 
            CONCAT(mbd.Emp_First_Name_E, 
                IF(mbd.Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Middle_Name_E), ''), 
                IF(mbd.Emp_Last_Name_E IS NOT NULL, CONCAT(' ', mbd.Emp_Last_Name_E), '')
            )
        ELSE '' 
    END AS FullName,
    CONCAT('${req.protocol}://${req.get('host')}/api', mbd.Emp_Photo_Path) AS Emp_Photo_Path,
    mbd.Father_Name_E,
    mbd.Mother_Name_E,
    mbd.Guardian_Name_E,
    mbd.Email_Id,
    mbd.Mobile_No,
    mbd.DOB,
    p.Post_id,
    p.Post_Name,
    lt.username
FROM 
    manpower_basic_detail mbd
LEFT JOIN 
    m_post p ON mbd.Post_id = p.Post_id
LEFT JOIN 
    login_table lt ON lt.Emp_Id = mbd.Emp_Id
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
});

router.put('/profile/pic/:id', upload.single('Emp_Photo_Path'), async (req, resp) => {
    var Emp_Id = req.params.id;
    
    var query = "UPDATE manpower_basic_detail SET Emp_Photo_Path = ? WHERE Emp_Id = ?";
    var Emp_Photo_Path = req.file?.path || ''; 
    Emp_Photo_Path = '/' + Emp_Photo_Path.replace(/\\/g, '/'); 
    console.log(Emp_Photo_Path);
    try {
        let result = await mysql.exec(query, [Emp_Photo_Path, Emp_Id]);
        if (result.affectedRows == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json({ success: true, message: "Profile picture updated successfully", profile_url: Emp_Photo_Path });
    } catch (err) {
        return resp.status(406).json(err);
    }
});

router.put('/profile/:id', async (req, resp) => {
    var Emp_Id = req.params.id;
    var query = "UPDATE manpower_basic_detail SET ? WHERE Emp_Id = ?";
    var values = req.body;

    try {
        let result = await mysql.exec(query, [values, Emp_Id]);
        if (result.affectedRows == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        return resp.status(406).json(err);
    }
});

// * ---------------------------------profile page---------------------------------- * //

module.exports = router;