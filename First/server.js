const http = require('http');
const fs = require("fs");
const hostname = '127.0.0.1';
const port = process.env.PORT || 80;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
//   user     : 'dbuser',
//   password : 's3kreee7'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();

function application() {
    this.routing = new Object();
    this.publics = undefined;
}
application.prototype.use = function (a, b) {
    this.routing[a] = b;
}
application.prototype.route = function (req, res) {
    res.send = function (data) { application.prototype.sendingFunction(res, data); }
    let routeFunc = this.routing[req.url];
    // console.log( this.routing );
    if (routeFunc != undefined) {
        routeFunc(req, res);
    } else if (this.publics != undefined && fs.existsSync(this.publics + req.url)) {
        res.end(fs.readFileSync(this.publics + req.url));
    } else {
        res.statusCode = 404;
        res.end("Error: 404, resource not found");
    }
}
application.prototype.setPublic = function (path) {
    this.publics = path;
}
application.prototype.sendingFunction = function (res, data) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(data);
}

const app = new application();
const server = http.createServer(function (req, res) {
    app.route(req, res);
});

app.setPublic(__dirname + "/public");
app.use("/", function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
});
app.use("/you-not-bad-guy", function (req, res) {
    res.send("<h1>Welcome back, admin</h1>");
});
app.use("/server.js", function (req, res) {
    res.send(fs.readFileSync("server.js"));
})
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});