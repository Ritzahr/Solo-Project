const express = require("express");
const { sendTopics, sendEndpointList } = require("./controller/nc_news-controllers");
const app = express(); 

app.get("/api/topics", sendTopics);

app.get("/api", sendEndpointList)

app.all("*", (req,res,next) => {
    res.status(404).send({msg: "Path not found"})
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})
module.exports = app;