const express = require("express"); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require("joi"); //joi module return a Class and By covention class name start with capital letter
var mysql = require("../mysql");
require("express-async-errors");

router.get("/allpostdetails", async (req, res) => {
  var query =
    "SELECT p.Post_id,p.Post_name,p.Post_short_name,p.Post_name_hindi,p.Post_leval,mp.Post_type_name FROM m_post p RIGHT JOIN m_post_type mp ON p.Post_Type_ID = mp.Post_Type_ID";
  let result = await mysql.exec(query);

  if (result.length == 0) return res.status(404).send("Data Not Found");

  return res.json(result);
});

router.get("/postType", async (req, res) => {
  var query = "SELECT * FROM m_post_type";
  let result = await mysql.exec(query);
  if (result.length == 0) return res.status(404).send("Post Not Found");

  return res.json(result);
});

router.put("/updatePost/:id", async (req, res) => {
  const postId = req.params.id;

  const {
    Post_name,
    Post_short_name,
    Post_name_hindi,
    Post_leval,
    Post_Type_ID,
    Display_order,
    Is_hod, // optional
  } = req.body;

  // Validate required fields (except Is_hod)
  if (
    !Post_name ||
    !Post_short_name ||
    !Post_name_hindi ||
    !Post_leval ||
    !Post_Type_ID ||
    !Display_order
  ) {
    return res.status(400).json({
      error: "Missing required fields",
      missing: {
        Post_name: !Post_name,
        Post_short_name: !Post_short_name,
        Post_name_hindi: !Post_name_hindi,
        Post_leval: !Post_leval,
        Post_Type_ID: !Post_Type_ID,
        Display_order: !Display_order,
      },
    });
  }

  try {
    const updateQuery = `
      UPDATE m_post
      SET 
        Post_name = ?,
        Post_short_name = ?,
        Post_name_hindi = ?,
        Post_leval = ?,
        Post_Type_ID = ?,
        Display_order = ?,
        Is_hod = ?
      WHERE Post_ID = ?
    `;

    const normalizedIsHod =
      Is_hod === "" || Is_hod === undefined ? null : Is_hod;

    const result = await mysql.exec(updateQuery, [
      Post_name,
      Post_short_name,
      Post_name_hindi,
      Post_leval,
      Post_Type_ID,
      Display_order,
      normalizedIsHod,
      postId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Post not found");
    }

    // Fetch updated record with joined Post Type Name
    const fetchQuery = `
      SELECT mp.*, mpt.Post_type_name 
FROM m_post mp 
LEFT JOIN m_post_type mpt ON mp.Post_Type_ID = mpt.Post_Type_ID 
WHERE mp.Post_ID = ?

    `;

    const [updatedPost] = await mysql.exec(fetchQuery, [postId]);

    res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send("Server error");
  }
});

router.delete("/deletePostByid/:id", async (req, res) => {
  var query = "DELETE FROM m_post WHERE Post_id = ?";
  var Post_id = req.params.id;
  try {
    let result = await mysql.exec(query, Post_id);
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

router.post("/submitPost", async (req, res) => {
  console.log("Received Body:", req.body);

  const {
    Post_name,
    Post_short_name,
    Post_name_hindi,
    Post_leval,
    Post_Type_ID,
    Display_order,
    Is_hod, // accept Is_hod from frontend, can be null/empty
  } = req.body;

  // Validation - only require essential fields, allow Is_hod to be optional/null
  if (
    !Post_name ||
    !Post_short_name ||
    !Post_name_hindi ||
    !Post_leval ||
    !Post_Type_ID ||
    !Display_order
  ) {
    return res.status(400).send("All fields except Is_hod are required");
  }

  try {
    const insertQuery = `
      INSERT INTO m_post 
      (Post_name, Post_short_name, Post_name_hindi, Post_leval, Post_Type_ID, Display_order, Is_hod)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Normalize Is_hod to null if empty string or undefined
    const normalizedIsHod =
      Is_hod === "" || Is_hod === undefined ? null : Is_hod;

    const result = await mysql.exec(insertQuery, [
      Post_name,
      Post_short_name,
      Post_name_hindi,
      Post_leval,
      Post_Type_ID,
      Display_order,
      normalizedIsHod,
    ]);

    res.status(201).json({
      message: "Post added successfully",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).send("Server error");
  }
});

// function validatePostdata(post) {
//     const schema = Joi.object({
//         Post_name: Joi.string().min(3).required(),
//         Post_name_hindi: Joi.string().min(3).required(),
//         Post_short_name: Joi.string().min(1).required(),
//         Post_type: Joi.required(),
//         Post_leval: Joi.required(),
//         Display_order: Joi.required(),
//         Is_hod: Joi.required(),

//     }).unknown(true);
//     return schema.validate(post);

// }
module.exports = router;
