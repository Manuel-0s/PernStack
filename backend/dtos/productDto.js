import { z } from "zod";

// Registrar (POST) y editar (PUT) un producto usan los mismos campos.
const productFields = {
    name: z.string({ error: "El nombre es obligatorio" })
        .trim()
        .min(1, "El nombre no puede estar vacío")
        .max(255, "El nombre no puede superar 255 caracteres"),
    price: z.coerce.number({ error: "El precio debe ser numérico" })
        .positive("El precio debe ser un número positivo")
        .max(99999999.99, "El precio es demasiado alto")
        .refine((v) => Math.round(v * 100) / 100 === v, "El precio admite máximo 2 decimales"),
    image: z.string({ error: "La imagen es obligatoria" })
        .trim()
        .max(255, "La URL no puede superar 255 caracteres")
        .url("La imagen debe ser una URL válida")
        .refine((u) => /^https?:\/\//.test(u), "La URL debe empezar con http:// o https://"),
};

export const createProductDto = z.object(productFields);
export const updateProductDto = z.object(productFields);
