const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');
const multer = require ('multer');
const path = require('path');
const fs = require('fs');

router.get('/LeaveRequestEMP', async (req, res) => {
    var query = 'SELECT leave_id,leave_from,leave_to,status FROM leave_request_main';
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});

router.get('/LeaveRequestAdmin', async (req, res) => {
    var query = 'SELECT l.leave_id,m.Emp_Id,m.Emp_First_Name_E,m.Emp_Middle_Name_E,m.Emp_Last_Name_E,lt.leave_type,lr.leave_reason,l.days_required,l.leave_from,l.leave_to,l.status,l.purpose_of_leave,l.supporting_document FROM leave_request_main l LEFT JOIN manpower_basic_detail m ON l.Emp_Id=m.Emp_Id LEFT JOIN m_leave_reason lr ON l.leave_reason_id=lr.leave_reason_id LEFT JOIN m_leave_type lt ON lr.leave_type_id=lt.leave_type_id order by l.leave_id desc';
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});

router.get('/typesofleave', async (req, res) => {
    const query = 'SELECT * FROM m_leave_type';
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});

router.get('/reasons/:leaveTypeId', async (req, res) => {
    const { leaveTypeId } = req.params;
    const query = 'SELECT * FROM m_leave_reason WHERE leave_type_id = ?';

    try {
        const result = await mysql.exec(query, [leaveTypeId]);
        if (result.length === 0) {
            return res.status(404).send("No leave reasons found.");
        }
        return res.json(result);
    } catch (error) {
        console.error("Error fetching leave reasons:", error);
        res.status(500).send("Internal server error");
    }
});


// File Upload Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/leaves';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only pdf, doc, docx files
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF and Word documents are allowed!');
        }
    }
});

// Expose the uploads directory for leaves
router.use('/api/images', express.static('uploads/leaves'));

// File upload endpoint
router.post('/uploadfile', upload.single('supporting_document'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  const profile_url = `/api/images/${req.file.filename}`;
  res.send({ profile_url });
});

router.post('/application', upload.single('supporting_document'), async (req, res) => {
  try {
    const {
      Emp_Id,
      leave_reason_id,
      leave_from,
      leave_to,
      days_required,
      purpose_of_leave,
    } = req.body;

    const supporting_document = req.file ? req.file.filename : null;

    if (!Emp_Id || !leave_reason_id || !leave_from || !leave_to || !days_required) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const insertQuery = `
      INSERT INTO leave_request_main (
        Emp_Id,
        leave_reason_id,
        leave_from,
        leave_to,
        days_required,
        purpose_of_leave,
        supporting_document,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
      Emp_Id,
      leave_reason_id,
      leave_from,
      leave_to,
      days_required,
      purpose_of_leave,
      supporting_document
    ];

    await mysql.exec(insertQuery, values);

    res.status(201).json({ message: 'Leave request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.get('/LeaveDocument/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads/leaves/', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// GET leave status by Emp_Id (Employee view)
router.get('/LeaveRequestStatus/:empId', async (req, res) => {
    const empId = req.params.empId;

    const query = `
        SELECT l.leave_id, lt.leave_type, lr.leave_reason, l.leave_from, l.leave_to, l.days_required, l.status
        FROM leave_request_main l
        LEFT JOIN m_leave_reason lr ON l.leave_reason_id = lr.leave_reason_id
        LEFT JOIN m_leave_type lt ON lr.leave_type_id = lt.leave_type_id
        WHERE l.Emp_Id = ?
        ORDER BY l.leave_from DESC
    `;

    const result = await mysql.exec(query, [empId]);

    if (result.length === 0)
        return res.status(404).send("No leave requests found for this employee.");

    res.json(result);
});

// Update leave request
router.put('/update/:leaveId', upload.single('supporting_document'), async (req, res) => {
  try {
    const { leaveId } = req.params;
    const {
      leave_reason_id,
      leave_from,
      leave_to,
      days_required,
      purpose_of_leave,
    } = req.body;

    const supporting_document = req.file ? req.file.filename : null;

    const updateQuery = `
      UPDATE leave_request_main 
      SET leave_reason_id = ?,
          leave_from = ?,
          leave_to = ?,
          days_required = ?,
          purpose_of_leave = ?,
          supporting_document = COALESCE(?, supporting_document)
      WHERE leave_id = ?
    `;

    const values = [
      leave_reason_id,
      leave_from,
      leave_to,
      days_required,
      purpose_of_leave,
      supporting_document,
      leaveId
    ];

    await mysql.exec(updateQuery, values);
    res.json({ message: 'Leave request updated successfully.' });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// Delete leave request
router.delete('/delete/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    
    // First get the supporting document filename if any
    const getDocQuery = 'SELECT supporting_document FROM leave_request_main WHERE leave_id = ?';
    const [leaveRequest] = await mysql.exec(getDocQuery, [leaveId]);
    
    // Delete the leave request
    const deleteQuery = 'DELETE FROM leave_request_main WHERE leave_id = ?';
    await mysql.exec(deleteQuery, [leaveId]);
    
    // Delete the supporting document if it exists
    if (leaveRequest && leaveRequest.supporting_document) {
      const filePath = path.join(__dirname, '../uploads/leaves', leaveRequest.supporting_document);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.json({ message: 'Leave request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// Approve leave request
router.put('/approve/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    const updateQuery = 'UPDATE leave_request_main SET status = "approved" WHERE leave_id = ?';
    await mysql.exec(updateQuery, [leaveId]);
    res.json({ message: 'Leave request approved successfully.' });
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// Reject leave request
router.put('/reject/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    const updateQuery = 'UPDATE leave_request_main SET status = "rejected" WHERE leave_id = ?';
    await mysql.exec(updateQuery, [leaveId]);
    res.json({ message: 'Leave request rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router; 