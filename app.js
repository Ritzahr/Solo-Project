const express = require("express");
const { sendTopics, sendEndpointList, sendArticleByID, sendAllArticles, sendAllCommentsByID } = require("./controller/nc_news-controllers");
const app = express(); 

app.get("/api/topics", sendTopics);

app.get("/api", sendEndpointList);

app.get("/api/articles/:article_id", sendArticleByID);

app.get("/api/articles", sendAllArticles);

app.get("/api/articles/:article_id/comments", sendAllCommentsByID)

app.all("*", (req,res,next) => {
    res.status(400).send({msg: "Path Not Found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({ msg: err.msg})
        } 
    else if (err.code === '22P02') {
            res.status(400).send({ msg: "Invalid Input"});}
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})
module.exports = app;