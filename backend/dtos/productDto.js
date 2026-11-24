import { z } from "zod";

export const createProductDto = z.object({
    name: z.string({ required_error: "El nombre es obligatorio" })
        .trim()
        .min(1, "El nombre no puede estar vacío"),
    price: z.coerce.number({ invalid_type_error: "El precio debe ser numérico" })
        .positive("El precio debe ser un número positivo"),
    image: z.string({ required_error: "La imagen es obligatoria" })
        .trim()
        .url("La imagen debe ser una URL válida"),
});
