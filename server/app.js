const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
var config = require("config");
var morgan = require("morgan");
const multer = require("multer");
var svgCaptcha = require("svg-captcha");
var cors = require("cors");
const express = require("express"); //Load express moudule which returns a function express
const app = express(); //express fucntion retuns object of type express,by convention we call the object as app.app object support varios method get,post,put
const path = require("path");

app.use(cors());

const login = require("./routes/login");
const Student_data = require("./routes/Student_data");
const mp_work_assign = require("./routes/mp_work_assign");
const departDetail = require("./routes/departDetail");
const projectDetail = require("./routes/projectDetail");
const map_dept_project = require("./routes/map_dept_project");
const projectTypeDtail = require("./routes/projectTypeDtail");
const resource_stock_entry = require("./routes/resource_stock_entry");
const resource_assign = require("./routes/resource_assign");
const postdetails = require("./routes/postdetails");
const employeeDetail = require("./routes/employeeDetail");
const resourceStatus = require("./routes/resourceStatus");
const projectPostDetail = require("./routes/projectPostDetail");
const map_post_emp = require("./routes/map_post_emp");
const ProjectWork = require("./routes/ProjectWork");
const projectWorkDetail = require("./routes/projectWorkDetail");
const projectWorkAllotment = require("./routes/projectWorkAllotment");
const project_module = require("./routes/project_module");
const map_project_module = require("./routes/map_project_module");
const Financialyear_post = require("./routes/Financialyear_post");
const Employee_data = require("./routes/Employee_data");
const financial_budget = require("./routes/financial_budget");
const financial_budget_allotment = require("./routes/financial_budget_allotment");
const employee_resource_allotment = require("./routes/employee_resource_allotment");
const dashboardContent = require("./routes/dashboardContent");
const category_subcategory = require("./routes/category_subcategory");
const app_server = require("./routes/app_server");
const leave_request = require("./routes/leave_request");
const attendance = require('./routes/attendance');
const birthdaypop = require('./routes/birthdaypop');



console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NODE_ENV: ${process.env.DEBUG}`);
//In production we set NODE_ENV=production
console.log(`app: ${app.get("env")}`);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL error jwtPrivate not defined");
  process.exit(1);
}
const logger = require("./middleware/logger");

//To enable parsing of JSON object in the body of request

//http://expressjs.com/en/api.html#express.json
app.use(express.json());
//http://expressjs.com/en/api.html#express.urlencoded
app.use(express.urlencoded({ extended: true }));

//Configuration
//Note dont store password like things in it.password should be save in environment variable
//custom-environment-variables : contains only mapping of environment variable
//console.log('Application Name :' + config.get('name'));
//console.log('Mail Server :' + config.get('mail.host'));

if (app.get("env") === "development") {
  app.use(morgan("dev")); //Not use in production
  //console.log('Morgan Enabled');
  startupDebugger("Morgan Enabled");
  //We can set debug from environment varible
  //Set Single Debug: DEBUG=app:satartup DEBUG=
  //Set Multiple : DEBUG=app:startup,app:db
  //Set Multiple : DEBUG=app:*
  //Disable : DEBUG=
  //command to run : DEBUG=app:db nodemon app.js
}
//Db logic
dbDebugger("Connected to database");
console.log("Connected to database");

/*A middleware function is basically a function that takes a request object and return the response to client or either terminates the request/response cycle or passes control to another middleware function.Ex. Route Handler Function beacuse it take req as object and return the response to client.So it terminate the request response cycle.*/
//Another ex: express.json() when we call express.json() method this method return a middleware function the job of this middleware function is to read the request and if there is json object in the body of request it will parse the body of request into a json object then it will set it req.body property.
//express.json passes the json object to route handler function.It is builtin middleware function.
//Express application is a bunch of middleware function.
//A midleware function called in sequence

//Sattic is used to serve static data. To acess locahost:5000/readme.txt
app.use(express.static("public")); //public is name of folder
//Coustom Middlware
app.use(logger);

app.use(function (req, res, next) {
  // console.log("Authenticating");
  next();
});
app.use("/api/login", login);
app.use("/api/Student_data", Student_data);
app.use("/api/mp_work_assign", mp_work_assign);
app.use("/api/departmentDetail", departDetail);
app.use("/api/projectDetail", projectDetail);
app.use("/api/map_dept_project", map_dept_project);
app.use("/api/projectTypeDtail", projectTypeDtail);
app.use("/api/resource_stock_entry", resource_stock_entry);
app.use("/api/resource_assign", resource_assign);
app.use("/api/post", postdetails);
app.use("/api/employeeDetail", employeeDetail);
app.use("/api/resourceStatus", resourceStatus);
app.use("/api/projectPostDetail", projectPostDetail);
app.use("/api/map_post_emp", map_post_emp);
app.use("/api/ProjectWork", ProjectWork);
app.use("/api/projectWorkDetail", projectWorkDetail);
app.use("/api/projectWorkAllotment", projectWorkAllotment);
app.use("/api/projectmodule", project_module);
app.use("/api/map_project_module", map_project_module);
app.use("/api/Financialyear_post", Financialyear_post);
app.use("/api/Employee_data", Employee_data);
app.use("/api/financial_budget", financial_budget);
app.use("/api/financial_budget_allotment", financial_budget_allotment);
app.use("/api/employee_resource_allotment", employee_resource_allotment);
app.use("/api/dashboardContent", dashboardContent);
app.use("/api/category_subcategory", category_subcategory);
app.use("/api/app", app_server);
app.use("/api/leave_request",leave_request);
app.use('/api/attendance', attendance);
app.use('/api/birthdaypop', birthdaypop);


 
app.use("/api/images", express.static("documents"));
app.use("/api/uploads", express.static("uploads"));

app.get("/api/captcha", function (req, res) {
  var captcha = svgCaptcha.create({ ignoreChars: "lI0Oo" });
  // req.session.captcha = captcha.text;
  res.json(captcha);
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, "uploads"); 
    },
    filename: function (req, file, cb) {
      cb(
        null,
         Date.now() + path.extname(file.originalname)
      ); 
    },
  }),
  limits: { fileSize: 1000000000000000 }, //this for limiting file size
});

app.use("/api/images", express.static("uploads")); 


app.post("/api/uploadfile", upload.single("file_Path"), (req, resp, next) => {
  const file = req.file;
  if (!file) {
    return next("no file found");
  }
  resp.json({
    profile_url: `http://localhost:3000/api/images/${req.file.filename}`, //when we are using multer then we get file information on req.file
    // profile_url: `images/${req.file.filename}`,
    sucess: "file uploaded",
  });
  // console.log(req.file)
});

// const port = process.env.PORT || 3000;
const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
