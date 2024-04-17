const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json");


beforeEach(() => seed(data))
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('GET /api/topics, responds with a status code of 200', () => {
        return request(app).get("/api/topics").expect(200)
        });
    test('GET /api/topics, responds with a status code of 200 and an array of topics', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                expect(res.body.topics.length).toEqual(3)
            })
        });
    test('GET /api/topics, responds with status code of 200 and an array of topics, with properties of ``slug`` and ``description``', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res)=>{
            const topics = res.body.topics;
            topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug");
                expect(topic).toHaveProperty("description");
            })
        }) 
    });
    test("GET /api/topics, responds with an error of 404, when passed an invalid path", () => {
        return request(app)
        .get("/api/givemetopics")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Path not found");
        })
    })
    });
    describe('GET /api', () => {
        test('Responds with an object providing a description of all endpoints available so far', () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then((res) => {
                const endpointObject = res.body;
                expect(endpointObject).toEqual({endpoints})
            })
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('Responds with status code 200 and an article object, with the correct properties', () => {
            return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then((response)=>{
                const article = response.body.article;
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("body");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");

                expect(article.article_id).toEqual(4);
            })
        })
        test('Responds with status code 404 and error message regarding the ID, when user inputs ID that cannot be found in database', () => {
            return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("No article found under ID: 9999");
            })
        });
        test('Responds with status code 400 and error message, when user inputs an malformed request.', () => {
            return request(app)
            .get("/api/articles/six")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Invalid input");
            })
        });
    })
    describe('GET /api/articles', () => {
        test('Responds with status code 200 and an articles array, with article objects and correct length.' , () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(Array.isArray(articles)).toBe(true);
                articles.forEach((article) => {
                    expect(typeof article).toBe("object")
                })
                expect(articles.length).toBe(13);
            })
        });
        test('Returned article objects posses an additional property of \'comment_count\'', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                articles.forEach((article) => {
                    expect(article).toHaveProperty("comment_count");
                }) 
            })    
        })
        test('Property \'comment_count\', now has a value of the number of comments who share that article ID', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                articles.forEach((article) => {
                    if(article.article_id === 1) {
                        expect(article.comment_count).toBe("11")  
                    }
                    if(article.article_id === 3) {
                        expect(article.comment_count).toBe("2")  
                    }
                    if(article.article_id === 5) {
                        expect(article.comment_count).toBe("2")  
                    }
                    if(article.article_id === 6) {
                        expect(article.comment_count).toBe("1")  
                    }
                    if(article.article_id === 9) {
                        expect(article.comment_count).toBe("2")  
                    }
                })   
           })    
        })
        test('Test that property \'body\' is not present inside the article objects', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response)=>{
                const articles = response.body.articles;
                articles.forEach((article) => {
                    expect(article).not.toHaveProperty("body");
                })
            })
        })
})