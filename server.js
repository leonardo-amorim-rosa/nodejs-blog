var http = require("http");
var fs = require("fs");
var path = require("path")
var mime = require("mime");

function send404(resp) {
  resp.writeHead(404, {"Content-Type":"text/plain"});
  resp.write("Error 404, resource not found");
  resp.end();
}

function sendPage(resp, filePath, fileContents) {
  resp.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
  resp.end(fileContents);
}

function serverWorking(resp, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          sen404(resp);
        } else {
          sendPage(resp, absPath, data);
        }
      });
    } else {
      send404(resp);
    }
  });
}

var server = http.createServer(function(req, resp) {
  var filePath = false;

  if (req.url == '/') {
    filePath = "public/index.html";
  } else {
    filePath = "public" + req.url;
  }

  var absPath = "./" + filePath;
  serverWorking(resp, absPath);
});

var port_number = server.listen(process.env.PORT || 3000, function(port_number) {
  console.log("port_number: " + port_number);
});
