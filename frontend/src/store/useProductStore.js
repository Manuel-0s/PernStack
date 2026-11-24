import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,

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
