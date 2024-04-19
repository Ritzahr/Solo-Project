const express = require("express");
const { sendTopics, sendEndpointList, sendArticleByID, sendAllArticles, sendAllCommentsByID, postCommentsByID, updateArticlesByID, deleteCommentByID, sendAllUsers } = require("./controller/nc_news-controllers");
const app = express(); 


app.use(express.json());

app.get("/api/topics", sendTopics);

app.get("/api", sendEndpointList);

app.get("/api/articles/:article_id", sendArticleByID);

app.get("/api/articles", sendAllArticles);

app.get("/api/articles/:article_id/comments", sendAllCommentsByID)

app.get("/api/users", sendAllUsers)

app.post("/api/articles/:article_id/comments", postCommentsByID)

app.patch("/api/articles/:article_id", updateArticlesByID)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.all("*", (req,res,next) => {
    res.status(404).send({msg: "Path Not Found"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {res.status(err.status).send({ msg: err.msg})}
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg:"Bad Request" });
    } else if (err.code ==="23502") {
        res.status(400).send({ msg: "Bad Request" })
    } else if (err.code === "23503" && err.constraint === 'comments_author_fkey') {
        res.status(404).send({ msg:`Username ${err.hint[1]}, not found!`})
    } else if (err.code === "23503" && err.constraint === 'comments_article_id_fkey') {
            res.status(404).send({ msg:`No article found under ID:${err.hint[0]}`})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})
module.exports = app;