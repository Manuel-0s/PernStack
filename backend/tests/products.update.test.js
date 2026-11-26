import request from "supertest";
import app from "../server.js";
import { sql } from "../config/db.js";

const IMAGE = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500";
const VALID_BODY = { name: "Producto HU03 editado", price: 250.5, image: IMAGE };

describe("PUT /api/products/:id", () => {
    let productId;

    // Se crea un producto propio para no tocar los datos reales del catálogo.
    beforeAll(async () => {
        const [product] = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${"Producto HU03 original"}, ${IMAGE}, ${100})
            RETURNING id
        `;
        productId = product.id;
    });

    afterAll(async () => {
        await sql`DELETE FROM products WHERE id = ${productId}`;
    });

    it("debe responder 200 al editar y el cambio persiste al consultar de nuevo", async () => {
        const res = await request(app).put(`/api/products/${productId}`).send(VALID_BODY);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: { id: productId, name: "Producto HU03 editado", price: "250.50" },
        });

        // "Recargar": una consulta nueva debe devolver el dato editado.
        const lista = await request(app).get("/api/products");
        expect(lista.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: productId, name: "Producto HU03 editado", price: "250.50" }),
            ])
        );
    });

    it("debe responder 404 cuando el ID no existe", async () => {
        const res = await request(app).put("/api/products/2147483647").send(VALID_BODY);

        expect(res.statusCode).toBe(404);
        expect(res.body).toMatchObject({ success: false, message: "Producto no encontrado" });
    });

    it.each(["abc", "-1", "0", "99999999999"])(
        "debe responder 404 (y no 500) cuando el ID no es válido: %s",
        async (id) => {
            const res = await request(app).put(`/api/products/${id}`).send(VALID_BODY);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        }
    );

    it("debe responder 400 con un precio inválido y conservar el dato anterior", async () => {
        const antes = await request(app).get(`/api/products/${productId}`);

        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send({ ...VALID_BODY, name: "No debe guardarse", price: -50 });

        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({ success: false, errors: { price: expect.any(Array) } });

        const despues = await request(app).get(`/api/products/${productId}`);
        expect(despues.body.data).toEqual(antes.body.data);
    });
});

describe("GET /api/products/:id", () => {
    it("debe responder 404 cuando el producto no existe", async () => {
        const res = await request(app).get("/api/products/2147483647");

        expect(res.statusCode).toBe(404);
        expect(res.body).toMatchObject({ success: false });
    });
});
