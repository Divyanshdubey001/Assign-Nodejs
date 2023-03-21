//********Defining path for the files************/

const path = require("path");

//absolute path for server.js
let serverpath = path.resolve("./server.js");
console.log("Absolute path for server.js--->", serverpath);

//absolute path for index.html
let indexpath = path.resolve("./index.html");
console.log("Absolute path for index.html--->", indexpath);

//relative path for index.html
let indexrelative = path.relative("/node", "index.html");
console.log("Relative path for index.html--->", indexrelative);

//absolute path for app.js
const apppath = path.resolve("./app.js");
console.log("Absolute path for app.js--->", apppath);

/*----------------------------------------------------------------*/

/*********Capturing data on server************/

const http = require("http");

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url === "/") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(jsonData);
          if (req.url === "/captain") {
            res.write(data.captain);
          }
          res.writeHead(201, { "Content-Type": "application/json" });
          res.write(JSON.stringify(jsonData));
          res.end();
        } catch (err) {
          console.log(err);
          res.end();
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Data Not Found");
      res.end();
    }
  })
  .listen(9000, () => console.log("Server running on port 9000"));

/*---------------------------------------------------------------------*/

/*handle both json/form data without specifying which format of data is being received-*/

const queryString = require("querystring");

http
  .createServer((res, req) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.end("end", () => {
      const contentType = req.header["Content-Type"];
      if (contentType === "application/json") {
        const data = JSON.parse(body);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid Data Type");
      }
    });
  })
  .listen(3000, () => console.log("Server is running on port 3000"));

/*-----------------------------------------------------------------------------*/

/*Create server, send json data in request from postman, parse in on the server and send html
response with entire parsed data information*/

http
  .createServer((req, res) => {
    let body = "";
    req.on("body", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const contentdataType = req.header["Content-Type"];
      if (contentdataType === "application/json") {
        const data = JSON.parse(body);
        const html = (
          <html>
            <body>
              <h2>${data.name}</h2>
              <p>${data.email}</p>
            </body>
          </html>
        );
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else if (contentdataType === "application/x-www-form-urlencoded") {
        const data = queryString.parse(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid Data");
      }
    });
  })
  .listen(3000, () => console.log("Server is running on port 3000"));

/*-------------------------------------------------------------------------*/
