const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    getWeddingByToken: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/weddings/${token}`);
        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Failed to fetch wedding');
        }
        const data = await response.json();
        return [data]; // Return as array to match previous Supabase RPC format
    },

    getWeddingEvents: async (weddingId: string) => {
        const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return await response.json();
    },

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        return await response.json(); // Returns { url: string }
    },

    saveWedding: async (weddingData: any) => {
        const response = await fetch(`${API_BASE_URL}/weddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weddingData),
        });

        if (!response.ok) throw new Error('Failed to save wedding');
        return await response.json();
    },

    getWeddingByUser: async (userId: string) => {
        const response = await fetch(`${API_BASE_URL}/weddings/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user wedding');
        return await response.json();
    }
};
