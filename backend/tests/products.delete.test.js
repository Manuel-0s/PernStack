import request from "supertest";
import app from "../server.js";
import { sql } from "../config/db.js";

describe("DELETE /api/products/:id", () => {
    let productId;

    beforeAll(async () => {
        const [product] = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${"Producto para prueba de borrado"}, ${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhddvzkL8QugCtRugGj6Gs3tETMcxuHqN15q0QL3KvuckNILeDCBBxDtA&s=10"}, ${100})
            RETURNING id
        `;
        productId = product.id;
    });

    afterAll(async () => {
        await sql`DELETE FROM products WHERE id = ${productId}`;
    });

    it("debe borrar el producto y responder 404 al consultarlo después", async () => {
        const res = await request(app).delete(`/api/products/${productId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: { id: productId, name: "Producto para prueba de borrado" },
        });

        const consulta = await request(app).get(`/api/products/${productId}`);
        expect(consulta.statusCode).toBe(404);
        expect(consulta.body.success).toBe(false);
    });
});
