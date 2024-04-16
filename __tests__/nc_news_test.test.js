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
            })
        })
    })
