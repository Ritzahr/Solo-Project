const { fetchTopics, selectArticleByID, selectAllArticles } = require("../model/nc_news-model")
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