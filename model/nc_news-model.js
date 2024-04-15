const e = require("express");
const db = require("../db/connection");


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