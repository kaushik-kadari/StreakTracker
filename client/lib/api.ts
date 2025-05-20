const API_URL = process.env.NEXT_PUBLIC_API_URL;

// console.log(API_URL);

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

        return response.json()
    }, 

    register: async (userData: { name: string; email: string; password: string }) => {
        if (!userData) throw new Error('User data is required');

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
    getStreaks: async (token: string | null) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/streaks`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch streaks');
        }

        return response.json();
    },

    createStreak: async (token: string | null, streakData: { name: string; description: string }) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/streaks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(streakData),
        });

        if (!response.ok) {
            throw new Error('Failed to create streak');
        }

        return response.json();
    },

    updateStreak: async (token: string | null, id: string, streakData: { name?: string; description?: string }) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/streaks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(streakData),
        });

        if (!response.ok) {
            throw new Error('Failed to update streak');
        }

        return response.json();
    },

    completeStreak: async (token: string | null, id: string) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/streaks/${id}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to complete streak');
        }

        return response.json();
    },

    deleteStreak: async (token: string | null, id: string) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/streaks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete streak');
        }
    },

    // Task endpoints
    getTasks: async (token: string | null) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        return response.json();
    },

    createTask: async (token: string | null, taskData: { task: string; completed?: boolean; }) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        return response.json();
    },

    updateTask: async (token: string | null, id: string, taskData: { task?: string; completed?: boolean }) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        return response.json();
    },

    toggleTask: async (token: string | null, id: string) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to toggle task');
        }

        return response.json();
    },

    deleteTask: async (token: string | null, id: string) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        return response.json();
    },

    // User endpoints
    updateProfile: async (data: { 
        name?: string; 
        email?: string; 
        currentPassword?: string; 
        newPassword?: string;
    }, token: string | null) => {
        if (!token) throw new Error('Authentication token is required');

        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to update profile');
        }

        return response.json();
    },
};
