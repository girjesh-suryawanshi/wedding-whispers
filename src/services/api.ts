const API_URL = 'http://localhost:3000/api';

export const api = {
    getWeddingByToken: async (token: string) => {
        const response = await fetch(`${API_URL}/weddings/${token}`);
        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Failed to fetch wedding');
        }
        const data = await response.json();
        return [data]; // Return as array to match previous Supabase RPC format
    },

    getWeddingEvents: async (weddingId: string) => {
        const response = await fetch(`${API_URL}/weddings/${weddingId}/events`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return await response.json();
    }
};
