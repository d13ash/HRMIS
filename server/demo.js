const mysql = require('../server/mysql')

(async () => {
  try {
    let searchTerm = 'work';
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
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();