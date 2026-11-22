import request from "supertest";
import app from "../server.js";

describe("POST /api/products", () => {
    it("debe responder 201 al registrar un producto válido", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({
                name: "Mouse Gamer Test",
                price: 599.99,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
            });

        expect({ status: res.statusCode, body: res.body }).toMatchObject({
            status: 201,
            body: {
                success: true,
                data: {
                    id: expect.any(Number),
                    name: "Mouse Gamer Test",
                },
            },
        });
    });

    it("debe responder 400 cuando el precio es inválido y no crear registro", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({
                name: "Producto Inválido",
                price: -50,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
            });

        expect({ status: res.statusCode, body: res.body }).toMatchObject({
            status: 400,
            body: {
                success: false,
                errors: {
                    price: expect.any(Array),
                },
            },
        });
    });
});
