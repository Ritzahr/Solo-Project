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
            expect(res.body.msg).toBe("Path Not Found");
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
                expect(response.body.msg).toBe("Bad Request");
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
                expect(articles.length).toBe(13);
                expect(Array.isArray(articles)).toBe(true);
                articles.forEach((article) => {
                    expect(typeof article).toBe("object")
                })
               
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
        test('Responds with 404 status code and error message, if provided a malformed path', () =>{
          return request(app)
          .get("/api/articlez")
          .expect(404)
          .then((response)=>{
            expect(response.body.msg).toBe("Path Not Found");
          })  
        })
})
    describe('GET /api/articles/:article_id/comments', () => {
        test('GET /api/articles/:article_id/comments responds with an array of comments for the given article ID', () => {
            return request(app)
            .get("/api/articles/1/comments")
            .then((response) =>{
                const comments = response.body.comments
                expect(Array.isArray(comments)).toBe(true)
                expect(comments.length).toBe(11);
            })
        });
        test('Test whether all comments responded with, possess correct properties', () => {
            return request(app)
            .get("/api/articles/1/comments")
            .then((response) =>{
                const comments = response.body.comments
                comments.forEach((comment)=>{
                    expect(comment).toHaveProperty("comment_id")
                    expect(comment).toHaveProperty("votes")
                    expect(comment).toHaveProperty("created_at")
                    expect(comment).toHaveProperty("author")
                    expect(comment).toHaveProperty("body")
                    expect(comment).toHaveProperty("article_id")
                    expect(comment.article_id).toBe(1)
                })
            })
        })
        });
        test('GET /api/articles/:article_id/comments responds with \'Invalid Input\' message and 400 code, when requested with the wrong input type for ID', () => {
            return request(app)
            .get("/api/articles/Seven/comments")
            .expect(400)
            .then((response)=> {
                expect(response.body.msg).toBe("Bad Request")
            })
        });
        test('GET /api/articles/:article_id/comments returns 404, when article ID is not found', () => {
            return request(app)
            .get("/api/articles/8888/comments")
            .expect(404)
            .then((response)=> {
                expect(response.body.msg).toBe("No article found under ID: 8888")
            })
        });

    describe('POST /api/articles/:article_id/comments', () => {
        test('POST /api/articles/:article_id/comments, posts a new comment to our array of comments by article ID.', () => {
            const body = "This is an added comment"
            const userData = data.userData[0].username;

            return request(app)
            .post("/api/articles/6/comments")
            .expect(200)
            .send({ username: userData, body: body,})
            .then((response)=>{
                const postedComments = response.body.comment;
                expect(postedComments).toHaveProperty("author");
                expect(postedComments).toHaveProperty("body");
            })
        });
        test('POST /api/articles/:article_id/comments, responds with a status code 400, when missing required fields in body', () => {
    
            return request(app)
            .post("/api/articles/9/comments")
            .expect(400)
            .send({ })
            .then((response)=>{
                expect(response.body.msg).toBe("Bad Request");
            })
        });
        test('POST /api/articles/:article_id/comments, responds with a status code of 404, when article ID is not found in db', () => {
            const body = "This is an added comment"
            const userData = data.userData[1].username;

            return request(app)
            .post("/api/articles/777/comments")
            .expect(404)
            .send({ username: userData, body: body })
            .then((response)=>{
                expect(response.body.msg).toBe("No article found under ID:777")
            })
        });
        test('POST /api/articles/:article_id/comments, responds with a status code of 404, when username is not found in db', () => {
            const body = "This is an added comment"
            const userData = "fake_youser";

            return request(app)
            .post("/api/articles/9/comments")
            .expect(404)
            .send({ username: userData, body: body })
            .then((response)=>{
                expect(response.body.msg).toBe(`Username ${userData}, not found!`)
            });
        })
    })