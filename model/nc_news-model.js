const e = require("express");
const db = require("../db/connection");
const format = require("pg-format");


exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((response) => {
        return response.rows
}).catch((err) => {
    if (err) {
        console.log(err.code)
        return err.code
    }
})
}

exports.selectArticleByID = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        return result.rows[0]
    })

}