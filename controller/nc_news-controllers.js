const { fetchTopics, selectArticleByID, selectAllArticles, selectAllCommentsByID, addCommentByID } = require("../model/nc_news-model")
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
    return selectAllArticles().then((articles) => {
        res.status(200).send({articles: articles});
    }).catch(next)
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
    })
}