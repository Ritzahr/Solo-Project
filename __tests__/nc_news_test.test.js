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
                expect(response.body.msg).toBe("No article found under ID:9999");
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
    describe('GET /api/articles/:topic', () => {
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
        test('Returned article objects posses an additional property of \'comment_count\' and \'body\' is not present', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                articles.forEach((article) => {
                    expect(article).toHaveProperty("comment_count");
                    expect(article).not.toHaveProperty("body");
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
        test('GET /api/articles/:topic, responds with articles who match the requested topic', () => {
            return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles.length).toBeGreaterThan(0)
                articles.forEach((article) => {
                    expect(article.topic).toEqual("cats")
                    expect(article).toHaveProperty("comment_count")
                })
            }) 
        });
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
                expect(response.body.msg).toBe("No article found under ID:8888")
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
    describe('PATCH /api/articles/:article_id', () => {
        test('PATCH /api/articles/:article_id, should update article by id, with provided positive integer', () => {
            const newVote = 10
            const update = { inc_votes: newVote };

            return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send(update)
            .then((response) => {
                const updatedArticle = response.body.article
                expect(updatedArticle.votes).toBe(110);
            })
        });
        test('PATCH /api/articles/:article_id, should update article by id, with provided negative integer', () => {
            const newVote2 = -100;
            const update2 = { inc_votes: newVote2 };

            return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send(update2)
            .then((response) => {
                const updatedArticle2 = response.body.article
                expect(updatedArticle2.votes).toBe(0);
            })
        });
        test('PATCH /api/articles/:article_id, responds with status code 400, when user requests with an invalid ID', () => {
            const newVote = 10
            const update = { inc_votes: newVote };

            return request(app)
            .patch("/api/articles/one")
            .expect(400)
            .send(update)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request")
                
            })
        });
        test('PATCH /api/articles/:article_id, responds with status code 404, when user requests with an non-existent article, ', () => {
            const newVote = 10
            const update = { inc_votes: newVote };

            return request(app)
            .patch("/api/articles/888")
            .expect(404)
            .send(update)
            .then((response) => {
                expect(response.body.msg).toBe("No article found under ID:888")
                
            })
        });
        test('PATCH /api/articles/:article_id, responds with status code 400, when user requests with a malformed body', () => {
            const update = { };

            return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send(update)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request")
            })
        });
        test('PATCH /api/articles/:article_id, responds with status code 400, when user requests with an incorrect type input in body', () => {
            const newVote = "plus 100"
            const update = { inc_votes: newVote };

            return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send(update)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request")
            })
        });
    });
    describe('DELETE /api/comments/:comment_id', () => {
        test('Delete comment by comment ID, respond with 204 and no content', () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then((response)=> {
                expect(response.body).toEqual({})
            })
        });
        test('Delete comment by comment ID, respond with 404 and error message when resource to be deleted is non-existent', () => {
            return request(app)
            .delete("/api/comments/555")
            .expect(404)
            .then((response)=> {
               expect(response.body.msg).toBe("No comment found under ID:555")
            })
        });
        test('Delete comment by comment ID, respond with 400 and error message when requested with an invalid ID', () => {
            return request(app)
            .delete("/api/comments/one")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request")
            })
        })
    });
    describe('GET /api/users', () => {
        test('GET /api/users responds with an array of objects, each possessing username, name and avatar_url properties', () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((response)=> {
                const users = response.body.users
                
                expect(users.length).toBe(4)
                users.forEach((user)=>{
                    expect(user).toHaveProperty("username");
                    expect(user).toHaveProperty("name");
                    expect(user).toHaveProperty("avatar_url");
                })
            })
        })
        test('GET /api/users responds with error 404a and \'Path Not Found\', when requested with a spelling mistake', () => {
            return request(app)
            .get("/api/userssss")
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Path Not Found")
            })
        });
    }); 