const express = require("express"); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require("joi"); //joi module return a Class and By covention class name start with capital letter
var mysql = require("../mysql");
require("express-async-errors");
const path = require("path");
const { error } = require("console");

router.get("/getfinancialyear", async (req, res) => {
  var query = "SELECT * FROM m_financial";

  try {
    let result = await mysql.exec(query);
    if (result.length == 0) {
      return res.status(404).send("year not found");
    }
    return res.json(result);
  } catch (err) {
    return res.status(404).json(err);
  }
});
router.get("/getbudget_head_name", async (req, res) => {
  var query =
    "SELECT budget_head_name,budget_head_id FROM finance_budget_master";

  try {
    let result = await mysql.exec(query);
    if (result.length == 0) {
      return res.status(404).send("year not found");
    }
    return res.json(result);
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.get("/getalldata", async (req, res) => {
  var query = "SELECT * FROM finance_budget_allotment";

  try {
    let result = await mysql.exec(query);
    if (result.length == 0) {
      return res.status(404).send("data not found");
    }
    return res.json(result);
  } catch (err) {
    return res.status(404).json(err);
  }
});

router.post("/Postfinance_budget_allotment", async (req, res) => {
  var values = req.body;
  var query = "INSERT INTO finance_budget_allotment SET ? ";
  try {
    let data = await mysql.exec(query, values);
    res.json({
      id: data.insertId,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
});

// for table
router.get("/mattable", async (req, res) => {
  var query = `SELECT 
    fba.budget_allotment_id, 
    fba.amount, 
    mf.Financial_id, 
    fba.budget_head_id, 
    mf.Financial_name, 
    fbm.budget_head_name 
FROM 
    finance_budget_allotment fba 
LEFT JOIN 
    m_financial mf 
ON  
    fba.Financial_id = mf.Financial_id 
LEFT JOIN 
    finance_budget_master fbm 
ON 
    fbm.budget_head_id = fba.budget_head_id 
WHERE 
    fba.Delete_YN IS NULL OR fba.Delete_YN = 'N';
`;
  console.log("called");
  let result = await mysql.exec(query);
  return res.json(result);
});

router.put("/update/:id", async (req, resp) => {
  var query =
    "UPDATE finance_budget_allotment SET ? WHERE budget_allotment_id = ? ";
  var value = req.body;
  var resource_assignment_main_ID = req.params.id;

  try {
    let result = await mysql.exec(query, [value, resource_assignment_main_ID]);
    if (result.affectedRows < 1) {
      //affectRows denote any changes is done through any operation (put,post)
      return resp.status(404).send("error....");
    }
    return resp.json({ status: "success" });
  } catch (err) {
    if (err) {
      return resp.status(404).send(err);
    }
  }
});
router.delete("/delete/:id", async (req, resp) => {
  var query =
    "UPDATE finance_budget_allotment p set p.Delete_YN='Y' WHERE p.budget_allotment_id= ?";
  var id = req.params.id;

  try {
    let result = await mysql.exec(query, id);
    if (result.affectedRows < 1) {
      //affectRows denote any changes is done through any operation (put,post)
      return resp.status(404).send("error");
    }
    return resp.json({ status: "data deleted" });
  } catch (err) {
    if (err) {
      return resp.status(404).send("error");
    }
  }
});

module.exports = router;
