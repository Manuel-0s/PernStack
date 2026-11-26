import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

// Arma un mensaje legible a partir de la respuesta de error del backend.
const getErrorMessage = (err, fallback) => {
    if (!err.response) return 'No se pudo conectar con el servidor';
    const { message, errors } = err.response.data ?? {};
    const detalles = errors ? Object.values(errors).flat().join('. ') : '';
    return [message, detalles].filter(Boolean).join(': ') || fallback;
};

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,

    // HU03: edición de un producto
    currentProduct: null, // último dato confirmado por el backend
    productError: null,
    saving: false,

    formData: {
        name: '',
        price: '',
        image: '',
    },

    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: '', price: '', image: '' } }),

    addProduct: async (e) => {
        e.preventDefault();
        set({ loading: true });

        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            toast.success('Product added successfully');
            document.getElementById('add_product_modal')?.close();
        } catch (err) {
            console.log('Error in addProduct:', err);
            const message = err.response?.data?.message || 'Something went wrong';
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true, currentProduct: null, productError: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data });
        } catch (err) {
            set({ productError: getErrorMessage(err, 'No se pudo cargar el producto') });
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id, data) => {
        set({ saving: true });
        try {
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, data);
            const updated = response.data.data;
            // Solo se actualiza el catálogo cuando el backend confirma el cambio.
            set((state) => ({
                currentProduct: updated,
                products: state.products.map((p) => (p.id === updated.id ? updated : p)),
            }));
            toast.success('Product updated successfully');
            return { ok: true };
        } catch (err) {
            // Si falla no se toca currentProduct ni products: se conserva
            // el último dato confirmado y la vista decide cómo mostrar el error.
            return { ok: false, message: getErrorMessage(err, 'No se pudo guardar el cambio') };
        } finally {
            set({ saving: false });
        }
    },

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({ products: response.data.data, error: null });
        } catch (err) {
            if (err.response?.status === 429) {
                set({ error: 'Too many requests. Please try again later.' });
            } else {
                set({ error: 'An error occurred while fetching products.' });
            }
        } finally {
            set({ loading: false });
        }
    },
}));
