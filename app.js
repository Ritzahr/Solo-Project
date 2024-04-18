const express = require("express");
const { sendTopics, sendEndpointList, sendArticleByID, sendAllArticles, sendAllCommentsByID, postCommentsByID } = require("./controller/nc_news-controllers");
const app = express(); 


app.use(express.json());

app.get("/api/topics", sendTopics);

app.get("/api", sendEndpointList);

app.get("/api/articles/:article_id", sendArticleByID);

app.get("/api/articles", sendAllArticles);

app.get("/api/articles/:article_id/comments", sendAllCommentsByID)

app.post("/api/articles/:article_id/comments", postCommentsByID)


app.all("*", (req,res,next) => {
    res.status(404).send({msg: "Path Not Found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({ msg: err.msg})
        } 
    else if (err.code === '22P02') {
            res.status(400).send({ msg:"Bad Request" });}

    next(err)
})

app.use((err, req, res, next) => {
    if (err.code ==="23502") {
        res.status(400).send({ msg: "Bad Request" })
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})
module.exports = app;