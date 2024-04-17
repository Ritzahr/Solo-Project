const db = require("../db/connection");
const format = require("pg-format");


exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((response) => {
        return response.rows
}).catch((err) => {
    if (err) {
        return err.code
    }
})
}

exports.selectArticleByID = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: `No article found under ID: ${article_id}`})
        }
        return result.rows[0]
    })
}
exports.selectAllArticles = () => {
    return db.query(`
     SELECT articles.*, COUNT(articles.article_id) AS comment_count
     FROM articles 
     LEFT JOIN comments 
     ON articles.article_id = comments.article_id 
     GROUP BY articles.article_id 
     ORDER BY created_at DESC
     ;`).then((result) => {
       const articlesModified = result.rows;
       articlesModified.forEach((article)=>{ 
        delete article.body;
       })
       return articlesModified
    }).catch((err)=>{
        if(err) {
            console.log(err)
        }
    })
}





// "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.comment_id = articles.article_id GROUP BY articles.article_id;"