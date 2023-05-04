var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'st_2' 
  });
  
 
  conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected with App...');
  });
   

  app.get('/api/todolist',(req, res) => {
    let sqlQuery = "SELECT * FROM todolist";
    
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
  });

  app.get('/api/todolist/:id',(req, res) => {
    let sqlQuery = "SELECT * FROM todolist WHERE id=" + req.params.id;
      
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
  });
     

  app.post('/api/todolist',(req, res) => {
    let data = {work_to_do: req.work_done.work_to_do, work_done: req.work_done.work_done};
    
    let sqlQuery = "INSERT INTO todolist SET ?";
    
    let query = conn.query(sqlQuery, data,(err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
  });
     
  app.put('/api/todolist/:id',(req, res) => {
    let sqlQuery = "UPDATE todolist SET work_to_do='"+req.work_done.work_to_do+"', work_done='"+req.work_done.work_done+"' WHERE id="+req.params.id;
    
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
  });
  
  app.delete('/api/todolist/:id',(req, res) => {
    let sqlQuery = "DELETE FROM todolist WHERE id="+req.params.id+"";
      
    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
        res.send(apiResponse(results));
    });
  });
    
  function apiResponse(results){
      return JSON.stringify({"status": 200, "error": null, "response": results});
  }
     
  
  
  
var task = ["Social studies project", "Make a To-do list"];
 
var complete = ["sleep before 2a.m."];
 
app.post("/addtask", function(req, res) {
var newTask = req.body.newtask;
task.push(newTask);
res.redirect("/");
var sql = "INSERT INTO todolist (id, work_to_do) VALUES ?";
var values =[[, newTask]];
conn.query(sql, [values], function (err, result){
  if (err) throw err;
  console.log("done");
})
});
 
app.post("/removetask", function(req, res) {
var completeTask = req.body.check;
var sql = "INSERT INTO todolist (id, work_done) VALUES ?";
if (typeof completeTask === "string") {
  var values =[[, completeTask]]; 
  conn.query(sql, [values], function (err, result){
    if (err) throw err;
    console.log("done");
  });
  conn.query("DELETE FROM todolist WHERE id=?" , completeTask, function (err, result){
    if (err) throw err;
    console.log("deleted");
  });
  conn.query("SELECT * FROM todolist WHERE work_done " , function (err, result){
    if (err) throw err;
    todolist=JSON.parse(JSON.stringify(result));
    console.log("deleted");
  }) 
complete.push(completeTask);
task.splice(task.indexOf(completeTask), 1);
} else if (typeof completeTask === "object") {
for (var i = 0; i < completeTask.length; i++) {
complete.push(completeTask[i]);
/*var sql = "INSERT INTO todolist (id, work_done) VALUES ?";
var values =[[, completeTask]];
conn.query(sql, [values], function (err, result){
  if (err) throw err;
  console.log("done");
})
conn.query("INSERT FROM todolist WHERE work_done=?" , completeTask, function (err, result){
  if (err) throw err;
  console.log("deleted");
});*/
task.splice(task.indexOf(completeTask[i]), 1);
}
}
res.redirect("/");
});
 
app.get("/", function(req, res) {
res.render("index", { task: task, complete: complete });
});


 

app.listen(3030, function() {
console.log("  App Server is running on port 3030!");
});