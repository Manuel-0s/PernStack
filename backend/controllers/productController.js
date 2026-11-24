import { sql } from "../config/db.js";
import { createProductDto } from "../dtos/productDto.js";
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
    const { id } = req.params;
    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;

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
    const { id } = req.params;
    const { name, image, price } = req.body;

    if (!name || !image || !price) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const product = await sql`
            UPDATE products
            SET name = ${name}, image = ${image}, price = ${price}
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