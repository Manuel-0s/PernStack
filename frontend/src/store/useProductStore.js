import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = 'https://localhost:3000';
export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({ products: response.data.data, error: false });
        } catch (err) {
            if (err.response == 429) {
                set({ error: 'Too many requests. Please try again later.' });
            } else {
                set({ error: 'An error occurred while fetching products.' });
            }
        } finally {
            set({ loading: false });
        }
    }
}));