const { fetchTopics } = require("../model/nc_news-model")

exports.sendTopics = (req, res, next) => {
    return fetchTopics().then((response) => {
            res.status(200).send(response)
        }).catch(next);
    };

// // exports.notFound = (req, res, next) => {
// //     return 
// }