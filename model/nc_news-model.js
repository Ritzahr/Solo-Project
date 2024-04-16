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
    return db.query("SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.comment_id = articles.article_id GROUP BY articles.article_id;").then((result) => {
       console.log(result.rows)
       return result.rows
    })
}
/*SELECT animal_name
FROM animals
LEFT JOIN northcoders ON northcoders.favourite_animal_id = animals.animal_id
GROUP BY animals.animal_id;
*/
// return db.query("SELECT * FROM articles ;").then((result)=>{
//     const articles = result.rows;
//      articles.forEach((article) => {
//          return db.query("SELECT * FROM comments WHERE article_id=$1", [article.article_id]).then((comments) => {
//             article.comment_count=comments.rows.length
//             // console.log(article)
//             return article
//         })
//     })
//     console.log(articles)
//     return articles
// })