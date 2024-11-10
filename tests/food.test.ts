import { server } from "../src/applications/server";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import {
    removeTestFood, 
    createTestFood,
    getTestFood,
    createManyTestFood,
    foodArr
} from "./utils/FoodUtils";
import {createUser, deleteUser} from "./utils/UserUtils";

describe("POST /api/v1/foods", function(){
    beforeEach(async() => {
        await createUser();
    });

    afterEach(async () => {
       await removeTestFood();
       await deleteUser();
    });

    it("should can create food", async() => {
        const result=await supertest(server).post("/api/v1/foods")
                                            .set("X-API-TOKEN","test")
                                            .send({
                                                name:"Biscuit",
                                                price:6000,
                                                stock:50
                                            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("Biscuit");
        expect(result.body.data.price).toBe(6000);
        expect(result.body.data.stock).toBe(50);
    });

    it("should reject if request is not valid", async() => {
        const result=await supertest(server)
                            .post("/api/v1/foods")
                            .set("X-API-TOKEN","test")
                            .send({
                                name:"",
                                price:"",
                                stock:""
                            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if token is missing", async() => {
        const result=await supertest(server)
                            .post("/api/v1/foods")
                            .set("X-API-TOKEN","")
                            .send({
                                name:"Biscuit",
                                price:6000,
                                stock:50
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Token is missing");
    });

    it("should reject if token is invalid", async() => {
        const result=await supertest(server)
                            .post("/api/v1/foods")
                            .set("X-API-TOKEN","salah")
                            .send({
                                name:"Biscuit",
                                price:6000,
                                stock:50
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Invalid token");
    });
});

describe("GET /api/v1/foods/:id", function(){
    let food:any=null;

    beforeEach(async() => {
        food=await createTestFood();
    });

    afterEach(async () => {
       await  removeTestFood();
    });

    it("should can get food", async() => {
        const result=await supertest(server).get("/api/v1/foods/"+food.id);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(food.id);
        expect(result.body.data.name).toBe(food.name);
    });

    it("should return 404 if food id is not found", async () => {
         const result = await supertest(server)
                              .get("/api/v1/foods/99")

         expect(result.status).toBe(404);
     });
});

describe("PUT /api/v1/foods/:id", function(){
    let food:any=null;

    beforeEach(async() => {
        await createUser();
        food=await createTestFood();
    });

    afterEach(async () => {
       await deleteUser();
       await removeTestFood();
    });

    it("should can update food", async() => {
        console.log(food);
        const result=await supertest(server)
                           .put("/api/v1/foods/"+food.id)
                           .set("X-API-TOKEN","test")
                           .send({
                                name:"Biscuit Update",
                                price:9000,
                                stock:40
                           });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(food.id);
        expect(result.body.data.name).toBe("Biscuit Update");
    });

    it("should return 404 if food id is not found", async () => {
        const result = await supertest(server).put("/api/v1/foods/99")
                                              .set("X-API-TOKEN","test")
                                              .send({
                                                    name:"Biscuit Update",
                                                    price:6000,
                                                    stock:50
                                               });

        expect(result.status).toBe(404);
    });

    it("should reject if request body is not valid", async() => {
        const result=await supertest(server).put("/api/v1/foods/"+food.id)
                                            .set("X-API-TOKEN","test")
                                            .send({
                                                name:"",
                                                price:"",
                                                stock:""
                                            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });


    it("should reject if token is missing", async() => {
        const result=await supertest(server)
                           .put("/api/v1/foods/"+food.id)
                            .set("X-API-TOKEN","")
                            .send({
                                name:"Biscuit",
                                price:9000,
                                stock:40
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Token is missing");
    });

    it("should reject if token is invalid", async() => {
        const result=await supertest(server)
                           .put("/api/v1/foods/"+food.id)
                            .set("X-API-TOKEN","salah")
                            .send({
                                name:"Biscuit",
                                price:9000,
                                stock:40
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Invalid token");
    });
});

describe("DELETE /api/v1/foods/:id", function(){
    let food:any=null;

    beforeEach(async() => {
        await createUser();
        food=await createTestFood();
    });

    afterEach(async () => {
       await deleteUser();
       await removeTestFood();
    });

    it("should can delete food", async() => {
        let testFood = await getTestFood();

        const result=await supertest(server)
                            .delete("/api/v1/foods/"+testFood.id)
                            .set("X-API-TOKEN","test");

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Delete Success");

        testFood = await getTestFood();
        expect(testFood).toBeNull();
    });

    it("should return 404 if food id is not found", async () => {
        const result = await supertest(server)
                            .delete("/api/v1/foods/99")
                            .set("X-API-TOKEN","test");

        expect(result.status).toBe(404);
    });

    it("should reject if token is missing", async() => {
        let testFood = await getTestFood();

        const result=await supertest(server)
                            .delete("/api/v1/foods/"+testFood.id)
                            .set("X-API-TOKEN","")
                            .send({
                                name:"Test"
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Token is missing");
    });

    it("should reject if token is invalid", async() => {
        let testFood = await getTestFood();

        const result=await supertest(server)
                            .delete("/api/v1/foods/"+testFood.id)
                            .set("X-API-TOKEN","salah")
                            .send({
                                name:"Test"
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Invalid token");
    });
});

describe("GET /api/v1/foods", function(){
    let food:any=null;

    beforeEach(async() => {
        food=await createManyTestFood();
    });

    afterEach(async () => {
       await removeTestFood();
    });

    it("should can get all foods", async() => {
        const result=await supertest(server).get("/api/v1/foods");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(foodArr.length);
    });
});