import { sql } from "../config/db.js";
import { createProductDto, updateProductDto } from "../dtos/productDto.js";

// Un ID válido es un entero positivo que cabe en la columna SERIAL (int4).
// Cualquier otro valor (abc, -1, 99999999999) no puede existir en la tabla.
const parseId = (raw) => {
    if (!/^\d+$/.test(raw)) return null;
    const id = Number(raw);
    return id > 0 && id <= 2147483647 ? id : null;
};

const notFound = (res) =>
    res.status(404).json({ success: false, message: 'Producto no encontrado' });
//CRUD operations for products

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
        console.log('Products fetched successfully:', products);
        res.status(200).json({success: true, data: products });
    } catch (error) {
        console.log('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const getProduct = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return notFound(res);

    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;

        if (product.length === 0) return notFound(res);

        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const createProduct = async (req, res) => {  
    const parsed = createProductDto.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Datos de producto inválidos",
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { name, image, price } = parsed.data;

    try {
        const product = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${name}, ${image}, ${price})
            RETURNING *
        `;
        console.log('Product created successfully:', product);
        res.status(201).json({ success: true, data: product[0] });
    } catch (error) {
        console.log('Error creating product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const updateProduct = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return notFound(res);

    const parsed = updateProductDto.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Datos de producto inválidos",
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { name, image, price } = parsed.data;

    try {
        const product = await sql`
            UPDATE products
            SET name = ${name}, image = ${image}, price = ${price}
            WHERE id = ${id}
            RETURNING *
        `;

        if (product.length === 0) return notFound(res);

        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;

        if (product.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log('Error deleting product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}