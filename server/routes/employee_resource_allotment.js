const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

//get the item(resource)name from table resource_stock_item_master in dropdown.....
router.get('/get_resource_name', async (req, res) => {

    var query = "SELECT item_id,item_name FROM resource_stock_item_master";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("year not found");
        }
        return res.json(result);
    }
    catch (err) {

        return res.status(404).json(err);
    }
});
//get the Employee_name from table manpower_basic_detail in dropdown......
router.get('/get_employee_name', async (req, res) => {

    var query = "SELECT Emp_Id,  CASE WHEN Emp_First_Name_E IS NOT NULL THEN CONCAT( Emp_First_Name_E,IF(Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', Emp_Middle_Name_E), ''),IF(Emp_Last_Name_E IS NOT NULL, CONCAT(' ',Emp_Last_Name_E), '')) ELSE '' END AS Emp_name FROM manpower_basic_detail";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("year not found");
        }
        return res.json(result);
    }
    catch (err) {

        return res.status(404).json(err);
    }
});
//get the project name from table m_project in dropdown.....
router.get('/get_project_name', async (req, res) => {

    var query = "SELECT Project_name,Project_ID  FROM m_project";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("year not found");
        }
        return res.json(result);
    }
    catch (err) {

        return res.status(404).json(err);
    }
});


//for getting all the data of table employee_resource_allotment
router.get('/getalldata', async (req, res) => {

    var query = "SELECT * FROM employee_resource_allotment";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("data not found");
        }
        return res.json(result);
    }
    catch (err) {

        return res.status(404).json(err);
    }
});
//for post all the value in table finance_budget_master
router.post('/post_resource_allotment', async (req, res) => {
    var values = req.body;
    var query = "INSERT INTO employee_resource_allotment SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});
// for table
router.get('/mattable', async (req, res) => {
    var query = "SELECT era.allotment_id,era.allotment_date,era.allotment_date_end,era.Project_ID,mp.Project_name,era.item_id,rsim.item_name,era.Emp_Id,  CASE WHEN Emp_First_Name_E IS NOT NULL THEN CONCAT( Emp_First_Name_E,IF(Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', Emp_Middle_Name_E), ''),IF(Emp_Last_Name_E IS NOT NULL, CONCAT(' ',Emp_Last_Name_E), '')) ELSE '' END AS Emp_name from  employee_resource_allotment era LEFT JOIN m_project mp ON era.Project_ID=mp.Project_ID LEFT JOIN resource_stock_item_master rsim ON era.item_id=rsim.item_id LEFT JOIN manpower_basic_detail mbd ON era.Emp_Id=mbd.Emp_Id WHERE era.Delete_YN='N'";
    console.log("called");
    let result = await mysql.exec(query);
    return res.json(result);
});
router.put('/update/:id', async (req, resp) => {
    var query = "UPDATE employee_resource_allotment SET ? WHERE allotment_id = ?";
    var value = req.body;
    let allotment_id = req.params.id;
    try {
      let result = await mysql.exec(query, [value, allotment_id]);
      if (result.affectedRows < 1) {
        return resp.status(404).send('error....');
      }
      resp.json({
        id: parseInt(allotment_id) // Parse the result.Emp_Id as an integer
      });
    } catch (err) {
      if (err) {
        return resp.status(404).send('error..');
      }
    }
  });

// router.put('/update/:id', async (req, resp) => {
//     var query = "UPDATE employee_resource_allotment SET ? WHERE allotment_id = ? ";
//     var value = req.body;
//     var resource_assignment_main_ID = req.params.id;

//     try {

//         let result = await mysql.exec(query, [value, resource_assignment_main_ID])
//         if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
//             return resp.status(404).send('error....');
//         }
//         return resp.json({ status: "success" })
//     }
//     catch (err) {
//         if (err) {
//             return resp.status(404).send(err);
//         }
//     }
// })
router.delete('/delete/:id', async (req, resp) => {

    var query = "UPDATE employee_resource_allotment p set p.Delete_YN='Y' WHERE p.allotment_id= ?";
    var id = req.params.id;

    try {
        let result = await mysql.exec(query, id)
        if (result.affectedRows < 1) { //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error');
        }
        return resp.json({ status: "data deleted" })
    }

    catch (err) {
        if (err) {
            return resp.status(404).send('error');
        }
    }
})

router.get('/alluser/:id', async (req, resp) => {
    const query = `
    SELECT
    era.allotment_id,
    era.allotment_date,
    era.allotment_date_end,
    era.Project_ID,
    mp.Project_name,
    era.item_id,
    rsim.item_name,
    era.Emp_Id,
    CASE
        WHEN Emp_First_Name_E IS NOT NULL THEN CONCAT( Emp_First_Name_E, IF(Emp_Middle_Name_E IS NOT NULL, CONCAT(' ', Emp_Middle_Name_E), ''), IF(Emp_Last_Name_E IS NOT NULL, CONCAT(' ',Emp_Last_Name_E), ''))
        ELSE ''
    END AS Emp_name,
    CASE
        WHEN era.allotment_date_end < CURDATE() THEN CONCAT('Overdue ', DATEDIFF(CURDATE(), era.allotment_date_end), ' Days')
        ELSE ''
    END AS overdue_days
FROM
    employee_resource_allotment era
LEFT JOIN m_project mp ON era.Project_ID = mp.Project_ID
LEFT JOIN resource_stock_item_master rsim ON era.item_id = rsim.item_id
LEFT JOIN manpower_basic_detail mbd ON era.Emp_Id = mbd.Emp_Id
WHERE
    era.Delete_YN = 'N'
    AND era.Emp_Id = ?`;
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

module.exports = router;