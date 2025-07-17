const express = require('express');
const router = express.Router();
const mysql = require('../mysql');

// 🎈 Get employees whose birthday is in exactly 2 days
router.get('/birthday-soon', async (req, res) => {
  const sql = `
    SELECT 
      Emp_Id AS id,
      CONCAT(Emp_First_Name_E, ' ', Emp_Last_Name_E) AS name,
      DOB AS birthday
    FROM manpower_basic_detail
    WHERE DATE_FORMAT(
      DATE_ADD(DOB,
        INTERVAL (
          YEAR(CURDATE()) - YEAR(DOB)
          + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(DOB), 1, 0)
        ) YEAR
      ), '%Y-%m-%d'
    ) IN (
      DATE_FORMAT(CURDATE(), '%Y-%m-%d'),
      DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%Y-%m-%d'),
      DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '%Y-%m-%d')
    )
  `;
  
  try {
    let result = await mysql.exec(sql);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch upcoming birthdays' });
  }
});


// 🎉 Get all upcoming birthdays
router.get('/all-birthdays', async (req, res) => {
  const sql = `
    SELECT 
      Emp_Id AS id,
      CONCAT(Emp_First_Name_E, ' ', Emp_Last_Name_E) AS name,
      DOB AS birthday,
      DATE_ADD(DOB,
        INTERVAL (
          YEAR(CURDATE()) - YEAR(DOB)
          + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(DOB), 1, 0)
        ) YEAR
      ) AS upcoming_birthday
    FROM manpower_basic_detail
    WHERE DATE_ADD(DOB,
      INTERVAL (
        YEAR(CURDATE()) - YEAR(DOB)
        + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(DOB), 1, 0)
      ) YEAR
    ) >= CURDATE()
    ORDER BY upcoming_birthday ASC
  `;

  try {
          let result = await mysql.exec(sql);
          if (result.length == 0) {
              return res.status(404).send("data not found");
          }
          return res.json(result);         
      } 
      catch (err) {
  
          return res.status(500).json({ error: 'Failed to fetch upcoming birthdays' });
      }
});

module.exports = router;
