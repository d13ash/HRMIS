const express = require('express');
const router = express.Router();
const axios = require('axios');
const mysql = require('../mysql');

// GET /attendance
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://192.168.3.19:3000/api/attendance');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance from network API' });
  }
});

router.get('/:Emp_Id', async (req, res) => {
  var query = "SELECT Attendance_Id FROM attendance WHERE Emp_Id = ?";
  try {
    let data = await mysql.exec(query, [req.params.Emp_Id]);
    console.log(data);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Attendance not found for this employee' });
    }

    // Make the network request
    const response = await axios.get('http://192.168.3.19:3000/api/emp-profile/profile/' + data[0].Attendance_Id);
    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
});

module.exports = router;
