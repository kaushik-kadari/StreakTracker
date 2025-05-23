const API_URL = process.env.NEXT_PUBLIC_API_URL;

// console.log(API_URL);

export const api = {
    // Auth endpoints
    login: async (credentials: { email: string; password: string }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            return data;
        } finally {
            setIsLoading?.(false);
        }
    }, 

    register: async (userData: { name: string; email: string; password: string }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    // Streak endpoints
    getStreaks: async (token: string | null, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/streaks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch streaks');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    createStreak: async (token: string | null, streakData: { name: string; description: string }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/streaks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(streakData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create streak');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    updateStreak: async (token: string | null, id: string, streakData: { name?: string; description?: string }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
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
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    completeStreak: async (token: string | null, id: string, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/streaks/${id}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to complete streak');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    deleteStreak: async (token: string | null, id: string, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/streaks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete streak');
            }
            return true;
        } finally {
            setIsLoading?.(false);
        }
    },

    // Task endpoints
    getTasks: async (token: string | null, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    createTask: async (token: string | null, taskData: { task: string; completed?: boolean; }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create task');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    updateTask: async (token: string | null, id: string, taskData: { task?: string; completed?: boolean }, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update task');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    toggleTask: async (token: string | null, id: string, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to toggle task');
            }
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },

    deleteTask: async (token: string | null, id: string, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete task');
            }
            return true;
        } finally {
            setIsLoading?.(false);
        }
    },

    // User endpoints
    updateProfile: async (data: { 
        name?: string; 
        email?: string; 
        currentPassword?: string; 
        newPassword?: string;
    }, token: string | null, setIsLoading?: (loading: boolean) => void) => {
        try {
            setIsLoading?.(true);
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
            return await response.json();
        } finally {
            setIsLoading?.(false);
        }
    },
};
