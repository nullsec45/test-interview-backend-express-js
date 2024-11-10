import { server } from "../src/applications/server";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import {
    removeTestOrder
} from "./utils/OrderUtils";
import {createUser, deleteUser} from "./utils/UserUtils";
import { createTestFood, removeTestFood } from "./utils/FoodUtils";



describe("POST /api/v1/orders", function(){
    let food:any=null;

    beforeEach(async() => {
        await createUser();
        food=await createTestFood();
    })

    afterEach(async () => {
        await removeTestOrder();
        await removeTestFood();
        await deleteUser();
    });

    it("should can create order", async() => {
        const result=await supertest(server).post("/api/v1/orders")
                                            .set("X-API-TOKEN","test")
                                            .send({
                                                foodId:food.id,
                                                quantity:3,
                                                money_fractions:10000,
                                                money_totals:20000
                                            });

        logger.info(result.body.data);

        expect(result.body.data.receipt.foodId).toBe(food.id);
        expect(result.body.data.money_refund).toBe(2000);
        expect(result.body.data.receipt.total).toBe(18000);
    });

    it("should reject if body request is not valid", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","test")
                            .send({
                                foodId:"",
                                quantity:"",
                                money_fractions:"",
                                money_totals:""
                            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if token is missing", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","")
                            .send({
                                foodId:food.id,
                                quantity:3,
                                money_fractions:10000,
                                money_totals:20000
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Token is missing");
    });

    it("should reject if token is invalid", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","wrong")
                            .send({
                                foodId:food.id,
                                quantity:3,
                                money_fractions:10000,
                                money_totals:20000
                            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toBe("Unauthorized: Invalid token");
    });

    it("should reject if money is not enough", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","test")
                            .send({
                                foodId:food.id,
                                quantity:3,
                                money_fractions:10000,
                                money_totals:15000
                            });

        logger.info(result.body);

        expect(result.status).toBe(422);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if food is out of stock", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","test")
                            .send({
                                foodId:food.id,
                                quantity:55,
                                money_fractions:10000,
                                money_totals:335000
                            });

        logger.info(result.body);

        expect(result.status).toBe(422);
        expect(result.body.errors).toBeDefined();
    });

     it("should reject if money_fractions not be one of [2000, 5000, 10000, 20000, 50000]", async() => {
        const result=await supertest(server)
                            .post("/api/v1/orders")
                            .set("X-API-TOKEN","test")
                            .send({
                                foodId:food.id,
                                quantity:3,
                                money_fractions:1000,
                                money_totals:20000
                            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});