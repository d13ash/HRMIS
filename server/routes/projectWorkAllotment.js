const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const path = require('path');

router.get('/allProjectWorkAllotment', async (req, res) => {
    var query = "SELECT * FROM project_work_allotment";
    let result = await mysql.exec(query);

    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});

// for table Admin section
router.get('/allProjectWorkdata', async (req, res) => {
    var query = "SELECT a.Project_work_allotment_id,f.Financial_id,f.Financial_name,p.Project_ID,p.Project_name,md.project_module_id,md.module_name,a.Allotment_date,a.Start_date,a.Allotment_by,a.End_date,a.Description, e.Emp_Id,e.Emp_First_Name_E FROM project_work_allotment a  LEFT JOIN project_module md ON md.project_module_id = a.project_module_id  LEFT JOIN  m_project p ON p.Project_ID = a.Project_ID LEFT JOIN m_financial f ON f.Financial_id=a.Financial_id left JOIN manpower_basic_detail e ON e.Emp_Id = a.Emp_Id  WHERE a.Delete_YN IS NULL";
    console.log("called");
    let result = await mysql.exec(query);

    if (result.length == 0)
        return res.status(404).send("Data Not Found");

    return res.json(result);
});






router.get('/getAllotedWork/:id', async (req, res) => {
    const id = req.params.id;
    var query = "SELECT DISTINCT * FROM alloted_project_work WHERE Project_work_allotment_id = ?";
    try {
        let result = await mysql.exec(query, [id])
        if (result.length == 0) {
            return res.status(405).send("Data not found");
        }
        return res.json(result);
    }
    catch (err) {
        return res.status(406).json(err);
    }
});

// for preview table
router.get('/view/:id1', async (req, resp) => {
    var query = "SELECT DISTINCT p.Project_name,pm.module_name,apw.is_Work_complete,apw.alloted_project_work_id,apw.is_Work_complete,apw.approval,pwm.Work_name,mbd.Emp_Id,pwa.Start_date,pwa.End_date, mbd.Emp_First_Name_E,pwm.Description FROM project_work_allotment pwa LEFT JOIN alloted_project_work apw ON apw.Project_work_allotment_id = pwa.Project_work_allotment_id LEFT JOIN project_work_main pwm ON pwm.project_work_main_id = apw.Project_work_main_id LEFT JOIN manpower_basic_detail mbd ON mbd.Emp_Id = pwa.Emp_Id LEFT JOIN m_project p ON p.Project_ID=pwa.Project_ID LEFT JOIN project_module pm ON  pm.project_module_id = pwa.project_module_id WHERE mbd.Emp_Id = ?";
    var id1 = req.params.id1;
    try {
        let result = await mysql.exec(query, [id1])
        if (result.length == 0) {
            return resp.status(405).send("Data not found");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
})

// get data in dropdown
router.get('/getProjectWork', async (req, res) => {
    var query = " SELECT Project_work_main_id,Work_name FROM  project_work_main";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// get employee dropdown
router.get('/allemp/:Financial_id', async (req, resp) => {
    var query = "SELECT me.Map_post_emp_id,me.Financial_id,f.Financial_name,m.Emp_First_Name_E,me.Emp_Id FROM map_post_emp me  LEFT JOIN m_financial f ON f.Financial_id=me.Financial_id LEFT JOIN manpower_basic_detail m ON m.Emp_Id=me.Emp_Id WHERE me.Financial_id = ?";
    var Financial_id = req.params.Financial_id;
    try {
        let result = await mysql.exec(query, [Financial_id])
        if (result.length == 0) {
            return resp.status(405).send("State");
        }
        return resp.json(result);
    }
    catch (err) {
        return resp.status(406).json(err);
    }
})

// count work for progress
router.get('/getWorkCount', async (req, res) => {
    var query = "SELECT p.Project_ID,p.Project_name, COUNT(pwm.Project_ID) AS totalWork FROM m_project p inner JOIN  project_work_main pwm ON pwm.Project_ID = p.Project_ID GROUP BY Project_ID;";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

// count Approval for progress
router.get('/getApprove', async (req, res) => {
    var query = "SELECT p.Project_name,m.module_name,COUNT(apw.Project_work_allotment_id) AS TotalWor FROM project_work_allotment a INNER JOIN m_project p ON p.Project_ID = a.Project_ID INNER JOIN project_module m ON m.project_module_id = a.project_module_id INNER JOIN alloted_project_work apw ON  apw.Project_work_allotment_id = a.Project_work_allotment_id WHERE apw.approval = 'Approved' GROUP BY Project_name";
    console.log("called");
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("Data Not Found");
    return res.json(result);
});

//  Update work Detail
router.put('/updateProjectWorkAllotment/:id', async (req, resp) => {
    var query = "UPDATE project_work_allotment SET ? WHERE Project_work_allotment_id = ? ";
    var value = req.body;
    var Project_work_allotment_id = req.params.id;
    try {
        let result = await mysql.exec(query, [value, Project_work_allotment_id])
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({ status: "success" })
    }
    catch (err) {
        if (err) {
            return resp.status(404).send('error..');
        }
    }
})

//  Update work in employee section
router.put('/updateAllotedWork/:id', async (req, resp) => {
    var query = "UPDATE alloted_project_work SET ? WHERE alloted_project_work_id = ? ";
    var value = req.body;
    console.log(value);
    var alloted_project_work_id = req.params.id;
    try {
        let result = await mysql.exec(query, [value, alloted_project_work_id])
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({ status: "success" })
    }
    catch (err) {
        if (err) {
            return resp.status(404).send('error..');
        }
    }
})

// update new
// router.put("/updateAllotedWork/:id", (req, res) => {

//   const data = [req.body.is_Work_complete, req.params.id];
//   db.query("UPDATE alloted_project_work SET  is_Work_complete = ?  WHERE alloted_project_work_id = ?", data, (error, result, fields) => {
//     if (error) error;
//    return res.send(result);
//   })
// });


// Delete departmetnt detail
router.delete('/deletedataByid/:id', async (req, res) => {
    var query = "update project_work_allotment SET Delete_YN ='Y' where Project_work_allotment_id = ?"
    var Project_work_allotment_id = req.params.id;
    try {
        let result = await mysql.exec(query, Project_work_allotment_id)
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


// ====================================================================

// post data in project work allotment
//   router.post('/PostProjectWorkAllotment', async (req, res) => {
//     var values = req.body;
//     var query = "INSERT INTO project_work_allotment SET ? ";
//     try {
//         let data = await mysql.exec(query, values);
//         res.json({
//             id: data.insertId
//         });
//     } catch (err) {
//         return res.status(404).json(err);
//     }
// });

// post data in project detail
router.post('/postWorkAllotment', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO alloted_project_work SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});

router.post('/PostProjectWorkAllotment', async (req, resp) => {

    let Project_ID = req.body.Project_ID
    let project_module_id = req.body.project_module_id
    let Financial_id = req.body.Financial_id
    let Emp_Id = req.body.Emp_Id
    let Allotment_date = req.body.Allotment_date
    let Start_date = req.body.Start_date
    let End_date = req.body.End_date
    let Description = req.body.Description

    let query = `insert into project_work_allotment(Project_ID,project_module_id,Financial_id,Emp_Id,Allotment_date,Start_date,End_date,Description) values('${Project_ID}','${project_module_id}','${Financial_id}','${Emp_Id}','${Allotment_date}','${Start_date}','${End_date}','${Description}')`;
    try {
        let result = await mysql.exec(query)
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error developer0404');
        }
        return resp.json({ id: result.insertId })
    }
    catch (err) {
        if (err) {

            return resp.status(404).send(err);
        }
    }
})

router.get('/designation/:empId', async (req, res) => {
    const empId = req.params.empId;
    const query = `
        SELECT p.Post_name
        FROM manpower_basic_detail mbd
        JOIN m_post p ON mbd.Post_id = p.Post_id
        WHERE mbd.Emp_Id = ?
    `;
    try {
        const result = await mysql.exec(query, [empId]);
        if (result.length === 0) return res.status(404).send('Not found');
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
});

module.exports = router;