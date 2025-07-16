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

// * ---------------------------------project page---------------------------------- * //

router.get('/deptProjects/:id', async (req, resp) => {
    var query = `SELECT DISTINCT mp.Project_ID, mp.Project_name
        FROM m_project mp
        LEFT JOIN map_project_dept mpd ON mp.Project_ID = mpd.Project_ID
        WHERE mpd.Parent_Dept_ID = ?`;
    var Parent_Dept_ID = req.params.id;
    try {
        let result = await mysql.exec(query, [Parent_Dept_ID]);
        if (result.length == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json(result);
    } catch (err) {
        return resp.status(406).json(err);
    }
});

router.get('/projectModules/:id', async (req, resp) => {
    const projectId = req.params.id;

    const query = `
        SELECT mpm.project_module_id, mm.module_name
        FROM map_project_module mpm
        JOIN project_module mm ON mpm.project_module_id = mm.project_module_id
        WHERE mpm.Project_ID = ? AND (mpm.Delete_YN IS NULL OR mpm.Delete_YN != 'Y')
    `;

    try {
        const result = await mysql.exec(query, [projectId]);
        if (result.length === 0) {
            return resp.status(404).send("No modules found for the specified project.");
        }
        return resp.json(result);
    } catch (err) {
        console.error("Error fetching modules:", err);
        return resp.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/projectPosts/:projectId', async (req, resp) => {
    const projectId = req.params.projectId;

    const query = `
        SELECT 
            ppa.Post_ID,
            mp.Post_name,
            ppa.Description,
            ppa.Duration_in_days,
            ppa.Manpower_no
        FROM project_post_allotment ppa
        JOIN m_post mp ON ppa.Post_ID = mp.Post_id
        WHERE ppa.Project_ID = ? 
          AND (ppa.Delete_YN IS NULL OR ppa.Delete_YN != 'Y')
          AND (mp.Delete_YN IS NULL OR mp.Delete_YN != 'Y')
    `;

    try {
        const result = await mysql.exec(query, [projectId]);
        if (result.length === 0) {
            return resp.status(404).send("No posts found for this project.");
        }
        return resp.json(result);
    } catch (err) {
        console.error("Error fetching project posts:", err);
        return resp.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/projectEmployees/:projectId', async (req, resp) => {
    const projectId = req.params.projectId;

    const query = `
        SELECT 
            CONCAT_WS(' ',
                COALESCE(mbd.Emp_First_Name_E, ''),
                COALESCE(mbd.Emp_Middle_Name_E, ''),
                COALESCE(mbd.Emp_Last_Name_E, '')
            ) AS Employee_Name,
            mp.Post_name AS Post_Name,
            CONCAT('${req.protocol}://${req.get('host')}/api', mbd.Emp_Photo_Path) AS Emp_Photo_Path
        FROM finance_post_main fpm
        JOIN yearly_post_detail ypd ON fpm.finance_post_main_id = ypd.finance_post_main_id
        JOIN map_post_emp mpe ON ypd.yearly_post_detail_id = mpe.yearly_post_detail_id
        JOIN manpower_basic_detail mbd ON mpe.Emp_Id = mbd.Emp_Id
        JOIN m_post mp ON ypd.Post_id = mp.Post_id
        WHERE fpm.Project_ID = ?
          AND (fpm.Delete_YN IS NULL OR fpm.Delete_YN != 'Y')
          AND (ypd.Delete_YN IS NULL OR ypd.Delete_YN != 'Y')
          AND (mpe.Delete_YN IS NULL OR mpe.Delete_YN != 'Y')
    `;

    try {
        const result = await mysql.exec(query, [projectId]);
        if (result.length === 0) {
            return resp.status(404).send("No employees found for this project.");
        }
        return resp.json(result);
    } catch (err) {
        console.error("Error fetching project employees:", err);
        return resp.status(500).json({ error: "Internal Server Error" });
    }
});


// * --------------------------------project page---------------------------------- * //

module.exports = router;