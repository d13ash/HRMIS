
var mysql = require('mysql');
var config = require('config');

var exec = function (query, params) {
  return new Promise((resolve, reject) => {
    

    if (!query) {

      return reject("Query not found");
    }
    console.log('1');
    var connection = mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      port: config.get('db.port'), 

      multipleStatements: true
    });
 
    

    connection.connect(function (err) {

      if (err) {

        return reject(err);


      }

      var q = connection.query(query, params, function (err, results) {

        connection.end();
        if (err) { return reject(err); }
        return resolve(results);
      });
    });


  });
};

// var execWithTransaction = function (query, params) {
//   return new Promise((resolve, reject) => {

//     if (!query) {

//       return reject("Query not found");
//     }
//     // console.log('1');
//     var connection = mysql.createConnection({
//       host: config.get('db.host'),
//       user: config.get('db.user'),
//       password: config.get('db.password'),
//       database: config.get('db.database'),

//       multipleStatements: true
//     });

//     connection.connect(function (err) {

//       if (err) {

//         return reject(err);


//       }
   
      
//       var q = connection.query(query, params, function (err, results) {

//         connection.end();
//         if (err) { return reject(err); }
//         return resolve(results);
//       });
//     });


//   });
// };




module.exports.exec = exec;