const db = require("../db/connection");
const format = require("pg-format");


exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then((response) => {
        return response.rows
})
}

exports.selectArticleByID = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: `No article found under ID:${article_id}`})
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
    })
}

exports.selectAllCommentsByID = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1`,[article_id]).then((response) => {
        const comments = response.rows;
        return comments
    })
}

exports.addCommentByID = (comment, article_id) => {
    const { username, body} = comment;
  
    return db.query(`
    INSERT INTO comments 
    (author, body, article_id)
    VALUES ($1, $2, $3) 
    RETURNING *
    ;`, 
    [username, body, article_id])
    .then((response) => {
        return response.rows[0]
    })
}

exports.modifyArticleByID = ( id, instructions) => {
    
    const { inc_votes } = instructions;
    return db.query(`
    UPDATE articles
    SET votes=votes + $1
    WHERE article_id=$2
    RETURNING *
    ;`, [inc_votes,id]).then((response) => {
        
        return response.rows[0]
    })
}
exports.selectCommentByID = (comment_id) => {
    
    return db.query(`
    DELETE FROM comments
    WHERE comment_id=$1
   
    ;`, [comment_id]).then((results) => {
        return results.rows
    })
}