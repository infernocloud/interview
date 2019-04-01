const express = require("express");
const server = express();
const boilerplate = require("./boilerplate/boilerplate.js");

server.set("port", process.env.PORT || 3000);

// Boilerplate routes
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

server.get("/boilerplate.json", (req, res) => {
  res.json(boilerplate.obj());
  // res.sendFile(__dirname + "/boilerplate/boilerplate.json");
});

server.listen(3000, () => {
  console.log("Express server started at port 3000 http://localhost:3000/");
});
