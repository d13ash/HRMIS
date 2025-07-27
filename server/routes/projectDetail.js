const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const path = require('path');



const auth = require('../middleware/auth');
const { has } = require('config');


// post data in project detail
router.post('/hello', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
    var values = req.body;
    var query = "INSERT INTO m_project SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});



router.get('/allProject', async (req, res) => {

    try {
        const searchTerm = req.query.search;
        let query = `
      SELECT 
        p.Project_ID, p.Project_name, p.Project_Short_name,
        t.Project_Type_ID, p.Project_Discription, t.Project_Type_Name 
      FROM m_project p 
      LEFT JOIN m_project_type t ON t.Project_Type_ID = p.Project_Type_ID
    `;

        let params = [];

        if (searchTerm && searchTerm.trim() !== '') {
            query += ` WHERE p.Project_name LIKE ?`;
            params.push(`%${searchTerm}%`);
        }

        let result = await mysql.exec(query, params);
        if (result.length == 0)
            return res.status(404).send("Data Not Found");
        return res.json(result);
    } catch (err) {
        return res.status(404).send(err);
    }
});


// get only two fields
router.get('/allProjectmap', async (req, res) => {
    var query = " SELECT Project_ID,Project_name FROM  m_project";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});


router.get('/allProject/:id', async (req, resp) => {
    var query = `SELECT 
        p.Project_ID, p.Project_name, p.Project_Short_name,
        t.Project_Type_ID, p.Project_Discription, t.Project_Type_Name 
        FROM m_project p 
        LEFT JOIN m_project_type t ON t.Project_Type_ID = p.Project_Type_ID WHERE p.Project_ID = ?`;
    var id = req.params.id;

    try {
        let result = await mysql.exec(query, [id])
        if (result.length == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
})



// Update Department Detail
router.put('/updateProjectDetail/:id', async (req, resp) => {

    // const {error} = validateCourse(req.body)
    // if (error){
    //    return resp.status(404).send(error.details[0].message) 
    // }
    var query = "UPDATE m_project SET ? WHERE Project_ID = ? ";
    var value = req.body;
    var Project_ID = req.params.id;

    try {

        let result = await mysql.exec(query, [value, Project_ID])
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({ status: "success" })
    }
    catch (err) {
        if (err) {
            return resp.status(404).send('error');
        }
    }
})


// Delete departmetnt detail
router.delete('/deletedataByid/:id', async (req, res) => {
    var query = "DELETE FROM m_project WHERE Project_ID = ?";
    var Project_ID = req.params.id;
    try {
        let result = await mysql.exec(query, Project_ID)
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return res.status(404).send('error...');
        }
        return res.json({ status: "data deleted" })
    }

    catch (err) {
        if (err) {
            return res.status(404).send('error');
        }
    }
})




function validateprojectDetail(projectDetail) {
    const schema = Joi.object({
        Student_First_Name: Joi.string().min(3).required(),
        Student_Middle_Name: Joi.string().min(3).required(),
        Student_Last_Name: Joi.string().min(3).required(),
        Student_Father_Name: Joi.string().min(3).required(),
        Student_Mother_Name: Joi.string().min(3).required(),
        // gender: Joi.string().min(3).required(),
        category: Joi.string().min(3).required(),
        // dob: Joi.date().required(),
        Mobile_no: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        Email_id: Joi.string().min(3).required().email(),
        Address: Joi.string().required(),
        State: Joi.required(),
        District: Joi.required(),
        Block: Joi.required(),
    }).unknown(true);
    return schema.validate(projectDetail);
}

router.get('/employeeProjects/:empId', async (req, resp) => {
    const empId = req.params.empId;

    const query = `
        SELECT DISTINCT
            mp.Project_ID,
            mp.Project_name,
            mf.Financial_name,
            mpt.Project_Type_Name
        FROM m_project mp
        LEFT JOIN m_project_type mpt ON mp.Project_Type_ID = mpt.Project_Type_ID
        LEFT JOIN project_work_allotment pwa ON mp.Project_ID = pwa.Project_ID AND pwa.Emp_Id = ?
        LEFT JOIN m_financial mf ON pwa.Financial_id = mf.Financial_id
        WHERE pwa.Emp_Id IS NOT NULL 
          AND (pwa.Delete_YN IS NULL OR pwa.Delete_YN != 'Y')
        ORDER BY mp.Project_name
    `;

    try {
        const result = await mysql.exec(query, [empId]);
        if (result.length === 0) {
            return resp.status(404).send("No projects found for this employee.");
        }
        return resp.json(result);
    } catch (err) {
        console.error("Error fetching employee projects:", err);
        return resp.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;