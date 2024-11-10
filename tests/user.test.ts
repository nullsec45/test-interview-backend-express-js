import supertest from "supertest";
import { server } from "../src/applications/server";
import { logger } from "../src/applications/logger";
import {createUser, deleteUser} from "./utils/UserUtils";

describe("POST /api/v1/users/auth/register", () => {
    afterEach(async() => {
        await deleteUser();
    });

    it("should be reject register new user if request is invalid", async() => {
        const response=await supertest(server).post("/api/v1/users/auth/register").send({
            username:"",
            password:"",
            name:""
        });

        logger.info(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should be able register new user", async() => {
        const response=await supertest(server).post("/api/v1/users/auth/register").send({
            username:"test",
            password:"test",
            name:"test"
        });

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });
});

describe("POST /api/v1/users/auth/login", () => {
    beforeEach(async () => {
        await createUser();
    });

    afterEach(async () => {
        await deleteUser();
    });

    it("should be able to login", async() => {
        const response=await supertest(server).post("/api/v1/users/auth/login")
                                              .send({
                                                    username:"test",
                                                    password:"test"
                                               });

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });

    it("should reject login user if username is wrong", async() => {
        const response=await supertest(server)
                            .post("/api/v1/users/auth/login")
                            .send({
                                username:"salah",
                                password:"test"
                            });

        logger.info(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject login user if password is wrong", async() => {
        const response=await supertest(server)
                            .post("/api/v1/users/auth/login")
                            .send({
                                username:"test",
                                password:"salah"
                            });

        logger.info(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject login user if request is invalid", async() => {
        const response=await supertest(server)
                            .post("/api/v1/users/auth/login")
                            .send({
                                username:"",
                                password:""
                            });

        logger.info(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});