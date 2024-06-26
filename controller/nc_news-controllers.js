const { fetchTopics, selectArticleByID, selectAllArticles, selectAllCommentsByID, addCommentByID, modifyArticleByID, selectCommentByID, selectCommentToBeDeleted, selectAllUsers} = require("../model/nc_news-model")
const endpoints = require("../endpoints.json");

exports.sendTopics = (req, res, next) => {
    return fetchTopics().then((response) => {
            res.status(200).send({ topics: response })
        }).catch(next);
    };

exports.sendEndpointList = (req, res, next) => { 
    res.status(200).send({ endpoints })
}

exports.sendArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    return selectArticleByID(article_id)
    .then((article)=>{
        res.status(200).send({ article })
    }).catch(next);
}

exports.sendAllArticles = (req, res, next) => {
    let { topic } = req.query
    return selectAllArticles(topic).then((articles) => {
        res.status(200).send({articles: articles});
    }).catch((err) => {
        next(err)
    })
};

exports.sendAllCommentsByID = (req, res, next) => {
    const { article_id } = req.params;
    return selectArticleByID(article_id).then(() =>{
        return selectAllCommentsByID(article_id).then(( comments)=>{
        res.status(200).send({comments: comments})
    })
    }).catch((err) => {
        next(err)
    })
}

exports.postCommentsByID = (req, res, next) =>{
    const { article_id } = req.params;
    const comment = req.body;
    return addCommentByID(comment, article_id).then((comment) => {
        res.status(200).send({comment: comment});
    }).catch((err) => {
        err.hint = [article_id, comment.username]
        next(err)
    })
}

exports.updateArticlesByID = (req, res, next) => {
    const { article_id} = req.params;
    const instructions = req.body
   
    return selectArticleByID(article_id).then(() => {
        return modifyArticleByID(article_id, instructions).then((newArticle) => {
            res.status(200).send({ article: newArticle })
        })
    }).catch((err) => {
        next(err)
    })
}
exports.deleteCommentByID = (req,res,next) => {
    const { comment_id } = req.params; 
    
    return selectCommentToBeDeleted(comment_id).then((comment)=>{
        res.status(204).send({ comment: comment })
    }).catch((err) => {
        next(err)
    })
}

exports.sendAllUsers =(req,res,next) => {
    return selectAllUsers().then((users)=> {

        res.status(200).send({users: users})
    })
}