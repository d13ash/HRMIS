const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');
require('express-async-errors');

router.get('/getmapData', async (req, res) => {
    
    var query = 'SELECT mpd.ID, mp.Project_Name, mp.Project_ID, pd.Dept_ID AS Parent_Dept_ID, pd.Dept_Name AS Parent_Dept_Name, ad.Dept_ID AS Associate_Dept_ID, ad.Dept_Name AS Associate_Dept_Name, mpd.Description FROM map_project_dept mpd LEFT JOIN m_project mp ON mpd.Project_ID = mp.Project_ID LEFT JOIN m_department pd ON mpd.Parent_Dept_ID = pd.Dept_ID LEFT JOIN m_department ad ON mpd.Associate_Dept_ID = ad.Dept_ID;';

    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("data Not Found");
    return res.json(result);
});
 
router.get('/', async (req, res) => {
    var query = "SELECT * FROM map_project_dept";
    let result = await mysql.exec(query);
    if (result.length == 0)
        return res.status(404).send("State Not Found");
    return res.json(result);
});




// post data in project_map detail
router.post('/', async (req, res) => {
    // const { error } = validatedepartmentdata(req.body);
    // if (error) {
    //    return res.status(404).send(error);
    // }
    var values = req.body;
    var query = "INSERT INTO map_project_dept SET ? ";
    try {
        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId
        });
    } catch (err) {
        return res.status(404).json(err);
    }
});


// Update Department Detail
router.put('/updateMapProDetail/:id',async (req,resp)=>{
    var query = "UPDATE map_project_dept SET ? WHERE ID = ? ";
    var value = req.body;
    var ID = req.params.id;

    try{
        
       let result = await mysql.exec(query,[value, ID])
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return resp.status(404).send('error....');
        }
        return resp.json({status: "success" })    
     }
     catch(err){
            if(err){
                return resp.status(404).send('error');   
  }
}
})




// Delete departmetnt detail
    router.delete('/deleteMapdataByid/:id',async (req,res)=>{
        var query = "DELETE FROM map_project_dept WHERE ID = ?";
        var ID = req.params.id;
    try{
        let result = await mysql.exec(query, ID)
        if(result.affectedRows < 1){ //affectRows denote any changes is done through any operation (put,post)
            return res.status(404).send('error...');     
        }
        return res.json({status: "Data Deleted" })
    }
    catch(err){
        if(err){
            return res.status(404).send('error'); }
      }
    })

module.exports = router;