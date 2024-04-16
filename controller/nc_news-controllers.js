const { fetchTopics, selectArticleByID } = require("../model/nc_news-model")
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
        if(article === "22P02") 
        {res.status(400).send({msg: "Invalid input"})}
        else
        {res.status(200).send({ article })}
    }).catch(next);

}
