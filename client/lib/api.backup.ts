import { useAuth } from './auth-context';

const API_URL = 'http://localhost:5000/api';

export const api = {
    // Auth endpoints
    login: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    register: async (userData: { name: string; email: string; password: string }) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    // Streak endpoints
    getStreaks: async () => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/streaks`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },

    createStreak: async (streakData: { name: string; description: string }) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/streaks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(streakData),
        });
        return response.json();
    },

    updateStreak: async (id: string, streakData: { name?: string; description?: string }) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/streaks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(streakData),
        });
        return response.json();
    },

    completeStreak: async (id: string) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/streaks/${id}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },

    deleteStreak: async (id: string) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/streaks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },

    // Task endpoints
    getTasks: async () => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },

    createTask: async (taskData: { task: string; completed?: boolean; }) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        return response.json();
    },

    updateTask: async (id: string, taskData: { task?: string; completed?: boolean }) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        return response.json();
    },

    toggleTask: async (id: string) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },

    deleteTask: async (id: string) => {
        const auth = useAuth();
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        });
        return response.json();
    },
};
